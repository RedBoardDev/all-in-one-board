import type { CardDefinition, DataPolicyConfig, RateLimitPolicyConfig } from '@aob/core';
import type { BatchFetcherMap, SourceDefaultsMap } from '@aob/cards';

type LoggerLike = {
  debug: (msg: string, meta?: unknown) => void;
  info: (msg: string, meta?: unknown) => void;
  warn: (msg: string, meta?: unknown) => void;
  error: (msg: string, meta?: unknown, err?: unknown) => void;
};

interface CacheEntry {
  data: unknown;
  expiresAt: number;
}

interface RateLimitState {
  windowStart: number;
  count: number;
}

interface NormalizedPolicy {
  source: string;
  resourceIds: string[];
  cacheTtlMs: number;
  rateLimit?: RateLimitPolicyConfig;
  batch: boolean;
  batchWindowMs: number;
}

interface BatchQueue {
  resourceIds: Set<string>;
  requests: Map<
    string,
    Array<{
      resolve: (value: unknown) => void;
      reject: (reason?: unknown) => void;
      policy: NormalizedPolicy;
      card: CardDefinition<any>;
    }>
  >;
  timer?: ReturnType<typeof setTimeout>;
}

export class RateLimitedError extends Error {
  constructor(public readonly source: string) {
    super(`Rate limit exceeded for source ${source}`);
    this.name = 'RateLimitedError';
  }
}

export interface ApiGatewayOptions {
  defaultPolicies?: SourceDefaultsMap;
  batchFetchers?: BatchFetcherMap;
  logger?: LoggerLike;
}

export class ApiGatewayService {
  private cache = new Map<string, CacheEntry>();
  private inFlight = new Map<string, Promise<unknown>>();
  private rateLimits = new Map<string, RateLimitState>();
  private batchQueues = new Map<string, BatchQueue>();

  constructor(private readonly options: ApiGatewayOptions = {}) {}

  public async fetchCardData(card: CardDefinition<any>): Promise<unknown> {
    const policy = this.normalizePolicy(card);

    if (policy.batch && this.hasBatchFetcher(policy.source)) {
      return this.fetchWithBatch(policy, card);
    }

    return this.fetchWithoutBatch(policy, card);
  }

  private async fetchWithoutBatch(policy: NormalizedPolicy, card: CardDefinition<any>): Promise<unknown> {
    const resourceId = policy.resourceIds[0] ?? card.id.toValue();
    const cacheKey = this.cacheKey(policy.source, resourceId);

    return this.fetchWithCacheAndRateLimit(policy, cacheKey, async () => {
      return await Promise.resolve(card.getData());
    });
  }

  private async fetchWithBatch(policy: NormalizedPolicy, card: CardDefinition<any>): Promise<unknown> {
    // Handle multi-resource cards by returning a map of resourceId -> data
    if (policy.resourceIds.length > 1) {
      const entries = await Promise.all(
        policy.resourceIds.map((id) => this.fetchBatchResource(policy, card, id))
      );

      return policy.resourceIds.reduce<Record<string, unknown>>((acc, id, idx) => {
        acc[id] = entries[idx];
        return acc;
      }, {});
    }

    return this.fetchBatchResource(policy, card, policy.resourceIds[0]);
  }

  private async fetchBatchResource(policy: NormalizedPolicy, card: CardDefinition<any>, resourceId: string): Promise<unknown> {
    const cacheKey = this.cacheKey(policy.source, resourceId);
    const fresh = this.getFreshCache(cacheKey);
    if (fresh !== undefined) {
      return fresh;
    }

    const existing = this.inFlight.get(cacheKey);
    if (existing) {
      return existing;
    }

    const queue = this.batchQueues.get(policy.source) ?? {
      resourceIds: new Set<string>(),
      requests: new Map<string, Array<{ resolve: (v: unknown) => void; reject: (r?: unknown) => void; policy: NormalizedPolicy; card: CardDefinition<any> }>>(),
    };

    const promise = new Promise<unknown>((resolve, reject) => {
      const arr = queue.requests.get(resourceId) ?? [];
      arr.push({ resolve, reject, policy, card });
      queue.requests.set(resourceId, arr);
      queue.resourceIds.add(resourceId);
    });

    const inFlightPromise = promise.finally(() => {
      this.inFlight.delete(cacheKey);
    });

    this.inFlight.set(cacheKey, inFlightPromise);

    if (!queue.timer) {
      queue.timer = setTimeout(() => this.flushBatch(policy.source), policy.batchWindowMs);
    }

    this.batchQueues.set(policy.source, queue);
    return inFlightPromise;
  }

  private async flushBatch(source: string): Promise<void> {
    const queue = this.batchQueues.get(source);
    if (!queue) return;

    this.batchQueues.delete(source);
    if (queue.timer) {
      clearTimeout(queue.timer);
    }

    const resourceIds = Array.from(queue.resourceIds);
    const firstRequestList = queue.requests.values().next().value as Array<{ policy: NormalizedPolicy }> | undefined;
    const policy = firstRequestList?.[0]?.policy;

    const rateLimit = policy?.rateLimit;
    if (rateLimit && !this.consumeRateLimit(source, rateLimit)) {
      resourceIds.forEach((id) => {
        const cacheKey = this.cacheKey(source, id);
        const reqs = queue.requests.get(id) ?? [];
        const stale = this.shouldUseCacheOnLimit(policy) ? this.getStaleCache(cacheKey) : undefined;
        const error = new RateLimitedError(source);
        stale !== undefined
          ? reqs.forEach(({ resolve }) => resolve(stale))
          : reqs.forEach(({ reject }) => reject(error));
      });
      return;
    }

    try {
      const fetcher = this.options.batchFetchers?.[source];
      if (!fetcher) {
        throw new Error(`No batch fetcher registered for source ${source}`);
      }

      const resultMap = await fetcher(resourceIds);

      for (const id of resourceIds) {
        const cacheKey = this.cacheKey(source, id);
        const reqs = queue.requests.get(id) ?? [];
        const data = resultMap.get(id);

        if (data !== undefined) {
          const ttl = this.maxCacheTtl(reqs.map((r) => r.policy));
          this.setCache(cacheKey, data, ttl);
          reqs.forEach(({ resolve }) => resolve(data));
          continue;
        }

        const stale = this.getStaleCache(cacheKey);
        if (stale !== undefined) {
          reqs.forEach(({ resolve }) => resolve(stale));
        } else {
          const error = new Error(`No data returned for resource ${id} (source ${source})`);
          reqs.forEach(({ reject }) => reject(error));
        }
      }
    } catch (error) {
      this.options.logger?.warn(`Batch fetch failed for source ${source}`, error as unknown);

      resourceIds.forEach((id) => {
        const cacheKey = this.cacheKey(source, id);
        const reqs = queue.requests.get(id) ?? [];
        const stale = this.getStaleCache(cacheKey);

        if (stale !== undefined) {
          reqs.forEach(({ resolve }) => resolve(stale));
        } else {
          reqs.forEach(({ reject }) => reject(error));
        }
      });
    }
  }

  private async fetchWithCacheAndRateLimit(
    policy: NormalizedPolicy,
    cacheKey: string,
    fetcher: () => Promise<unknown>
  ): Promise<unknown> {
    const fresh = this.getFreshCache(cacheKey);
    if (fresh !== undefined) {
      return fresh;
    }

    const existing = this.inFlight.get(cacheKey);
    if (existing) {
      return existing;
    }

    if (policy.rateLimit && !this.consumeRateLimit(policy.source, policy.rateLimit)) {
      const stale = this.shouldUseCacheOnLimit(policy) ? this.getStaleCache(cacheKey) : undefined;
      if (stale !== undefined) {
        return stale;
      }
      throw new RateLimitedError(policy.source);
    }

    const promise = (async () => {
      try {
        const data = await fetcher();
        this.setCache(cacheKey, data, policy.cacheTtlMs);
        return data;
      } catch (error) {
        const stale = this.getStaleCache(cacheKey);
        if (stale !== undefined) {
          this.options.logger?.warn(`Fetch failed, serving stale cache for ${cacheKey}`, error as unknown);
          return stale;
        }
        throw error;
      }
    })();

    this.inFlight.set(cacheKey, promise);
    promise.finally(() => this.inFlight.delete(cacheKey));

    return promise;
  }

  private normalizePolicy(card: CardDefinition<any>): NormalizedPolicy {
    const rawPolicy: DataPolicyConfig | undefined = card.dataPolicy;
    const sourceDefaults = rawPolicy?.source
      ? this.options.defaultPolicies?.[rawPolicy.source]
      : undefined;

    const source = rawPolicy?.source ?? card.id.toValue();
    const resourceIds = rawPolicy?.resourceIds?.length ? rawPolicy.resourceIds : [card.id.toValue()];
    const cacheTtlMs = rawPolicy?.cacheTtlMs ?? sourceDefaults?.cacheTtlMs ?? 0;
    const rateLimit = rawPolicy?.rateLimit ?? sourceDefaults?.rateLimit;
    const batch = rawPolicy?.batch ?? sourceDefaults?.batch ?? false;
    const batchWindowMs = rawPolicy?.batchWindowMs ?? sourceDefaults?.batchWindowMs ?? 25;

    return {
      source,
      resourceIds,
      cacheTtlMs,
      rateLimit,
      batch,
      batchWindowMs,
    };
  }

  private cacheKey(source: string, resourceId: string): string {
    return `${source}:${resourceId}`;
  }

  private getFreshCache(key: string): unknown | undefined {
    const entry = this.cache.get(key);
    if (!entry) return undefined;
    if (Date.now() <= entry.expiresAt) {
      return entry.data;
    }
    return undefined;
  }

  private getStaleCache(key: string): unknown | undefined {
    return this.cache.get(key)?.data;
  }

  private setCache(key: string, data: unknown, ttlMs: number): void {
    if (ttlMs <= 0) return;
    this.cache.set(key, {
      data,
      expiresAt: Date.now() + ttlMs,
    });
  }

  private consumeRateLimit(source: string, policy: RateLimitPolicyConfig): boolean {
    const now = Date.now();
    const state = this.rateLimits.get(source);

    if (!state || now - state.windowStart > policy.windowMs) {
      this.rateLimits.set(source, { windowStart: now, count: 1 });
      return true;
    }

    if (state.count >= policy.maxRequests) {
      return false;
    }

    state.count += 1;
    this.rateLimits.set(source, state);
    return true;
  }

  private maxCacheTtl(policies: NormalizedPolicy[]): number {
    if (!policies.length) return 0;
    return Math.max(...policies.map((p) => p.cacheTtlMs ?? 0));
  }

  private hasBatchFetcher(source: string): boolean {
    return Boolean(this.options.batchFetchers?.[source]);
  }

  private shouldUseCacheOnLimit(policy?: NormalizedPolicy): boolean {
    return (policy?.rateLimit?.fallback ?? 'cache') !== 'error';
  }
}
