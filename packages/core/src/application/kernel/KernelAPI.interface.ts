import type { CardModel } from '../../domain/card/entities/CardModel.entity';
import type { CardDefinition } from '../../domain/card/interfaces/CardDefinition.interface';
import type { CardState } from '../../domain/card/entities/CardState.entity';
import type { CardId } from '../../domain/card/value-objects/CardId.vo';
import type { Theme } from '../../domain/theme/entities/Theme.entity';

export interface KernelAPI {
  registerCard<T>(cardDefinition: CardDefinition<T>): void;

  unregisterCard(cardId: CardId): void;

  getRegisteredCards(): CardDefinition<any>[];

  getCardState(cardId: CardId): CardState | undefined;

  requestRefresh(cardId: CardId): Promise<void>;
  requestRefreshAll(): Promise<void>;

  getTheme(): Theme;
  toggleTheme(): void;

  subscribe(listener: () => void): () => void;

  cleanup(): void;
}

