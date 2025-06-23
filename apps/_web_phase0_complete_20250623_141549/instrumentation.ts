export async function register() {
  if (process.env['NEXT_RUNTIME'] === 'nodejs') {
    await import('./sentry.server.config');
  }

  if (process.env['NEXT_RUNTIME'] === 'edge') {
    await import('./sentry.edge.config');
  }
}

export async function onRequestError(
  err: unknown,
  request: {
    path: string;
    method: string;
    headers: Record<string, string | string[] | undefined>;
  }
) {
  await import('./sentry.server.config');
  const { captureRequestError } = await import('@sentry/nextjs');
  captureRequestError(err, request, {
    routerKind: 'App Router',
    routePath: request.path,
    routeType: 'route',
  });
}
