import { ValueObject, Guard, Result } from '@aob/shared';

interface RefreshPolicyProps {
  intervalMs?: number;
  enableGlobalRefresh?: boolean;
  skipInitialFetch?: boolean;
}

export class RefreshPolicy extends ValueObject<RefreshPolicyProps> {
  private constructor(props: RefreshPolicyProps) {
    super(props);
  }

  public static create(props: RefreshPolicyProps = {}): Result<RefreshPolicy> {
    if (props.intervalMs !== undefined) {
      const intervalResult = Guard.greaterThanOrEqual(
        props.intervalMs,
        1000,
        'intervalMs'
      );
      if (intervalResult.isFailure) {
        return Result.fail('intervalMs must be at least 1000ms (1 second)');
      }
    }

    return Result.ok(new RefreshPolicy(props));
  }

  public static default(): RefreshPolicy {
    return new RefreshPolicy({
      enableGlobalRefresh: true,
      skipInitialFetch: false,
    });
  }

  public static withInterval(intervalMs: number): Result<RefreshPolicy> {
    return RefreshPolicy.create({
      intervalMs,
      enableGlobalRefresh: true,
      skipInitialFetch: false,
    });
  }

  get intervalMs(): number | undefined {
    return this.props.intervalMs;
  }

  get enableGlobalRefresh(): boolean {
    return this.props.enableGlobalRefresh ?? true;
  }

  get skipInitialFetch(): boolean {
    return this.props.skipInitialFetch ?? false;
  }

  public hasAutoRefresh(): boolean {
    return this.intervalMs !== undefined;
  }
}
