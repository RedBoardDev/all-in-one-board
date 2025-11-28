import { Entity, Result, Guard } from '@aob/shared';
import { CardId } from '../value-objects/CardId.vo';
import { LayoutConstraints } from '../value-objects/LayoutConstraints.vo';
import { CardBehavior } from '../value-objects/CardBehavior.vo';
import type { CardDataFetcher } from '../interfaces/CardDataFetcher.interface';

interface CardModelProps<TData> {
  id: CardId;
  title: string;
  layout: LayoutConstraints;
  data: CardDataFetcher<TData>;
  behavior: CardBehavior;
}

export class CardModel<TData> extends Entity<CardModelProps<TData>> {
  private constructor(props: CardModelProps<TData>) {
    super(props, props.id);
  }

  public static create<T>(props: Omit<CardModelProps<T>, 'behavior'> & { behavior?: CardBehavior }): Result<CardModel<T>> {
    const guardResult = Guard.combine([
      Guard.isNullOrUndefined(props.id, 'id'),
      Guard.isNullOrEmpty(props.title, 'title'),
      Guard.isNullOrUndefined(props.layout, 'layout'),
      Guard.isNullOrUndefined(props.data, 'data'),
    ]);

    if (guardResult.isFailure) {
      return Result.fail(guardResult.getError());
    }

    return Result.ok(new CardModel<T>({
      ...props,
      behavior: props.behavior ?? CardBehavior.default(),
    }));
  }

  get cardId(): CardId {
    return this.props.id;
  }

  get title(): string {
    return this.props.title;
  }

  get layout(): LayoutConstraints {
    return this.props.layout;
  }

  get data(): CardDataFetcher<TData> {
    return this.props.data;
  }

  get behavior(): CardBehavior {
    return this.props.behavior;
  }
}
