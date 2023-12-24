import { seedUser1692209374533 } from './1692209374533-seed-user';
import { seedOrganizer1692209374534 } from './1692209374534-seed-organizer';
import { seedBanner1692271354051 } from './1692271354051-seed-banner';
import { seedCategory1692271354052 } from './1692271354052-seed-category';
import { seedEvent1692277347451 } from './1692277347451-seed-event';

let seeds: any[] = [];
if (process.env.APP_MODE?.toLowerCase() === 'production') {
  seeds = [seedUser1692209374533, seedCategory1692271354052];
} else {
  // for development or staging env
  seeds = [
    seedUser1692209374533,
    seedOrganizer1692209374534,
    seedBanner1692271354051,
    seedCategory1692271354052,
    seedEvent1692277347451,
  ];
}

export const Seeds = seeds;
