/**
 * @SERVER-COMPONENT
 * Sentry Edge Configuration
 */

import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: 'https://4a2402c4c9acb094e4d89e06dbb315f3@o4509315461218304.ingest.de.sentry.io/4509316087283792',

  // Adds request headers and IP for users, for more info visit:
  // https://docs.sentry.io/platforms/javascript/guides/nextjs/configuration/options/#sendDefaultPii
  sendDefaultPii: true,

  // ...

  // Note: if you want to override the automatic release value, do not set a
  // `release` value here - use the environment variable `SENTRY_RELEASE`, so
  // that it will also get attached to your source maps
});