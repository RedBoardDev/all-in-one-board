import { Result } from '@aob/shared';
import type { CardId } from '../../domain/card/value-objects/CardId.vo';
import type { BoardService } from './BoardService.service';
import type { CardDataPort } from '../ports/CardDataPort.interface';
import type { LoggerPort } from '../ports/LoggerPort.interface';

export class CardRefreshService {
  private onStateChange?: () => void;
  private inFlight: Map<string, Promise<Result<void>>> = new Map();
  private globalRefreshPromise: Promise<Result<void>> | null = null;

  constructor(
    private boardService: BoardService,
    private dataPort: CardDataPort,
    private logger: LoggerPort
  ) {}

  public async refreshCard(cardId: CardId): Promise<Result<void>> {
    const cardIdValue = cardId.toValue();
    const existing = this.inFlight.get(cardIdValue);
    if (existing) {
      return existing;
    }

    const cardModel = this.boardService.getCardModel(cardId);
    const cardState = this.boardService.getCardState(cardId);
    if (!cardModel || !cardState) {
      return Result.fail(`Card ${cardIdValue} not found`);
    }

    cardState.startLoading();
    this.notifyStateChange();

    const promise: Promise<Result<void>> = (async () => {
      try {
        const result = await this.dataPort.fetchData(cardId);

        if (result.isFailure) {
          const error = new Error(result.getError());
          cardState.setError(error);
          this.logger.error(`Card ${cardIdValue} refresh failed`, error);
          this.notifyStateChange();
          return Result.fail(`Failed to refresh card: ${result.getError()}`);
        }

        cardState.setData(result.getValue());
        this.logger.debug(`Card ${cardIdValue} refreshed successfully`);
        this.notifyStateChange();
        return Result.ok();
      } catch (error) {
        cardState.setError(error);
        this.logger.error(`Card ${cardIdValue} refresh failed`, error);
        this.notifyStateChange();
        return Result.fail(`Failed to refresh card: ${error}`);
      } finally {
        this.inFlight.delete(cardIdValue);
      }
    })();

    this.inFlight.set(cardIdValue, promise);
    return promise;
  }

  public async refreshAll(): Promise<Result<void>> {
    if (this.globalRefreshPromise) {
      return this.globalRefreshPromise;
    }

    const cardModels = this.boardService.getAllCardModels();
    this.logger.info(`Refreshing ${cardModels.length} cards`);

    const promise: Promise<Result<void>> = (async () => {
      try {
        const results = await Promise.allSettled(
          cardModels.map((model) => this.refreshCard(model.cardId))
        );

        const failures = results.filter((r) => r.status === 'fulfilled' && r.value.isFailure);
        const rejects = results.filter((r) => r.status === 'rejected');

        if (failures.length > 0 || rejects.length > 0) {
          this.logger.warn(`${failures.length + rejects.length} cards failed to refresh`);
        }

        return Result.ok();
      } finally {
        this.globalRefreshPromise = null;
      }
    })();

    this.globalRefreshPromise = promise;
    return promise;
  }

  public cleanup(): void {
    this.inFlight.clear();
    this.globalRefreshPromise = null;
  }

  public setOnStateChange(handler: () => void): void {
    this.onStateChange = handler;
  }

  private notifyStateChange(): void {
    if (!this.onStateChange) {
      return;
    }

    try {
      this.onStateChange();
    } catch (error) {
      this.logger.error('CardRefreshService state change listener error', error);
    }
  }
}
