import type { Identifier } from './Identifier';
import { UniqueEntityID } from './UniqueEntityId';

const isEntity = (v: any): v is Entity<any> => {
  return v instanceof Entity;
};

/**
 * Base class for Entities in DDD.
 * Entities are objects with a unique identity that persists over time.
 * Their equality is determined by their ID rather than their properties.
 *
 * @template T The shape of the entity's properties
 */
export abstract class Entity<T> {
  protected readonly _id: Identifier<any>;
  protected props: T;

  constructor(props: T, id?: Identifier<any>) {
    this._id = id ?? new UniqueEntityID();
    this.props = props;
  }

  /**
   * Returns the unique identifier of this entity.
   */
  get id(): Identifier<any> {
    return this._id;
  }

  /**
   * Compares this entity with another for equality.
   * Two entities are equal if they have the same identity (ID).
   */
  public equals(object?: Entity<T>): boolean {
    if (object == null || object === undefined) return false;

    if (this === object) return true;

    if (!isEntity(object)) return false;

    return this._id.equals(object._id);
  }
}
