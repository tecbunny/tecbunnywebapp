import { router } from '../trpc';
import { pageContentRouter } from './pageContent';
import { featureFlagsRouter } from './featureFlags';
import { contactMessagesRouter } from './contactMessages';
import { projectsRouter } from './projects';

import { couponsRouter } from './coupons';
import { offersRouter } from './offers';

export const appRouter = router({
  pageContent: pageContentRouter,
  featureFlags: featureFlagsRouter,
  contactMessages: contactMessagesRouter,
  projects: projectsRouter,
  coupons: couponsRouter,
  offers: offersRouter,
});

export type AppRouter = typeof appRouter;
