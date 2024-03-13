import { handleErrorWithSentry, replayIntegration } from "@sentry/sveltekit";
import * as Sentry from '@sentry/sveltekit';

Sentry.init({
  // The DSN tells the SDK where to send the events. If this value is not provided, 
  // the SDK will try to read it from the SENTRY_DSN environment variable. If that 
  // variable also does not exist, the SDK will just not send any events.
  dsn: 'https://05cd888fd3ddfee27ed510604d783d35@o4506440717893632.ingest.us.sentry.io/4506904725815296',
  
  // Controls the percentage of errors sent to Sentry (1.0 = all, 0.1 = 10%)
  tracesSampleRate: 1.0,
  
  // Only urls which match an entry in this list will be sent to Sentry
  allowUrls: ["rockabillyroasting.shop"],

  // This sets the sample rate to be 10%. You may want this to be 100% while
  // in development and sample at a lower rate in production
  replaysSessionSampleRate: 0.1,

  // If the entire session is not sampled, use the below sample rate to sample
  // sessions when an error occurs.
  replaysOnErrorSampleRate: 1.0,
  
  // If you don't want to use Session Replay, just remove the line below:
  integrations: [replayIntegration()],

});

// If you have a custom error handler, pass it to `handleErrorWithSentry`
export const handleError = handleErrorWithSentry();
