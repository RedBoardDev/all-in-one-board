import { ValueObject, Guard, Result } from '@aob/shared';

interface ThemePaletteProps {
  background: string;
  surface: string;
  surfaceAlt: string;
  text: string;
  textMuted: string;
  accent: string;
  accentSoft: string;
  border: string;
  danger: string;
  success: string;
  warning: string;
}

export class ThemePalette extends ValueObject<ThemePaletteProps> {
  private constructor(props: ThemePaletteProps) {
    super(props);
  }

  public static create(props: ThemePaletteProps): Result<ThemePalette> {
    const guardResult = Guard.againstNullOrUndefinedBulk([
      { argument: props.background, argumentName: 'background' },
      { argument: props.surface, argumentName: 'surface' },
      { argument: props.surfaceAlt, argumentName: 'surfaceAlt' },
      { argument: props.text, argumentName: 'text' },
      { argument: props.textMuted, argumentName: 'textMuted' },
      { argument: props.accent, argumentName: 'accent' },
      { argument: props.accentSoft, argumentName: 'accentSoft' },
      { argument: props.border, argumentName: 'border' },
      { argument: props.danger, argumentName: 'danger' },
      { argument: props.success, argumentName: 'success' },
      { argument: props.warning, argumentName: 'warning' },
    ]);

    if (guardResult.isFailure) {
      return Result.fail(guardResult.getError());
    }

    return Result.ok(new ThemePalette(props));
  }

  public static light(): ThemePalette {
    return new ThemePalette({
      background: '#e0e0d8',
      surface: '#e8e8e0',
      surfaceAlt: '#d5d5cd',
      text: '#1a1a1a',
      textMuted: '#6b7280',
      accent: '#3b82f6',
      accentSoft: '#dbeafe',
      border: '#c8c8c0',
      danger: '#ef4444',
      success: '#10b981',
      warning: '#f59e0b',
    });
  }

  public static dark(): ThemePalette {
    return new ThemePalette({
      background: '#0a0f1a',
      surface: '#1a1a1a',
      surfaceAlt: '#252525',
      text: '#e0e1dd',
      textMuted: '#9ca3af',
      accent: '#3b82f6',
      accentSoft: '#1e3a8a',
      border: '#2a2a2a',
      danger: '#ef4444',
      success: '#10b981',
      warning: '#f59e0b',
    });
  }

  get background(): string {
    return this.props.background;
  }

  get surface(): string {
    return this.props.surface;
  }

  get surfaceAlt(): string {
    return this.props.surfaceAlt;
  }

  get text(): string {
    return this.props.text;
  }

  get textMuted(): string {
    return this.props.textMuted;
  }

  get accent(): string {
    return this.props.accent;
  }

  get accentSoft(): string {
    return this.props.accentSoft;
  }

  get border(): string {
    return this.props.border;
  }

  get danger(): string {
    return this.props.danger;
  }

  get success(): string {
    return this.props.success;
  }

  get warning(): string {
    return this.props.warning;
  }

  public toObject(): ThemePaletteProps {
    return { ...this.props };
  }
}
