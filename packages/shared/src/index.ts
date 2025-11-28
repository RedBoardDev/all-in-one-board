// Domain building blocks
export { Identifier } from './domain/Identifier';
export { UniqueEntityID } from './domain/UniqueEntityId';
export { Entity } from './domain/Entity';
export { ValueObject } from './domain/ValueObject';
export { AggregateRoot } from './domain/AggregateRoot';

// Domain events
export type { DomainEvent } from './domain/events/DomainEvent';
export { DomainEvents } from './domain/events/DomainEvents';

// Core utilities
export { Result } from './core/Result';
export { Guard } from './core/Guard';
export type { GuardArgument, GuardArgumentCollection } from './core/Guard';

// Errors
export { DomainError } from './errors/DomainError';

export {
  ApplicationError,
  InfrastructureError,
  DataAccessError,
  ResourceNotFoundError,
  mapDomainErrorToHttpResponse,
} from './errors/AppError';

export {
  ValidationError,
  AuthorizationError,
  ServerError,
  NetworkError,
} from './errors/InfraError';

// Utils
export { shallowEqual } from './utils/shallowEqual';
