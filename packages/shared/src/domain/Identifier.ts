/**
 * Base class for all identifiers in the domain.
 * Provides value equality semantics and type safety.
 *
 * @template T The type of the underlying identifier value
 */
export class Identifier<T> {
  constructor(private value: T) {
    this.value = value;
  }

  /**
   * Compares this identifier with another for equality.
   * Two identifiers are equal if they have the same value and are instances of the same class.
   */
  equals(id?: Identifier<T>): boolean {
    if (id === null || id === undefined) return false;

    if (!(id instanceof this.constructor)) return false;

    return id.toValue() === this.value;
  }

  /**
   * Returns the string representation of the identifier.
   */
  toString(): string {
    return String(this.value);
  }

  /**
   * Returns the underlying value of the identifier.
   */
  toValue(): T {
    return this.value;
  }
}
