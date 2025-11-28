import { Entity, Result, Timestamp } from '@aob/shared';
import { CardId } from '../value-objects/CardId.vo';
import { CardStatus } from '../value-objects/CardStatus.vo';

interface CardStateProps {
  cardId: CardId;
  status: CardStatus;
  data: unknown | null;
  previousData: unknown | null;
  error: unknown | null;
  lastUpdatedAt: Timestamp | null;
}

export class CardState extends Entity<CardStateProps> {
  private constructor(props: CardStateProps) {
    super(props, props.cardId);
  }

  public static create(cardId: CardId): Result<CardState> {
    return Result.ok(new CardState({
      cardId,
      status: CardStatus.idle(),
      data: null,
      previousData: null,
      error: null,
      lastUpdatedAt: null,
    }));
  }

  get cardId(): CardId {
    return this.props.cardId;
  }

  get status(): CardStatus {
    return this.props.status;
  }

  get data(): unknown | null {
    return this.props.data;
  }

  get previousData(): unknown | null {
    return this.props.previousData;
  }

  get error(): unknown | null {
    return this.props.error;
  }

  get lastUpdatedAt(): Timestamp | null {
    return this.props.lastUpdatedAt;
  }

  public startLoading(): CardState {
    this.props.status = CardStatus.loading();
    return this;
  }

  public setData(data: unknown): CardState {
    this.props.previousData = this.props.data;
    this.props.data = data;
    this.props.error = null;
    this.props.status = CardStatus.ready();
    this.props.lastUpdatedAt = Timestamp.now();
    return this;
  }

  public setError(error: unknown): CardState {
    this.props.error = error;
    this.props.status = CardStatus.error();
    this.props.lastUpdatedAt = Timestamp.now();
    return this;
  }

  public reset(): CardState {
    this.props.status = CardStatus.idle();
    this.props.data = null;
    this.props.previousData = null;
    this.props.error = null;
    this.props.lastUpdatedAt = null;
    return this;
  }
}
