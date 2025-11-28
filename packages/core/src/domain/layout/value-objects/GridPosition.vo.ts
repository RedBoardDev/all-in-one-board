import { ValueObject, Guard, Result } from '@aob/shared';

interface GridPositionProps {
  x: number;
  y: number;
  w: number;
  h: number;
}

export class GridPosition extends ValueObject<GridPositionProps> {
  private constructor(props: GridPositionProps) {
    super(props);
  }

  public static create(props: GridPositionProps): Result<GridPosition> {
    const guardResult = Guard.combine([
      Guard.greaterThanOrEqual(props.x, 0, 'x'),
      Guard.greaterThanOrEqual(props.y, 0, 'y'),
      Guard.greaterThanOrEqual(props.w, 1, 'w'),
      Guard.greaterThanOrEqual(props.h, 1, 'h'),
    ]);

    if (guardResult.isFailure) {
      return Result.fail(guardResult.getError());
    }

    return Result.ok(new GridPosition(props));
  }

  get x(): number {
    return this.props.x;
  }

  get y(): number {
    return this.props.y;
  }

  get w(): number {
    return this.props.w;
  }

  get h(): number {
    return this.props.h;
  }

  public overlaps(other: GridPosition): boolean {
    return !(
      this.x + this.w <= other.x ||
      other.x + other.w <= this.x ||
      this.y + this.h <= other.y ||
      other.y + other.h <= this.y
    );
  }

  public area(): number {
    return this.w * this.h;
  }
}
