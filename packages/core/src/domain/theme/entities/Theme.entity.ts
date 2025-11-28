import { Entity, Result, Guard } from '@aob/shared';
import { ThemeMode } from '../value-objects/ThemeMode.vo';
import { ThemePalette } from '../value-objects/ThemePalette.vo';

interface ThemeProps {
  mode: ThemeMode;
  palette: ThemePalette;
}

export class Theme extends Entity<ThemeProps> {
  private constructor(props: ThemeProps) {
    super(props);
  }

  public static create(props: ThemeProps): Result<Theme> {
    const guardResult = Guard.combine([
      Guard.isNullOrUndefined(props.mode, 'mode'),
      Guard.isNullOrUndefined(props.palette, 'palette'),
    ]);

    if (guardResult.isFailure) {
      return Result.fail(guardResult.getError());
    }

    return Result.ok(new Theme(props));
  }

  public static light(): Theme {
    return new Theme({
      mode: ThemeMode.light(),
      palette: ThemePalette.light(),
    });
  }

  public static dark(): Theme {
    return new Theme({
      mode: ThemeMode.dark(),
      palette: ThemePalette.dark(),
    });
  }

  get mode(): ThemeMode {
    return this.props.mode;
  }

  get palette(): ThemePalette {
    return this.props.palette;
  }

  public toggle(): Theme {
    const newMode = this.props.mode.toggle();
    const newPalette = newMode.isLight() ? ThemePalette.light() : ThemePalette.dark();

    return new Theme({
      mode: newMode,
      palette: newPalette,
    });
  }

  public withPalette(palette: ThemePalette): Theme {
    return new Theme({
      mode: this.props.mode,
      palette,
    });
  }
}
