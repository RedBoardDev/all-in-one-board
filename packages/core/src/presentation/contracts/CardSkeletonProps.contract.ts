import type { Theme } from '../../domain/theme/entities/Theme.entity';
import type { CardMetadata } from './CardRenderProps.contract';

export interface CardSkeletonProps {
  theme: Theme;
  cardMeta: CardMetadata;
}
