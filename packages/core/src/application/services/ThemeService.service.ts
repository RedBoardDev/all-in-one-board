import { Theme } from '../../domain/theme/entities/Theme.entity';
import type { LoggerPort } from '../ports/LoggerPort.interface';

export class ThemeService {
  private currentTheme: Theme;
  private listeners: Set<(theme: Theme) => void> = new Set();

  constructor(
    private logger: LoggerPort,
    initialTheme?: Theme
  ) {
    this.currentTheme = initialTheme ?? Theme.light();
  }

  public getTheme(): Theme {
    return this.currentTheme;
  }

  public setTheme(theme: Theme): void {
    this.currentTheme = theme;
    this.notifyListeners();
    this.logger.debug(`Theme changed to ${theme.mode.value}`);
  }

  public toggleTheme(): void {
    const newTheme = this.currentTheme.toggle();
    this.setTheme(newTheme);
  }

  public subscribe(listener: (theme: Theme) => void): () => void {
    this.listeners.add(listener);

    return () => {
      this.listeners.delete(listener);
    };
  }

  private notifyListeners(): void {
    for (const listener of this.listeners) {
      try {
        listener(this.currentTheme);
      } catch (error) {
        this.logger.error('Theme listener error', error);
      }
    }
  }

  public cleanup(): void {
    this.listeners.clear();
  }
}
