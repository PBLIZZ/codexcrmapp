// Custom error class for Sentry testing
class SentryExampleAPIError extends Error {
  constructor(message) {
    super(message);
    this.name = 'SentryExampleAPIError';
  }
}
// A faulty API route to test Sentry's error monitoring
export default function handler(_req, res) {
  // First prepare the response object (won't be sent due to the error)
  res.status(200).json({ name: 'John Doe' });
  // Then throw the error for Sentry to capture
  throw new SentryExampleAPIError(
    'This error is raised on the backend called by the example page.'
  );
}
