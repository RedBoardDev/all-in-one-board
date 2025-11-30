import type { CardId } from '../value-objects/CardId.vo';
import type { LayoutConstraints } from '../value-objects/LayoutConstraints.vo';
import type { CardRenderProps } from '../../../presentation/contracts/CardRenderProps.contract';
import type { CardSkeletonProps } from '../../../presentation/contracts/CardSkeletonProps.contract';
import type { CardErrorProps } from '../../../presentation/contracts/CardErrorProps.contract';

export type RateLimitFallback = 'cache' | 'error';

export interface RateLimitPolicyConfig {
  windowMs: number;
  maxRequests: number;
  fallback?: RateLimitFallback;
}

export interface DataPolicyConfig {
  source: string;
  resourceIds: string[];
  cacheTtlMs?: number;
  rateLimit?: RateLimitPolicyConfig;
  batch?: boolean;
  batchWindowMs?: number;
}

/**
 * * Behavior configuration for card rendering
 *
 * Note: This is the interface type for CardDefinition.
 * The Value Object CardBehavior class is used internally by the kernel.
 */
export interface CardBehaviorConfig {
  useDefaultSkeleton?: boolean; // default: true
  useDefaultError?: boolean;    // default: true
}

/**
 * * Main contract for card definitions
 *
 * This is the interface that card developers implement.
 * The kernel uses this to manage card state, refresh, and rendering.
 */
export interface CardDefinition<TData> {
  id: CardId;
  title: string;
  layout: LayoutConstraints;

  // * Data fetching (completely free-form)
  getData: () => Promise<TData> | TData;

  // * Rendering
  // Note: Using React.ReactElement type - React types should be available
  // in packages that use cards (like @aob/cards and @aob/web)
  // null is allowed as React components can return null
  render: (props: CardRenderProps<TData>) => React.ReactElement | null;

  // * Optional: custom skeleton and error rendering
  renderSkeleton?: (props: CardSkeletonProps) => React.ReactElement | null;
  renderError?: (props: CardErrorProps) => React.ReactElement | null;

  behavior?: CardBehaviorConfig;

  dataPolicy?: DataPolicyConfig;

  borderColor?: string;

  externalLink?: string;
}
