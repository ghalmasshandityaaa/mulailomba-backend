import { FavoriteCommand } from './favorite/favorite.command';
import { FavoriteHandler } from './favorite/favorite.handler';
import { SwitchAccountCommand } from './switch-account/switch-account.command';
import { SwitchAccountHandler } from './switch-account/switch-account.handler';
import { UnfavoriteCommand } from './unfavorite/unfavorite.command';
import { UnfavoriteHandler } from './unfavorite/unfavorite.handler';

export { SwitchAccountCommand, FavoriteCommand, UnfavoriteCommand };

export const CommandHandlers = [SwitchAccountHandler, FavoriteHandler, UnfavoriteHandler];
