import { GridPosition } from '../value-objects/GridPosition.vo';
import { GridSize } from '../value-objects/GridSize.vo';
import { LayoutConstraints } from '../../card/value-objects/LayoutConstraints.vo';
import { Result } from '@aob/shared';

interface LayoutItem {
  id: string;
  constraints: LayoutConstraints;
}

interface PositionedItem {
  id: string;
  position: GridPosition;
}

export class BentoLayoutService {
  public static computeLayout(
    items: LayoutItem[],
    gridSize: GridSize
  ): Result<PositionedItem[]> {
    const positions: PositionedItem[] = [];
    const grid: boolean[][] = Array(1000)
      .fill(null)
      .map(() => Array(gridSize.columns).fill(false));

    for (const item of items) {
      const position = this.findNextAvailablePosition(
        grid,
        item.constraints,
        gridSize.columns
      );

      if (position.isFailure) {
        return Result.fail(`Cannot place item ${item.id}: ${position.getError()}`);
      }

      const pos = position.getValue();
      this.markGridCells(grid, pos, true);

      positions.push({
        id: item.id,
        position: pos,
      });
    }

    return Result.ok(positions);
  }

  private static findNextAvailablePosition(
    grid: boolean[][],
    constraints: LayoutConstraints,
    maxColumns: number
  ): Result<GridPosition> {
    const width = Math.min(constraints.defaultW, maxColumns);
    const height = constraints.defaultH;

    for (let y = 0; y < grid.length; y++) {
      for (let x = 0; x <= maxColumns - width; x++) {
        if (this.canPlaceAt(grid, x, y, width, height)) {
          const posResult = GridPosition.create({ x, y, w: width, h: height });
          if (posResult.isSuccess) {
            return posResult;
          }
        }
      }
    }

    return Result.fail('No available position found in grid');
  }

  private static canPlaceAt(
    grid: boolean[][],
    x: number,
    y: number,
    w: number,
    h: number
  ): boolean {
    for (let row = y; row < y + h; row++) {
      if (row >= grid.length) return false;
      for (let col = x; col < x + w; col++) {
        if (col >= grid[row].length || grid[row][col]) {
          return false;
        }
      }
    }
    return true;
  }

  private static markGridCells(
    grid: boolean[][],
    position: GridPosition,
    value: boolean
  ): void {
    for (let row = position.y; row < position.y + position.h; row++) {
      for (let col = position.x; col < position.x + position.w; col++) {
        if (row < grid.length && col < grid[row].length) {
          grid[row][col] = value;
        }
      }
    }
  }

  public static compactLayout(positions: PositionedItem[]): PositionedItem[] {
    const sorted = [...positions].sort((a, b) => {
      if (a.position.y !== b.position.y) {
        return a.position.y - b.position.y;
      }
      return a.position.x - b.position.x;
    });

    const compacted: PositionedItem[] = [];
    const occupied = new Map<string, boolean>();

    for (const item of sorted) {
      let newY = 0;
      let placed = false;

      while (!placed) {
        const canPlace = this.canPlaceAtCompact(
          occupied,
          item.position.x,
          newY,
          item.position.w,
          item.position.h
        );

        if (canPlace) {
          const posResult = GridPosition.create({
            x: item.position.x,
            y: newY,
            w: item.position.w,
            h: item.position.h,
          });

          if (posResult.isSuccess) {
            const newPosition = posResult.getValue();
            this.markOccupied(occupied, newPosition);
            compacted.push({ id: item.id, position: newPosition });
            placed = true;
          } else {
            break;
          }
        } else {
          newY++;
        }

        if (newY > 1000) break;
      }
    }

    return compacted;
  }

  private static canPlaceAtCompact(
    occupied: Map<string, boolean>,
    x: number,
    y: number,
    w: number,
    h: number
  ): boolean {
    for (let row = y; row < y + h; row++) {
      for (let col = x; col < x + w; col++) {
        if (occupied.get(`${row},${col}`)) {
          return false;
        }
      }
    }
    return true;
  }

  private static markOccupied(occupied: Map<string, boolean>, position: GridPosition): void {
    for (let row = position.y; row < position.y + position.h; row++) {
      for (let col = position.x; col < position.x + position.w; col++) {
        occupied.set(`${row},${col}`, true);
      }
    }
  }
}
