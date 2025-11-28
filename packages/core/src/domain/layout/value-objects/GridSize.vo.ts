import { ValueObject, Guard, Result } from '@aob/shared';

interface GridSizeProps {
  columns: number;
  rowHeight: number;
  gap: number;
}

export class GridSize extends ValueObject<GridSizeProps> {
  private constructor(props: GridSizeProps) {
    super(props);
  }

  public static create(props: GridSizeProps): Result<GridSize> {
    const guardResult = Guard.combine([
      Guard.greaterThanOrEqual(props.columns, 1, 'columns'),
      Guard.greaterThanOrEqual(props.rowHeight, 10, 'rowHeight'),
      Guard.greaterThanOrEqual(props.gap, 0, 'gap'),
    ]);

    if (guardResult.isFailure) {
      return Result.fail(guardResult.getError());
    }

    return Result.ok(new GridSize(props));
  }

  public static desktop(): GridSize {
    return new GridSize({
      columns: 12,
      rowHeight: 100,
      gap: 16,
    });
  }

  public static tablet(): GridSize {
    return new GridSize({
      columns: 8,
      rowHeight: 80,
      gap: 12,
    });
  }

  public static mobile(): GridSize {
    return new GridSize({
      columns: 4,
      rowHeight: 60,
      gap: 8,
    });
  }

  get columns(): number {
    return this.props.columns;
  }

  get rowHeight(): number {
    return this.props.rowHeight;
  }

  get gap(): number {
    return this.props.gap;
  }
}
