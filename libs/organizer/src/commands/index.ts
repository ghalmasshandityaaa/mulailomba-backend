import { FavoriteCommand } from './favorite/favorite.command';
import { FavoriteHandler } from './favorite/favorite.handler';
import { SwitchAccountCommand } from './switch-account/switch-account.command';
import { SwitchAccountHandler } from './switch-account/switch-account.handler';

export { SwitchAccountCommand, FavoriteCommand };

export const CommandHandlers = [SwitchAccountHandler, FavoriteHandler];
