import type { KernelAPI } from './KernelAPI.interface';
import type { CardModel } from '../../domain/card/entities/CardModel.entity';
import type { CardDefinition } from '../../domain/card/interfaces/CardDefinition.interface';
import type { CardState } from '../../domain/card/entities/CardState.entity';
import type { CardId } from '../../domain/card/value-objects/CardId.vo';
import type { Theme } from '../../domain/theme/entities/Theme.entity';
import type { BoardService } from '../services/BoardService.service';
import type { CardRefreshService } from '../services/CardRefreshService.service';
import type { ThemeService } from '../services/ThemeService.service';
import { CardDefinitionAdapter } from '../../domain/card/adapters/CardDefinitionAdapter';

export class KernelImpl implements KernelAPI {
  private listeners: Set<() => void> = new Set();

  constructor(
    private boardService: BoardService,
    private cardRefreshService: CardRefreshService,
    private themeService: ThemeService
  ) {
    this.themeService.subscribe(() => this.notifyListeners());
    this.cardRefreshService.setOnStateChange(() => this.notifyListeners());
  }

  public registerCard<T>(cardDefinition: CardDefinition<T>): void {
    const cardModelResult = CardDefinitionAdapter.toCardModel(cardDefinition);
    if (cardModelResult.isFailure) {
      throw new Error(`Failed to convert CardDefinition to CardModel: ${cardModelResult.getError()}`);
    }

    const cardModel = cardModelResult.getValue();

    const registerResult = this.boardService.registerCardDefinition(cardDefinition, cardModel);
    if (registerResult.isFailure) {
      throw new Error(registerResult.getError() as string);
    }

    if (cardModel.data.refresh.hasAutoRefresh()) {
      this.cardRefreshService.startAutoRefresh(cardModel.cardId);
    }

    if (!cardModel.data.refresh.skipInitialFetch) {
      this.cardRefreshService.refreshCard(cardModel.cardId);
    }

    this.notifyListeners();
  }

  public unregisterCard(cardId: CardId): void {
    this.cardRefreshService.stopAutoRefresh(cardId);

    const unregisterResult = this.boardService.unregisterCard(cardId);
    if (unregisterResult.isFailure) {
      throw new Error(unregisterResult.getError() as string);
    }

    this.notifyListeners();
  }

  public getRegisteredCards(): CardDefinition<any>[] {
    return this.boardService.getAllCardDefinitions();
  }

  public getCardState(cardId: CardId): CardState | undefined {
    return this.boardService.getCardState(cardId);
  }

  public requestRefresh(cardId: CardId): void {
    void this.cardRefreshService.refreshCard(cardId);
  }

  public requestRefreshAll(): void {
    void this.cardRefreshService.refreshAll();
  }

  public getTheme(): Theme {
    return this.themeService.getTheme();
  }

  public toggleTheme(): void {
    this.themeService.toggleTheme();
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.add(listener);

    return () => {
      this.listeners.delete(listener);
    };
  }

  public cleanup(): void {
    this.cardRefreshService.cleanup();
    this.themeService.cleanup();
    this.listeners.clear();
  }

  private notifyListeners(): void {
    for (const listener of this.listeners) {
      try {
        listener();
      } catch (error) {
        console.error('Kernel listener error:', error);
      }
    }
  }
}
