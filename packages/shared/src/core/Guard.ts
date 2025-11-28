import { Result } from './Result';

export interface GuardArgument {
  argument: any;
  argumentName: string;
}

export type GuardArgumentCollection = GuardArgument[];

/**
 * Guard class provides validation utilities with clear error messages.
 * Used throughout the domain to validate inputs before creating entities and value objects.
 */
export class Guard {
  /**
   * Checks if a value is null or undefined.
   */
  public static isNullOrUndefined(argument: any, argumentName: string): Result<void> {
    if (argument === null || argument === undefined) {
      return Result.fail(`${argumentName} is null or undefined`);
    }
    return Result.ok();
  }

  /**
   * Checks if multiple values are null or undefined.
   * Returns the first failure encountered, or ok if all are defined.
   */
  public static againstNullOrUndefinedBulk(args: GuardArgumentCollection): Result<void> {
    for (const arg of args) {
      const result = this.isNullOrUndefined(arg.argument, arg.argumentName);
      if (result.isFailure) return result;
    }
    return Result.ok();
  }

  /**
   * Checks if a string is null, undefined, or empty.
   */
  public static isNullOrEmpty(argument: string | null | undefined, argumentName: string): Result<void> {
    if (argument === null || argument === undefined || argument.trim() === '') {
      return Result.fail(`${argumentName} is null, undefined, or empty`);
    }
    return Result.ok();
  }

  /**
   * Checks if a number is within a specific range (inclusive).
   */
  public static inRange(
    num: number,
    min: number,
    max: number,
    argumentName: string
  ): Result<void> {
    if (num < min || num > max) {
      return Result.fail(`${argumentName} must be between ${min} and ${max}, got ${num}`);
    }
    return Result.ok();
  }

  /**
   * Checks if a number is greater than or equal to a minimum value.
   */
  public static greaterThanOrEqual(
    num: number,
    min: number,
    argumentName: string
  ): Result<void> {
    if (num < min) {
      return Result.fail(`${argumentName} must be at least ${min}, got ${num}`);
    }
    return Result.ok();
  }

  /**
   * Checks if a string length is within a specific range.
   */
  public static lengthInRange(
    text: string,
    minLength: number,
    maxLength: number,
    argumentName: string
  ): Result<void> {
    const length = text.length;
    if (length < minLength || length > maxLength) {
      return Result.fail(
        `${argumentName} length must be between ${minLength} and ${maxLength}, got ${length}`
      );
    }
    return Result.ok();
  }

  /**
   * Checks if an array is null, undefined, or empty.
   */
  public static isNullOrEmptyArray(argument: any[] | null | undefined, argumentName: string): Result<void> {
    if (!argument || argument.length === 0) {
      return Result.fail(`${argumentName} is null, undefined, or empty array`);
    }
    return Result.ok();
  }

  /**
   * Checks if a value is one of the allowed values.
   */
  public static isOneOf<T>(
    value: T,
    validValues: T[],
    argumentName: string
  ): Result<void> {
    if (!validValues.includes(value)) {
      return Result.fail(
        `${argumentName} must be one of: ${validValues.join(', ')}, got ${value}`
      );
    }
    return Result.ok();
  }

  /**
   * Validates that a value matches a regex pattern.
   */
  public static matchesPattern(
    value: string,
    pattern: RegExp,
    argumentName: string
  ): Result<void> {
    if (!pattern.test(value)) {
      return Result.fail(`${argumentName} does not match the required pattern`);
    }
    return Result.ok();
  }

  /**
   * Generic type guard with custom predicate.
   */
  public static satisfies<T>(
    value: T,
    predicate: (val: T) => boolean,
    argumentName: string,
    errorMessage?: string
  ): Result<void> {
    if (!predicate(value)) {
      return Result.fail(errorMessage ?? `${argumentName} does not satisfy the required condition`);
    }
    return Result.ok();
  }

  /**
   * Combines multiple validation results.
   * Returns the first failure encountered, or ok if all succeed.
   */
  public static combine(results: Result<void>[]): Result<void> {
    for (const result of results) {
      if (result.isFailure) return result;
    }
    return Result.ok();
  }
}
