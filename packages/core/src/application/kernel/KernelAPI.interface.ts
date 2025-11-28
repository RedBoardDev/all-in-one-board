import type { CardModel } from '../../domain/card/entities/CardModel.entity';
import type { CardState } from '../../domain/card/entities/CardState.entity';
import type { CardId } from '../../domain/card/value-objects/CardId.vo';
import type { Theme } from '../../domain/theme/entities/Theme.entity';

export interface KernelAPI {
  registerCard<T>(cardModel: CardModel<T>): void;
  unregisterCard(cardId: CardId): void;

  getRegisteredCards(): CardModel<any>[];
  getCardState(cardId: CardId): CardState | undefined;

  requestRefresh(cardId: CardId): void;
  requestRefreshAll(): void;

  getTheme(): Theme;
  toggleTheme(): void;

  subscribe(listener: () => void): () => void;

  cleanup(): void;
}


