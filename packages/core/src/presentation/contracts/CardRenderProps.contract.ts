import type { CardStatus } from '../../domain/card/value-objects/CardStatus.vo';
import type { Theme } from '../../domain/theme/entities/Theme.entity';
import type { LayoutConstraints } from '../../domain/card/value-objects/LayoutConstraints.vo';

export interface CardMetadata {
  id: string;
  title: string;
  layout: LayoutConstraints;
  size: { w: number; h: number };
}

export interface CardActions {
  requestRefresh: () => Promise<void>;
}

export interface CardRenderProps<TData> {
  status: CardStatus;
  data: TData | null;
  previousData: TData | null;
  error: unknown | null;
  lastUpdatedAt: number | null;
  isLoading: boolean;
  theme: Theme;
  cardMeta: CardMetadata;
  actions: CardActions;
}
