// Custom error class for Sentry testing
class SentryExampleAPIError extends Error {
  constructor(message) {
    super(message);
    this.name = 'SentryExampleAPIError';
  }
}

// A faulty API route to test Sentry's error monitoring
// For App Router, the handler function signature is different.
// We'll use the GET convention for this example.
export async function GET(request) {
  // First prepare the response object (won't be sent due to the error)
  // res.status(200).json({ name: 'John Doe' }); // This syntax is for Pages Router
  
  // Then throw the error for Sentry to capture
  throw new SentryExampleAPIError(
    'This error is raised on the backend called by the example page.'
  );
  
  // If we were to return a successful response in App Router:
  // return new Response(JSON.stringify({ name: 'John Doe' }), {
  //   status: 200,
  //   headers: {
  //     'Content-Type': 'application/json',
  //   },
  // });
}
