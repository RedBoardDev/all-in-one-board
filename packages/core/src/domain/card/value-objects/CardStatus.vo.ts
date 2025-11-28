import { ValueObject, Guard, Result } from '@aob/shared';

type CardStatusValue = 'idle' | 'loading' | 'ready' | 'error';

interface CardStatusProps {
  value: CardStatusValue;
}

export class CardStatus extends ValueObject<CardStatusProps> {
  private constructor(props: CardStatusProps) {
    super(props);
  }

  public static create(value: CardStatusValue): Result<CardStatus> {
    const validStatuses: CardStatusValue[] = ['idle', 'loading', 'ready', 'error'];
    const guardResult = Guard.isOneOf(value, validStatuses, 'cardStatus');

    if (guardResult.isFailure) {
      return Result.fail(guardResult.getError());
    }

    return Result.ok(new CardStatus({ value }));
  }

  public static idle(): CardStatus {
    return new CardStatus({ value: 'idle' });
  }

  public static loading(): CardStatus {
    return new CardStatus({ value: 'loading' });
  }

  public static ready(): CardStatus {
    return new CardStatus({ value: 'ready' });
  }

  public static error(): CardStatus {
    return new CardStatus({ value: 'error' });
  }

  get value(): CardStatusValue {
    return this.props.value;
  }

  public isIdle(): boolean {
    return this.props.value === 'idle';
  }

  public isLoading(): boolean {
    return this.props.value === 'loading';
  }

  public isReady(): boolean {
    return this.props.value === 'ready';
  }

  public isError(): boolean {
    return this.props.value === 'error';
  }
}
