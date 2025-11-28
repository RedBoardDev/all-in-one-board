import { Result } from '@aob/shared';
import { CardId } from '../../domain/card/value-objects/CardId.vo';
import type { BoardService } from './BoardService.service';
import type { CardDataPort } from '../ports/CardDataPort.interface';
import type { TimePort } from '../ports/TimePort.interface';
import type { LoggerPort } from '../ports/LoggerPort.interface';
import type { TimerId } from '../ports/TimerId.type';

export class CardRefreshService {
  private timers: Map<string, TimerId> = new Map();
  private onStateChange?: () => void;

  constructor(
    private boardService: BoardService,
    private dataPort: CardDataPort,
    private timePort: TimePort,
    private logger: LoggerPort
  ) {}

  public startAutoRefresh(cardId: CardId): Result<void> {
    const cardModel = this.boardService.getCardModel(cardId);
    if (!cardModel) {
      return Result.fail(`Card ${cardId.toValue()} not found`);
    }

    const refreshPolicy = cardModel.data.refresh;
    if (!refreshPolicy.hasAutoRefresh()) {
      return Result.ok();
    }

    const intervalMs = refreshPolicy.intervalMs!;
    const cardIdValue = cardId.toValue();

    if (this.timers.has(cardIdValue)) {
      this.stopAutoRefresh(cardId);
    }

    const timerId = this.timePort.setInterval(() => {
      this.refreshCard(cardId);
    }, intervalMs);

    this.timers.set(cardIdValue, timerId);
    this.logger.debug(`Auto-refresh started for card ${cardIdValue} (${intervalMs}ms)`);

    return Result.ok();
  }

  public stopAutoRefresh(cardId: CardId): void {
    const cardIdValue = cardId.toValue();
    const timerId = this.timers.get(cardIdValue);

    if (timerId !== undefined) {
      this.timePort.clearInterval(timerId);
      this.timers.delete(cardIdValue);
      this.logger.debug(`Auto-refresh stopped for card ${cardIdValue}`);
    }
  }

  public async refreshCard(cardId: CardId): Promise<Result<void>> {
    const cardModel = this.boardService.getCardModel(cardId);
    const cardState = this.boardService.getCardState(cardId);
    if (!cardModel || !cardState) {
      return Result.fail(`Card ${cardId.toValue()} not found`);
    }

    cardState.startLoading();
    this.notifyStateChange();

    try {
      const result = await this.dataPort.fetchData(cardId);

      if (result.isFailure) {
        const error = new Error(result.getError());
        cardState.setError(error);
        this.logger.error(`Card ${cardId.toValue()} refresh failed`, error);
        this.notifyStateChange();
        return Result.fail(`Failed to refresh card: ${result.getError()}`);
      }

      cardState.setData(result.getValue());
      this.logger.debug(`Card ${cardId.toValue()} refreshed successfully`);
      this.notifyStateChange();
      return Result.ok();
    } catch (error) {
      cardState.setError(error);
      this.logger.error(`Card ${cardId.toValue()} refresh failed`, error);
      this.notifyStateChange();
      return Result.fail(`Failed to refresh card: ${error}`);
    }
  }

  public async refreshAll(): Promise<Result<void>> {
    const cardModels = this.boardService.getAllCardModels();
    const refreshableCards = cardModels.filter(
      (model) => model.data.refresh.enableGlobalRefresh
    );

    this.logger.info(`Refreshing ${refreshableCards.length} cards`);

    const results = await Promise.allSettled(
      refreshableCards.map((model) => this.refreshCard(model.cardId))
    );

    const failures = results.filter((r) => r.status === 'rejected');
    if (failures.length > 0) {
      this.logger.warn(`${failures.length} cards failed to refresh`);
    }

    return Result.ok();
  }

  public stopAllAutoRefresh(): void {
    for (const cardIdValue of this.timers.keys()) {
      const cardIdResult = CardId.create(cardIdValue);
      if (cardIdResult.isSuccess) {
        this.stopAutoRefresh(cardIdResult.getValue());
      }
    }
  }

  public cleanup(): void {
    this.stopAllAutoRefresh();
    this.timers.clear();
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
