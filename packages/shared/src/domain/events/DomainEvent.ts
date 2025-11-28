import type { UniqueEntityID } from '../UniqueEntityId';

/**
 * Base interface for all domain events.
 * Domain events represent something that happened in the domain.
 */
export interface DomainEvent {
  /**
   * The timestamp when this event occurred.
   */
  occurredAt: Date;

  /**
   * Gets the aggregate ID that this event belongs to.
   */
  getAggregateId(): UniqueEntityID;
}
