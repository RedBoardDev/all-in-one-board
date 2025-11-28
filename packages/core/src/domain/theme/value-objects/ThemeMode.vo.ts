import { ValueObject, Guard, Result } from '@aob/shared';

type ThemeModeValue = 'light' | 'dark';

interface ThemeModeProps {
  value: ThemeModeValue;
}

export class ThemeMode extends ValueObject<ThemeModeProps> {
  private constructor(props: ThemeModeProps) {
    super(props);
  }

  public static create(value: ThemeModeValue): Result<ThemeMode> {
    const validModes: ThemeModeValue[] = ['light', 'dark'];
    const guardResult = Guard.isOneOf(value, validModes, 'themeMode');

    if (guardResult.isFailure) {
      return Result.fail(guardResult.getError());
    }

    return Result.ok(new ThemeMode({ value }));
  }

  public static light(): ThemeMode {
    return new ThemeMode({ value: 'light' });
  }

  public static dark(): ThemeMode {
    return new ThemeMode({ value: 'dark' });
  }

  get value(): ThemeModeValue {
    return this.props.value;
  }

  public isLight(): boolean {
    return this.props.value === 'light';
  }

  public isDark(): boolean {
    return this.props.value === 'dark';
  }

  public toggle(): ThemeMode {
    return this.props.value === 'light' ? ThemeMode.dark() : ThemeMode.light();
  }
}
