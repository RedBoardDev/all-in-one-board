import type { AggregateRoot } from '../AggregateRoot';
import type { DomainEvent } from './DomainEvent';
import type { UniqueEntityID } from '../UniqueEntityId';

/**
 * Global domain event dispatcher.
 * Handles registration of event handlers and dispatching of events.
 */
export class DomainEvents {
  private static handlersMap: Record<string, Array<(event: DomainEvent) => void>> = {};
  private static markedAggregates: AggregateRoot<any>[] = [];

  /**
   * Marks an aggregate for dispatching its domain events.
   */
  public static markAggregateForDispatch(aggregate: AggregateRoot<any>): void {
    const aggregateFound = !!this.findMarkedAggregateByID(aggregate.id);

    if (!aggregateFound) {
      this.markedAggregates.push(aggregate);
    }
  }

  /**
   * Dispatches all events for the marked aggregates.
   */
  private static dispatchAggregateEvents(aggregate: AggregateRoot<any>): void {
    aggregate.domainEvents.forEach((event: DomainEvent) => this.dispatch(event));
  }

  /**
   * Removes an aggregate from the marked list after dispatching its events.
   */
  private static removeAggregateFromMarkedDispatchList(aggregate: AggregateRoot<any>): void {
    const index = this.markedAggregates.findIndex((a) => a.equals(aggregate));
    if (index !== -1) {
      this.markedAggregates.splice(index, 1);
    }
  }

  /**
   * Finds a marked aggregate by its ID.
   */
  private static findMarkedAggregateByID(id: UniqueEntityID): AggregateRoot<any> | undefined {
    return this.markedAggregates.find((aggregate) => aggregate.id.equals(id));
  }

  /**
   * Dispatches all events for a specific aggregate.
   */
  public static dispatchEventsForAggregate(id: UniqueEntityID): void {
    const aggregate = this.findMarkedAggregateByID(id);

    if (aggregate) {
      this.dispatchAggregateEvents(aggregate);
      aggregate.clearEvents();
      this.removeAggregateFromMarkedDispatchList(aggregate);
    }
  }

  /**
   * Registers a handler for a specific event type.
   */
  public static register(
    callback: (event: DomainEvent) => void,
    eventClassName: string
  ): void {
    if (!this.handlersMap[eventClassName]) {
      this.handlersMap[eventClassName] = [];
    }
    this.handlersMap[eventClassName].push(callback);
  }

  /**
   * Clears all handlers for a specific event type.
   */
  public static clearHandlers(eventClassName: string): void {
    if (this.handlersMap[eventClassName]) {
      delete this.handlersMap[eventClassName];
    }
  }

  /**
   * Clears all event handlers and marked aggregates.
   */
  public static clearMarkedAggregates(): void {
    this.markedAggregates = [];
  }

  /**
   * Dispatches an event to all registered handlers.
   */
  private static dispatch(event: DomainEvent): void {
    const eventClassName: string = event.constructor.name;

    if (this.handlersMap[eventClassName]) {
      const handlers = this.handlersMap[eventClassName];
      for (const handler of handlers) {
        handler(event);
      }
    }
  }
}
