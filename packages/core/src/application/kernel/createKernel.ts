import { KernelImpl } from './KernelImpl';
import type { KernelAPI } from './KernelAPI.interface';
import { BoardService } from '../services/BoardService.service';
import { CardRefreshService } from '../services/CardRefreshService.service';
import { ThemeService } from '../services/ThemeService.service';
import type { CardDataPort } from '../ports/CardDataPort.interface';
import type { TimePort } from '../ports/TimePort.interface';
import type { LoggerPort } from '../ports/LoggerPort.interface';
import type { StoragePort } from '../ports/StoragePort.interface';
import type { Theme } from '../../domain/theme/entities/Theme.entity';

export interface KernelDependencies {
  timePort: TimePort;
  loggerPort: LoggerPort;
  dataPort: CardDataPort;
  storagePort?: StoragePort;
  initialTheme?: Theme;
}

export function createKernel(deps: KernelDependencies): KernelAPI {
  const boardService = new BoardService();

  const cardRefreshService = new CardRefreshService(
    boardService,
    deps.dataPort,
    deps.timePort,
    deps.loggerPort
  );

  const themeService = new ThemeService(
    deps.loggerPort,
    deps.initialTheme,
    deps.storagePort
  );

  return new KernelImpl(boardService, cardRefreshService, themeService);
}
