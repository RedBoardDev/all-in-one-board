import { ValueObject } from '../ValueObject';

interface TimestampProps {
  value: number;
}

export class Timestamp extends ValueObject<TimestampProps> {
  private constructor(props: TimestampProps) {
    super(props);
  }

  public static fromMillis(millis: number): Timestamp {
    return new Timestamp({ value: millis });
  }

  public static now(): Timestamp {
    return new Timestamp({ value: Date.now() });
  }

  public static fromDate(date: Date): Timestamp {
    return new Timestamp({ value: date.getTime() });
  }

  public toMillis(): number {
    return this.props.value;
  }

  public toDate(): Date {
    return new Date(this.props.value);
  }

  public isBefore(other: Timestamp): boolean {
    return this.props.value < other.props.value;
  }

  public isAfter(other: Timestamp): boolean {
    return this.props.value > other.props.value;
  }

  public toString(): string {
    return this.toDate().toISOString();
  }
}
