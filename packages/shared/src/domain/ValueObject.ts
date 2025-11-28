import { shallowEqual } from '../utils/shallowEqual';

interface ValueObjectProps {
  [index: string]: any;
}

/**
 * Base class for Value Objects in DDD.
 * Value Objects are immutable objects whose equality is determined
 * by their structural properties rather than identity.
 *
 * @template T The shape of the value object's properties
 */
export abstract class ValueObject<T extends ValueObjectProps> {
  public readonly props: T;

  constructor(props: T) {
    // Freeze props to ensure immutability
    this.props = Object.freeze(props);
  }

  /**
   * Compares this value object with another for equality.
   * Two value objects are equal if all their properties are equal.
   */
  public equals(vo?: ValueObject<T>): boolean {
    if (vo === null || vo === undefined) return false;

    if (vo.props === undefined) return false;

    return shallowEqual(this.props, vo.props);
  }
}
