import { AggregateRoot, Result, UniqueEntityID } from '@aob/shared';
import { CardModel } from '../../card/entities/CardModel.entity';
import { CardId } from '../../card/value-objects/CardId.vo';

interface BoardProps {
  name: string;
  cards: Map<string, CardModel<any>>;
}

export class Board extends AggregateRoot<BoardProps> {
  private constructor(props: BoardProps, id?: UniqueEntityID) {
    super(props, id);
  }

  public static create(name: string, id?: UniqueEntityID): Result<Board> {
    return Result.ok(
      new Board(
        {
          name,
          cards: new Map(),
        },
        id
      )
    );
  }

  get name(): string {
    return this.props.name;
  }

  get cards(): CardModel<any>[] {
    return Array.from(this.props.cards.values());
  }

  public registerCard<T>(card: CardModel<T>): Result<void> {
    const cardIdValue = card.cardId.toValue();

    if (this.props.cards.has(cardIdValue)) {
      return Result.fail(`Card with id ${cardIdValue} already registered`);
    }

    this.props.cards.set(cardIdValue, card);
    return Result.ok();
  }

  public unregisterCard(cardId: CardId): Result<void> {
    const cardIdValue = cardId.toValue();

    if (!this.props.cards.has(cardIdValue)) {
      return Result.fail(`Card with id ${cardIdValue} not found`);
    }

    this.props.cards.delete(cardIdValue);
    return Result.ok();
  }

  public getCard(cardId: CardId): CardModel<any> | undefined {
    return this.props.cards.get(cardId.toValue());
  }

  public hasCard(cardId: CardId): boolean {
    return this.props.cards.has(cardId.toValue());
  }

  public getCardCount(): number {
    return this.props.cards.size;
  }
}
