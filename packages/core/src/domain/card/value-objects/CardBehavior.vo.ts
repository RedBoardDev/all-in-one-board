import { ValueObject, Result } from '@aob/shared';

interface CardBehaviorProps {
  useDefaultSkeleton?: boolean;
  useDefaultError?: boolean;
}

export class CardBehavior extends ValueObject<CardBehaviorProps> {
  private constructor(props: CardBehaviorProps) {
    super(props);
  }

  public static create(props: CardBehaviorProps = {}): Result<CardBehavior> {
    return Result.ok(new CardBehavior(props));
  }

  public static default(): CardBehavior {
    return new CardBehavior({
      useDefaultSkeleton: true,
      useDefaultError: true,
    });
  }

  public static custom(): CardBehavior {
    return new CardBehavior({
      useDefaultSkeleton: false,
      useDefaultError: false,
    });
  }

  get useDefaultSkeleton(): boolean {
    return this.props.useDefaultSkeleton ?? true;
  }

  get useDefaultError(): boolean {
    return this.props.useDefaultError ?? true;
  }
}
