import { ValueObject, Guard, Result } from '@aob/shared';

interface LayoutConstraintsProps {
  minW: number;
  minH: number;
  defaultW: number;
  defaultH: number;
  maxW?: number;
  maxH?: number;
}

export class LayoutConstraints extends ValueObject<LayoutConstraintsProps> {
  private constructor(props: LayoutConstraintsProps) {
    super(props);
  }

  public static create(props: LayoutConstraintsProps): Result<LayoutConstraints> {
    const guardResult = Guard.combine([
      Guard.greaterThanOrEqual(props.minW, 1, 'minW'),
      Guard.greaterThanOrEqual(props.minH, 1, 'minH'),
      Guard.greaterThanOrEqual(props.defaultW, props.minW, 'defaultW'),
      Guard.greaterThanOrEqual(props.defaultH, props.minH, 'defaultH'),
    ]);

    if (guardResult.isFailure) {
      return Result.fail(guardResult.getError());
    }

    if (props.maxW !== undefined) {
      const maxWResult = Guard.greaterThanOrEqual(props.maxW, props.defaultW, 'maxW');
      if (maxWResult.isFailure) {
        return Result.fail('maxW must be greater than or equal to defaultW');
      }
    }

    if (props.maxH !== undefined) {
      const maxHResult = Guard.greaterThanOrEqual(props.maxH, props.defaultH, 'maxH');
      if (maxHResult.isFailure) {
        return Result.fail('maxH must be greater than or equal to defaultH');
      }
    }

    return Result.ok(new LayoutConstraints(props));
  }

  get minW(): number {
    return this.props.minW;
  }

  get minH(): number {
    return this.props.minH;
  }

  get defaultW(): number {
    return this.props.defaultW;
  }

  get defaultH(): number {
    return this.props.defaultH;
  }

  get maxW(): number | undefined {
    return this.props.maxW;
  }

  get maxH(): number | undefined {
    return this.props.maxH;
  }

  public static createOrThrow(props: LayoutConstraintsProps): LayoutConstraints {
    const result = this.create(props);
    if (result.isFailure) {
      throw new Error(`LayoutConstraints creation failed: ${result.getError()}`);
    }
    return result.getValue();
  }
}
