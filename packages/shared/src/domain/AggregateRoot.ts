import { Entity } from './Entity';
import type { DomainEvent } from './events/DomainEvent';
import { DomainEvents } from './events/DomainEvents';
import type { Identifier } from './Identifier';

/**
 * Base class for Aggregate Roots in DDD.
 * Aggregate Roots are special entities that serve as the entry point
 * to an aggregate (a cluster of domain objects treated as a single unit).
 * They are responsible for maintaining invariants and publishing domain events.
 *
 * @template T The shape of the aggregate root's properties
 */
export abstract class AggregateRoot<T> extends Entity<T> {
  private _domainEvents: DomainEvent[] = [];

  get domainEvents(): DomainEvent[] {
    return this._domainEvents;
  }

  /**
   * Adds a domain event to this aggregate's event list.
   * The event will be dispatched when the aggregate is saved.
   */
  protected addDomainEvent(domainEvent: DomainEvent): void {
    this._domainEvents.push(domainEvent);
    DomainEvents.markAggregateForDispatch(this);
  }

  /**
   * Clears all domain events from this aggregate.
   * Called after events have been dispatched.
   */
  public clearEvents(): void {
    this._domainEvents = [];
  }

  constructor(props: T, id?: Identifier<any>) {
    super(props, id);
  }
}
