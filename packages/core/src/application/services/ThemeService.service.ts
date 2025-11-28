import { Theme } from '../../domain/theme/entities/Theme.entity';
import type { LoggerPort } from '../ports/LoggerPort.interface';
import type { StoragePort } from '../ports/StoragePort.interface';

const THEME_STORAGE_KEY = 'aob-theme';

export class ThemeService {
  private currentTheme: Theme;
  private listeners: Set<(theme: Theme) => void> = new Set();

  constructor(
    private logger: LoggerPort,
    initialTheme?: Theme,
    private storage?: StoragePort
  ) {
    this.currentTheme = initialTheme ?? Theme.light();
  }

  public getTheme(): Theme {
    return this.currentTheme;
  }

  public async setTheme(theme: Theme): Promise<void> {
    this.currentTheme = theme;
    this.notifyListeners();
    this.logger.debug(`Theme changed to ${theme.mode.value}`);

    if (this.storage) {
      const result = await this.storage.setItem(THEME_STORAGE_KEY, theme.mode.value);
      if (result.isFailure) {
        this.logger.warn(`Failed to save theme to storage: ${result.getError()}`);
      }
    }
  }

  public async toggleTheme(): Promise<void> {
    const newTheme = this.currentTheme.toggle();
    await this.setTheme(newTheme);
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
