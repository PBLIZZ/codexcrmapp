# Next.js 15 Release Briefing

**Date:** October 21st, 2024 (Official Stable Release)

## Executive Summary

Next.js 15 is a significant stable release that focuses on stability, performance, and developer experience enhancements, building upon the updates from RC1 and RC2. Key highlights include official support for React 19, substantial improvements to caching semantics (with changes to default behaviors), a stable Turbopack Dev experience, and new experimental APIs for advanced server-side control. The release also emphasizes smoother upgrade paths through an enhanced codemod CLI and improved security for Server Actions.

## Main Themes and Key Ideas/Facts

### 1. Stability and Smoother Upgrades

#### Official Stable Release
Next.js 15 is now "officially stable and ready for production," emphasizing a focus on stability throughout its development.

#### @next/codemod CLI
A new and enhanced CLI tool (`npx @next/codemod@canary upgrade latest`) is introduced to "automate upgrading breaking changes," making the migration process smoother. It updates dependencies, shows available codemods, and guides users.

#### Backward Compatibility
Next.js 15 "maintains backward compatibility for the Pages Router with React 18," allowing users to upgrade Next.js while still using React 18 in Pages Router applications, offering greater control over the upgrade path. However, mixing React 18 (Pages Router) and React 19 (App Router) in the same application is "not recommended."

### 2. React 19 Integration and Enhancements

#### React 19 Support
Next.js 15 aligns with the upcoming React 19 release, with the "App Router uses React 19 RC." Extensive testing suggests stability, paving the way for React 19 GA.

#### React Compiler (Experimental)
Support is added for the "new experimental compiler created by the React team at Meta." This compiler aims to "reduce the amount of manual memoization" (e.g., `useMemo`, `useCallback`), leading to "simpler, easier to maintain, and less error prone" code by automatically adding optimizations.

**Note:** Currently, the React Compiler is a Babel plugin, which may result in "slower development and build times."

#### Hydration Error Improvements
Next.js 15 builds on previous improvements by providing an "improved hydration error view" that displays "the source code of the error with suggestions on how to address the issue."

### 3. Caching and Rendering Model Evolution (Breaking Changes)

#### Async Request APIs (Breaking Change)
APIs relying on request-specific data (e.g., `headers`, `cookies`, `params`, `searchParams`) are transitioning to be asynchronous. This is an "incremental step towards a simplified rendering and caching model" and allows the server to "prepare as much as possible before a request arrives." A codemod (`npx @next/codemod@canary next-async-request-api .`) is available for migration, though temporary synchronous access with warnings is provided.

#### Changed Caching Semantics (Breaking)
Based on feedback and interaction with Partial Prerendering (PPR), Next.js 15 changes default caching behavior:

**GET Route Handlers:** No longer cached by default. Users must "opt into caching using a static route config option such as `export dynamic = 'force-static'`."

**Client Router Cache:** No longer caches Page components by default, with `staleTime` set to 0 for Page segments. This ensures client navigation "always reflect the latest data."

**Unchanged behaviors:** Shared layout data won't be refetched, back/forward navigation restores from cache, and `loading.js` remains cached for 5 minutes. Users can "opt into the previous Client Router Cache behavior" via `experimental.staleTimes.dynamic: 30` in `next.config.ts`.

### 4. Performance and Observability

#### Turbopack Dev (Stable)
`next dev --turbo` is now "stable and ready to speed up your development experience." Vercel internal testing shows significant improvements:
- **Up to 76.7% faster** local server startup
- **Up to 96.3% faster** code updates with Fast Refresh
- **Up to 45.8% faster** initial route compile

#### Static Route Indicator
A "new visual indicator shows static routes during development" to help identify rendering strategies and "optimize performance."

#### unstable_after API (Experimental)
Allows execution of "code after a response finishes streaming," enabling secondary tasks like logging or analytics to run "without blocking the primary response," even in serverless environments.

#### instrumentation.js API (Stable)
This file, with the `register()` API, provides a stable way to "tap into the Next.js server lifecycle to monitor performance, track the source of errors, and deeply integrate with observability libraries like OpenTelemetry." A new `onRequestError` hook is also available.

#### Development and Build Improvements

**Server Components HMR:** Hot Module Replacement (HMR) can now "re-use fetch responses from previous renders" to improve local development performance and reduce API call costs.

**Faster Static Generation:** Optimizations reuse the first render, reducing build times. Static generation workers also "share the fetch cache across pages."

**Advanced Static Generation Control (Experimental):** New experimental options like `staticGenerationRetryCount`, `staticGenerationMaxConcurrency`, and `staticGenerationMinPagesPerWorker` offer more granular control for advanced use cases.

### 5. Developer Experience and Security

#### Enhanced Forms (next/form)
A new `<Form>` component extends HTML forms with "prefetching, client-side navigation, and progressive enhancement," simplifying common patterns that previously required "a lot of manual boilerplate."

#### next.config.ts Support
Full TypeScript support is now available for `next.config.ts` files, including a `NextConfig` type for "autocomplete and type-safe options."

#### Self-hosting Improvements
- More control over `Cache-Control` directives, including configurable `expireTime` (previously `experimental.swrDelta`) with a new default of one year
- Next.js no longer overrides custom `Cache-Control` values
- Automatic installation of `sharp` for image optimization when using `next start` or standalone output mode, removing a common missed recommendation

#### Server Actions Security
Enhanced security for Server Actions through:
- **"Dead code elimination"** (unused actions won't have IDs exposed)
- **"Secure action IDs"** that are "unguessable, non-deterministic IDs" and "periodically recalculated between builds"

Users are still advised to "treat Server Actions as public HTTP endpoints."

#### Bundling External Packages (Stable)
New config options (`serverExternalPackages` for App/Pages Router, `bundlePagesRouterDependencies` for Pages Router) unify and simplify control over bundling external packages, which can "improve the cold start performance."

#### ESLint 9 Support
Next.js 15 adds support for ESLint 9 while maintaining "backwards compatible" support for ESLint 8. It also includes an automatic "escape hatch" (`ESLINT_USE_FLAT_CONFIG=false`) for users not yet on the new config format.

## Breaking Changes Summary

Next.js 15 introduces several breaking changes to enable future optimizations and improve consistency. Users should consult the detailed upgrade guide:

### Major Breaking Changes

- **Async Request APIs:** `cookies`, `headers`, `draftMode`, `params`, `searchParams` now asynchronous
- **Caching Semantics:** `fetch` requests, GET Route Handlers, and client navigations are no longer cached by default
- **next/image:** Removal of `squoosh` in favor of `sharp` as an optional dependency, changed default `Content-Disposition` to `attachment`
- **Middleware:** `react-server` condition applied to limit unrecommended React API imports
- **next/font:** Removed support for external `@next/font` package and font-family hashing

### Configuration Changes

- **Caching:** `force-dynamic` now sets a `no-store` default to the fetch cache
- **Config:** `swcMinify`, `missingSuspenseWithCSRBailout`, and `outputFileTracing` enabled by default; deprecated options removed
- **Minimum Node.js Version:** Updated to 18.18.0
- **revalidateTag and revalidatePath:** Calling these during render will now throw an error

### API Changes

- **export const runtime = "experimental-edge":** Deprecated, switch to `export const runtime = "edge"`
- **next/dynamic:** Removed `suspense` prop, won't insert empty Suspense boundary in App Router

## Upcoming Information

**Next.js Conf:** More information about "what's coming next" will be shared this Thursday, October 24th.

## Contributors

Next.js 15 is the result of collaboration between the Next.js team, Turbopack team, Next.js Docs team, and "over 3,000 individual developers, industry partners like Google and Meta."