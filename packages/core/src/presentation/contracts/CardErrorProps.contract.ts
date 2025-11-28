import type { Theme } from '../../domain/theme/entities/Theme.entity';
import type { CardMetadata, CardActions } from './CardRenderProps.contract';

export interface CardErrorProps {
  theme: Theme;
  cardMeta: CardMetadata;
  error: unknown;
  actions: CardActions;
}
