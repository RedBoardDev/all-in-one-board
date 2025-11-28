/**
 * Represents the result of an operation that can either succeed with a value
 * or fail with an error. This implements the Railway Oriented Programming pattern.
 *
 * @template T The type of the success value
 */
export abstract class Result<T> {
  public isSuccess: boolean;
  public isFailure: boolean;
  protected _value?: T;
  protected _error?: string;
  protected _errorCode?: string;

  protected constructor(isSuccess: boolean, error?: string, value?: T, errorCode?: string) {
    if (isSuccess && error) {
      throw new Error('InvalidOperation: A result cannot be successful and contain an error');
    }
    if (!isSuccess && !error) {
      throw new Error('InvalidOperation: A failing result needs to contain an error message');
    }

    this.isSuccess = isSuccess;
    this.isFailure = !isSuccess;
    this._error = error;
    this._value = value;
    this._errorCode = errorCode;
  }

  /**
   * Gets the value if the result is successful.
   * @throws Error if the result is a failure
   */
  public getValue(): T {
    if (!this.isSuccess) {
      throw new Error(`Can't get the value of an error result. Use 'getError' instead.`);
    }
    return this._value as T;
  }

  /**
   * Gets the error message if the result is a failure.
   */
  public getError(): string {
    return this._error as string;
  }

  /**
   * Gets the error code if the result is a failure and has one.
   */
  public getErrorCode(): string | undefined {
    return this._errorCode;
  }

  /**
   * Creates a successful result with an optional value.
   */
  public static ok<U>(value?: U): Result<U> {
    return new Ok<U>(value);
  }

  /**
   * Creates a failed result with an error message and optional error code.
   */
  public static fail<U>(errorMessage: string, errorCode?: string, error?: unknown): Result<U> {
    if (error !== undefined) {
      console.error(error);
    }
    return new Fail<U>(errorMessage, errorCode);
  }

  /**
   * Combines multiple results into a single result.
   * Returns the first failure encountered, or ok if all succeed.
   */
  public static combine(results: Result<unknown>[]): Result<unknown> {
    for (const result of results) {
      if (result.isFailure) return result;
    }
    return Result.ok();
  }

  /**
   * Unwraps a result promise, throwing if it's a failure.
   * Useful for contexts where exceptions are acceptable.
   */
  public static async unwrap<U>(resultPromise: Promise<Result<U>>): Promise<U> {
    const result = await resultPromise;

    if (result.isFailure) {
      throw new Error(result.getError());
    }

    return result.getValue();
  }

  /**
   * Maps a successful result's value to a new value.
   * If the result is a failure, returns the failure unchanged.
   */
  public map<U>(fn: (value: T) => U): Result<U> {
    if (this.isFailure) {
      return Result.fail(this.getError(), this.getErrorCode());
    }
    try {
      return Result.ok(fn(this.getValue()));
    } catch (error) {
      return Result.fail(
        error instanceof Error ? error.message : 'Unknown error in map',
        undefined,
        error
      );
    }
  }

  /**
   * Chains operations that return Results (flatMap/bind).
   * If this result is a failure, returns the failure unchanged.
   */
  public andThen<U>(fn: (value: T) => Result<U>): Result<U> {
    if (this.isFailure) {
      return Result.fail(this.getError(), this.getErrorCode());
    }
    try {
      return fn(this.getValue());
    } catch (error) {
      return Result.fail(
        error instanceof Error ? error.message : 'Unknown error in andThen',
        undefined,
        error
      );
    }
  }

  /**
   * Provides a default value if the result is a failure.
   */
  public getValueOr(defaultValue: T): T {
    return this.isSuccess ? this.getValue() : defaultValue;
  }
}

class Ok<T> extends Result<T> {
  constructor(value?: T) {
    super(true, undefined, value);
  }
}

class Fail<T> extends Result<T> {
  constructor(error: string, errorCode?: string) {
    super(false, error, undefined, errorCode);
  }
}
