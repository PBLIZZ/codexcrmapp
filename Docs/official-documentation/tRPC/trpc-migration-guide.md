# Migrating from tRPC v10 to v11

> **Tip**: For most users, the migration should be quick & straight-forward.

If the below three steps aren't enough, look through the document for sections marked "rarely breaking".

## Quick Migration Steps

### 1. Install new versions

```bash
# npm
npm install @trpc/server@^11 @trpc/client@^11 @trpc/react-query@^11 @trpc/next@^11 @tanstack/react-query@^5 @tanstack/react-query-devtools@^5

# yarn
yarn add @trpc/server@^11 @trpc/client@^11 @trpc/react-query@^11 @trpc/next@^11 @tanstack/react-query@^5 @tanstack/react-query-devtools@^5

# pnpm
pnpm add @trpc/server@^11 @trpc/client@^11 @trpc/react-query@^11 @trpc/next@^11 @tanstack/react-query@^5 @tanstack/react-query-devtools@^5

# bun
bun add @trpc/server@^11 @trpc/client@^11 @trpc/react-query@^11 @trpc/next@^11 @tanstack/react-query@^5 @tanstack/react-query-devtools@^5

# deno
# Add imports to your import_map.json
```

### 2. If you're using transformers, update your links

See [transformers are moved to links](#transformers-are-moved-to-links-breaking) for more information.

### 3. If you're using @trpc/react-query update your @tanstack/react-query version

See [react-query-v5](#react-query-peerdep-is-now-v5-breaking) for more information.

## Full Reverse-Chronological Changelog

### New TanStack React Query integration! (non-breaking)

We are excited to announce the new TanStack React Query integration for tRPC is now available on tRPC's next-release!

Read the blog post for more information.

### Stopping subscriptions from the server (rarely breaking)

We now support stopping subscriptions from the server, this means that you can now do things like this:

```typescript
const myRouter = router({
  sub: publicProcedure.subscription(async function* (opts) {
    for await (const data of on(ee, 'data', {
      signal: opts.signal,
    })) {
      const num = data[0] as number | undefined;
      if (num === undefined) {
        // This will now stop the subscription on the client and trigger the `onComplete` callback
        return;
      }
      yield num;
    }
  }),
});
```

See the subscriptions docs for more information.

### Added support for lazy-loading routers (non-breaking)

See the lazy-loading routers docs for more information.

As part of this, we've changed the argument of the internal method `callProcedure()` to receive a `{ router: AnyRouter }`-param instead of a `{ _def: AnyRouter['_def'] }`-param.

### Custom basePath to handle requests under in the standalone adapter (non-breaking)

The standalone adapter now supports a `basePath` option, which will slice the basePath from the beginning of the request path.

See the standalone adapter docs for more information.

### Added support for HTTP/2 servers (non-breaking)

We now support HTTP/2 servers, this means that you can now use the `createHTTP2Handler` and `createHTTPServer` functions to create HTTP/2 servers.

See the standalone adapter docs for more information.

### Move TRPCProcedureOptions to @trpc/client (non-breaking for most)

If you previously used `ProcedureOptions` from `@trpc/server`, you now need to use `TRPCProcedureOptions` from `@trpc/client` instead.

### Allow promises to be embedded in nested data (non-breaking)

We now allow promises to be embedded in nested data when using the `httpBatchStreamLink`, this means that you can now do things like this:

```typescript
const router = router({
  embedPromise: publicProcedure.query(() => {
    async function slowThing() {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return 'slow';
    }
    return {
      instant: 'instant',
      slow: slowThing(),
    };
  }),
});
```

### Moved reconnectAfterInactivityMs to sse.client (non-breaking)

Updated HTTP Subscription Link improvements-section and related docs.

### TypeScript version >=5.7.2 is now required (non-breaking)

tRPC now requires TypeScript version 5.7.2 or higher. This change was made in response to a bug report where we decided to take a forward-looking approach.

If you try to install tRPC with an unsupported TypeScript version, you'll receive a peer dependency error during installation.

If you notice your editor showing any types, it's likely because your editor isn't using the correct TypeScript version. To fix this, you'll need to configure your editor to use the TypeScript version installed in your project's package.json.

For VSCode users, add these settings to your `.vscode/settings.json`:

```json
{
  "typescript.tsdk": "node_modules/typescript/lib",
  "typescript.enablePromptUseWorkspaceTsdk": true
}
```

### Moves experimental.sseSubscriptions -> sse (non-breaking)

The `experimental.sseSubscriptions` option has been moved to just `sse` in the `initTRPC.create()`-function.

### HTTP Subscription Link improvements (non-breaking)

Added support for detecting and recovering from stale connections:

On the server, you can configure a ping interval to keep the connection alive:

```typescript
export const t = initTRPC.create({
  // ...
  sse: {
    ping: {
      enabled: true,
      intervalMs: 15_000,
    },
    client: {
      // Reconnect if no messages or pings are received for 20 seconds
      reconnectAfterInactivityMs: 20_000,
    },
  },
});
```

We will likely add a default ping interval and timeout configuration in the future, but this is not yet decided. Feedback is welcome in the 🎏-rfc-streaming channel on Discord.

See the httpSubscriptionLink docs for more details on these features.

### Introduction of retryLink (non-breaking)

See retryLink - allows you to retry failed operations

### useSubscription improvements (non-breaking)

- When subscribing to procedures using the useSubscription hook it will now return information about the status of the subscription and the connection.
- Ability to have a ponyfill when using httpSubscriptionLink

### Subscription procedure output type changed to AsyncGenerator (non-breaking)

If you've used subscriptions with async generators with the v11, this might be breaking with how you infer your types.

**Details**:
This change has been made to ensure the library remains compatible with future updates and allows for the use of the return type in subscriptions' AsyncGenerators.

See subscriptions docs for more information.

### Added support for output validators in subscriptions (non-breaking)

See subscriptions docs for more information.

### Deprecation of subscriptions returning Observables (non-breaking)

We now support returning async generator function for subscriptions and we previously added a httpSubscriptionLink.

To see how to use async generator functions for subscriptions see the subscriptions docs.

### Removal of AbortControllerEsque-ponyfill (rarely breaking)

We have removed the AbortControllerEsque-ponyfill from tRPC, if you need to support older browsers you can use a polyfill like abortcontroller-polyfill.

### Support for Server-sent events (SSE) (non-breaking)

We now support SSE for subscriptions, this means that you don't need to spin up a WebSocket server to get real-time updates in your application & that the client can automatically reconnect and resume if the connection is lost.

👉 See more in the httpSubscriptionLink docs.

### Support for streaming responses over HTTP (non-breaking)

We now support streaming mutations and queries using the httpBatchStreamLink.

This means that query and mutation resolvers can either be AsyncGenerators with yield or return promises that can be deferred for later and you can use stream responses over HTTP, without using WebSockets.

We want your feedback on this feature, so please try it out and let us know what you think in the 🎏-rfc-streaming-channel on our Discord!

👉 See more in the httpBatchStreamLink docs

### resolveHTTPRequest has been replaced by resolveRequest that uses Fetch APIs (rarely breaking)

The function `resolveHTTPRequest` has been replaced by `resolveRequest` which uses the Fetch API - Request/Response.

This is a breaking change for HTTP-adapters, but should not affect you as a user.

If you're building an adapter, check out how our adapters work in the code and don't be a stranger to ask for help in our Discord.

### TRPCRequestInfo has been updated (rarely breaking)

Inputs are now materialised lazily when required by the procedure, which means the input and procedure type is no longer available when tRPC calls createContext.

You can still access the input by calling `info.calls[index].getRawInput()`.

### All the experimental form-data support has been replaced (rarely breaking)

This only affects you if you used the experimental formdata features

- `experimental_formDataLink` - use httpLink
- `experimental_parseMultipartFormData` - not needed anymore
- `experimental_isMultipartFormDataRequest` - not needed anymore
- `experimental_composeUploadHandlers` - not needed anymore
- `experimental_createMemoryUploadHandler` - not needed anymore
- `experimental_NodeOnDiskFile` and `experimental_createFileUploadHandler` - not supported in this first release, open an issue if you need to hold data on disk
- `experimental_contentTypeHandlers` - not needed anymore, but could come back if needed by the community for novel data types

You can see the new approach in examples/next-formdata

### Moved Procedure._def._output_in / Procedure._def._input_in to Procedure._def.$types (non-breaking)

This is a breaking change for tRPC internals, but should not affect you as a user.

You don't have to do anything, unless you're using `Procedure._def._output_in` or `Procedure._def._input_in` directly in your code.

### Explicit Content-Type checks (non-breaking)

We now have explicit checks for the Content-Type-header when doing POST-requests. This means that if you send a request with a Content-Type that doesn't match the expected one, you will get a 415 Unsupported Media Type-error.

Our tRPC clients already sends content-type headers, so is only a potential breaking change if you call tRPC manually.

### Added support for method overriding (rarely breaking)

Allows you to override the HTTP method for procedures to always be sent with POST in order to get around some limitations with e.g. max URL lengths.

Closes #3910

### Added support for bi-directional infinite queries (non-breaking)

See useInfiniteQuery()

### Added inferProcedureBuilderResolverOptions<T>-helper (non-breaking)

Adds a helper to infer the options for a procedure builder resolver. This is useful if you want to create reusable functions for different procedures.

See test here for a reference on how to use it

### Transformers are moved to links (breaking) {#transformers-are-moved-to-links-breaking}

TypeScript will guide you through this migration.

Only applies if you use data transformers.

You now setup data transformers in the links-array instead of when you initialize the tRPC-client.

Wherever you have a HTTP Link you have to add `transformer: superjson` if you use transformers:

```typescript
httpBatchLink({
  url: '/api/trpc',
  transformer: superjson, // <-- add this
});

createTRPCNext<AppRouter>({
  // [..]
  transformer: superjson, // <-- add this
});
```

### @trpc/next ssr mode now requires a prepass helper with ssr: true (rarely breaking)

This is to fix https://github.com/trpc/trpc/issues/5378 where react-dom was imported regardless if you were using this functionality or not.

See SSR docs

### Added support for short-hand router definitions (non-breaking)

See Merging routers

```typescript
const appRouter = router({
  // Shorthand plain object for creating a sub-router
  nested1: {
    proc: publicProcedure.query(() => '...'),
  },
  // Equivalent of:
  nested2: router({
    proc: publicProcedure.query(() => '...'),
  }),
});
```

### Deleted inferHandlerInput<T> and ProcedureArgs<T> (non-breaking for most)

If these types mean nothing for you or your codebase, just ignore this.

Use `inferProcedureInput<TProcedure>` instead & `TRPCProcedureOptions` instead.

### Added useSuspenseQueries()

See useSuspenseQueries

https://github.com/trpc/trpc/pull/5226

### Refactor internal generics (rarely breaking)

We have refactored our internal generics and made them more readable.

### React is now >=18.2.0 (rarely breaking)

Check their migration guide: https://react.dev/blog/2022/03/08/react-18-upgrade-guide

### NodeJS 18+ and Modern Browsers are now required (rarely breaking)

We have added usage of FormData, File, Blob, and ReadableStream. NodeJS 18 is now required, though these have been supported by browsers for many years now.

### wsLink improvements (minor)

- Ability to pass a Promise in the url-callback if servers switch location during deploys
- Added new lazy option that makes the websocket automatically disconnect when there are no pending requests

### rawInput in middleware is now a getRawInput (rarely breaking)

While we're not doing anything differently internally (just yet) this is help support a much requested feature in tRPC: content types other than JSON.

### Simplified types and .d.ts outputs

Procedures in your router now only emit their input & output - where before they would also contain the full context object for every procedure, leading to unnecessary complexity in e.g. .d.ts.

### React Query peerDep is now v5 (breaking) {#react-query-peerdep-is-now-v5-breaking}

The main thing you'll need to do is to replace a bunch of `isLoading` to `isPending`.

Check their migration guide: https://tanstack.com/query/v5/docs/framework/react/guides/migrating-to-v5

### Exports names AbcProxyXyz has been renamed to AbcXyz (non-breaking)

The proxy names were due to v9 using the AbcXyz names, these have been removed and the proxy ones have been renamed to the non-proxy names, e.g:

- `createTRPCClient` was deprecated from v9, and is now completely removed. The `createTRPCProxyClient` has been renamed to `createTRPCClient` instead. `createTRPCProxyClient` is now marked as deprecated.

### SSG Helpers (rarely breaking)

- `createSSGHelpers` were for v9 which has now been removed. the v10 equivalent `createProxySSGHelpers` have been renamed to `createSSGHelpers` now instead.
- `createProxySSGHelpers` is now deprecated but aliased to `createSSGHelpers` for backwards compatibility.
- Removed exported type `CreateSSGHelpersOptions`

### interop-mode has been removed (rarely breaking)

We have removed the interop-mode from tRPC. This was a mode that allowed you to have an easy transition period from v9 to v10. This mode was never meant to be supported long-term and we have now removed it.