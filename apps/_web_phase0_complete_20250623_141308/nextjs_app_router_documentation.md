//apps/web/nextjs_app_router_documentation.md

# Next.js App Router Documentation

## Project Structure and Organization

This page provides an overview of all the folder and file conventions in Next.js, and recommendations for organizing your project.

### Folder and File Conventions

#### Top-level Folders

Top-level folders are used to organize your application's code and static assets.

| Folder           | Purpose                      |
| ---------------- | ---------------------------- |
| **`app`**        | App Router                   |
| **`components`** | React components             |
| **`lib`**        | Utilities and configurations |
| **`hooks`**      | Custom hooks                 |
| **`public`**     | Static assets to be served   |

#### Top-level Files

Top-level files are used to configure your application, manage dependencies, run middleware, integrate monitoring tools, and define environment variables.

| File                            | Purpose                                          |
| ------------------------------- | ------------------------------------------------ |
| **`next.config.js`**            | Configuration file for Next.js                   |
| **`package.json`**              | Project dependencies and scripts                 |
| **`postcss.config.js`**         | PostCSS configuration file                       |
| **`tailwind.config.js`**        | Tailwind CSS configuration file                  |
| **`instrumentation.ts`**        | OpenTelemetry and Instrumentation file           |
| **`instrumentation-client.ts`** | OpenTelemetry and Instrumentation file           |
| **`middleware.ts`**             | Next.js request middleware                       |
| **`.env`**                      | Environment variables                            |
| **`.env.local`**                | Local environment variables                      |
| **`.env.production`**           | Production environment variables                 |
| **`.env.development`**          | Development environment variables                |
| **`.eslint.config.js`**         | Configuration file at monorepo root for ESLint   |
| **`.gitignore`**                | Git files and folders to ignore at monorepo root |
| **`next-env.d.ts`**             | TypeScript declaration file for Next.js          |
| **`tsconfig.json`**             | Configuration file for TypeScript                |
| **`components.json`**           | Configuration file for components                |
| **`sentry.edge.config.js`**     | Sentry configuration file                        |
| **`sentry.server.config.js`**   | Sentry configuration file                        |

#### Routing Files

| File               | Extensions | Purpose                      |
| ------------------ | ---------- | ---------------------------- |
| **`layout`**       | `.tsx`     | Layout                       |
| **`page`**         | `.tsx`     | Page                         |
| **`loading`**      | `.tsx`     | Loading UI                   |
| **`not-found`**    | `.tsx`     | Not found UI                 |
| **`error`**        | `.tsx`     | Error UI                     |
| **`global-error`** | `.tsx`     | Global error UI              |
| **`route`**        | `.ts`      | API endpoint                 |
| **`template`**     | `.tsx`     | Re-rendered layout           |
| **`default`**      | `.tsx`     | Parallel route fallback page |

#### Nested Routes

| Convention          | Purpose              |
| ------------------- | -------------------- |
| **`folder`**        | Route segment        |
| **`folder/folder`** | Nested route segment |

#### Dynamic Routes

| Convention          | Purpose                          |
| ------------------- | -------------------------------- |
| **`[folder]`**      | Dynamic route segment            |
| **`[...folder]`**   | Catch-all route segment          |
| **`[[...folder]]`** | Optional catch-all route segment |

#### Route Groups and Private Folders

| Convention     | Purpose                                          |
| -------------- | ------------------------------------------------ |
| **`(folder)`** | Group routes without affecting routing           |
| **`_folder`**  | Opt folder and all child segments out of routing |

#### Parallel and Intercepted Routes

| Convention           | Purpose                    |
| -------------------- | -------------------------- |
| **`@folder`**        | Named slot                 |
| **`(.)folder`**      | Intercept same level       |
| **`(..)folder`**     | Intercept one level above  |
| **`(..)(..)folder`** | Intercept two levels above |
| **`(...)folder`**    | Intercept from root        |

### Metadata File Conventions

#### App Icons

| File             | Extensions                          | Purpose                  |
| ---------------- | ----------------------------------- | ------------------------ |
| **`favicon`**    | `.ico`                              | Favicon file             |
| **`icon`**       | `.ico` `.jpg` `.jpeg` `.png` `.svg` | App Icon file            |
| **`icon`**       | `.js` `.ts` `.tsx`                  | Generated App Icon       |
| **`apple-icon`** | `.jpg` `.jpeg` `.png`               | Apple App Icon file      |
| **`apple-icon`** | `.js` `.ts` `.tsx`                  | Generated Apple App Icon |

#### Open Graph and Twitter Images

| File                  | Extensions                   | Purpose                    |
| --------------------- | ---------------------------- | -------------------------- |
| **`opengraph-image`** | `.jpg` `.jpeg` `.png` `.gif` | Open Graph image file      |
| **`opengraph-image`** | `.js` `.ts` `.tsx`           | Generated Open Graph image |
| **`twitter-image`**   | `.jpg` `.jpeg` `.png` `.gif` | Twitter image file         |
| **`twitter-image`**   | `.js` `.ts` `.tsx`           | Generated Twitter image    |

#### SEO

| File          | Extensions  | Purpose               |
| ------------- | ----------- | --------------------- |
| **`sitemap`** | `.xml`      | Sitemap file          |
| **`sitemap`** | `.js` `.ts` | Generated Sitemap     |
| **`robots`**  | `.txt`      | Robots file           |
| **`robots`**  | `.js` `.ts` | Generated Robots file |

### Organizing Your Project

#### Component Hierarchy

The components defined in special files are rendered in a specific hierarchy:

1. **`layout.tsx`**
2. **`template.tsx`**
3. **`error.tsx`** (React error boundary)
4. **`loading.tsx`** (React suspense boundary)
5. **`not-found.tsx`** (React error boundary)
6. **`page.tsx`** or nested **`layout.tsx`**

The components are rendered recursively in nested routes, meaning the components of a route segment will be nested inside the components of its parent segment.

#### Colocation

In the **`app`** directory, nested folders define route structure. Each folder represents a route segment that is mapped to a corresponding segment in a URL path.

However, even though route structure is defined through folders, a route is not publicly accessible until a **`page.tsx`** or **`route.ts`** file is added to a route segment.

And, even when a route is made publicly accessible, only the content returned by **`page.tsx`** or **`route.ts`** is sent to the client.

This means that project files can be safely colocated inside route segments in the **`app`** directory without accidentally being routable.

> **Good to know:** While you can colocate your project files in **`app`** you don't have to. If you prefer, you can keep them outside the **`app`** directory.

#### Private Folders

Private folders can be created by prefixing a folder with an underscore: **`_folderName`**

This indicates the folder is a private implementation detail and should not be considered by the routing system, thereby opting the folder and all its subfolders out of routing.

Since files in the **`app`** directory can be safely colocated by default, private folders are not required for colocation. However, they can be useful for:

- Separating UI logic from routing logic
- Consistently organizing internal files across a project and the Next.js ecosystem
- Sorting and grouping files in code editors
- Avoiding potential naming conflicts with future Next.js file conventions

> **Good to know:**
>
> - While not a framework convention, you might also consider marking files outside private folders as "private" using the same underscore pattern
> - You can create URL segments that start with an underscore by prefixing the folder name with `%5F` (the URL-encoded form of an underscore): **`%5FfolderName`**
> - If you don't use private folders, it would be helpful to know Next.js special file conventions to prevent unexpected naming conflicts

#### Route Groups

Route groups can be created by wrapping a folder in parenthesis: **`(folderName)`**

This indicates the folder is for organizational purposes and should not be included in the route's URL path.

Route groups are useful for:

- Organizing routes by site section, intent, or team (e.g. contacts pages, tasks pages, etc.)
- Enabling nested layouts in the same route segment level:
  - Creating multiple nested layouts in the same segment, including multiple root layouts
  - Adding a layout to a subset of routes in a common segment

#### src Folder

Next.js supports storing application code (including **`app`**) inside a monorepo **`apps/web`** folder. This separates application code from project configuration files which mostly live in the root of a project.

### Examples

The following section lists a very high-level overview of common strategies. The simplest takeaway is to choose a strategy that works for you and your team and be consistent across the project.

> **Good to know:** In our examples below, we're using **`components`** and **`lib`** folders as generalized placeholders, their naming has no special framework significance and your projects might use other folders like **`ui`**, **`utils`**, **`hooks`**, **`styles`**, etc.

#### Store Project Files Outside of app

This strategy stores all application code in shared folders in the root of your project and keeps the **`app`** directory purely for routing purposes.

#### Store Project Files in Top-level Folders Inside of app

This strategy stores all application code in shared folders in the root of the **`app`** directory.

#### Split Project Files by Feature or Route

This strategy stores globally shared application code in the root **`app`** directory and splits more specific application code into the route segments that use them.

#### Organize Routes Without Affecting the URL Path

To organize routes without affecting the URL, create a group to keep related routes together. The folders in parenthesis will be omitted from the URL (e.g. **`(contacts)`** or **`(tasks)`**).

Even though routes inside **`(contacts)`** and **`(tasks)`** share the same URL hierarchy, you can create a different layout for each group by adding a **`layout.tsx`** file inside their folders.

#### Opting Specific Segments into a Layout

To opt specific routes into a layout, create a new route group (e.g. **`(settings)`**) and move the routes that share the same layout into the group (e.g. **`account`** and **`billing`**). The routes outside of the group will not share the layout (e.g. **`contact`**).

#### Opting for Loading Skeletons on a Specific Route

To apply a loading skeleton via a **`loading.tsx`** file to a specific route, create a new route group (e.g., **`/(overview)`**) and then move your **`loading.tsx`** inside that route group.

Now, the **`loading.tsx`** file will only apply to your dashboard → overview page instead of all your dashboard pages without affecting the URL path structure.

#### Creating Multiple Root Layouts

To create multiple root layouts, remove the top-level **`layout.tsx`** file, and add a **`layout.tsx`** file inside each route group. This is useful for partitioning an application into sections that have a completely different UI or experience. The **`<html>`** and **`<body>`** tags need to be added to each root layout.

In the example above, both **`(contacts)`** and **`(tasks)`** have their own root layout.

---

## Layouts and Pages

Next.js uses file-system based routing, meaning you can use folders and files to define routes. This page will guide you through how to create layouts and pages, and link between them.

### Creating a Page

A page is UI that is rendered on a specific route. To create a page, add a **`page`** file inside the **`app`** directory and default export a React component. For example, to create an index page (`/`):

```tsx
// app/page.tsx
export default function Page() {
  return <h1>Hello Next.js!</h1>;
}
```

### Creating a Layout

A layout is UI that is shared between multiple pages. On navigation, layouts preserve state, remain interactive, and do not rerender.

You can define a layout by default exporting a React component from a **`layout`** file. The component should accept a **`children`** prop which can be a page or another layout.

For example, to create a layout that accepts your index page as child, add a **`layout`** file inside the **`app`** directory:

```tsx
// app/layout.tsx
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en'>
      <body>
        {/* Layout UI */}
        {/* Place children where you want to render a page or nested layout */}
        <main>{children}</main>
      </body>
    </html>
  );
}
```

The layout above is called a **root layout** because it's defined at the root of the **`app`** directory. The root layout is required and must contain **`html`** and **`body`** tags.

### Creating a Nested Route

A nested route is a route composed of multiple URL segments. For example, the `/blog/[slug]` route is composed of three segments:

- `/` (Root Segment)
- `blog` (Segment)
- `[slug]` (Leaf Segment)

In Next.js:

- Folders are used to define the route segments that map to URL segments
- Files (like **`page`** and **`layout`**) are used to create UI that is shown for a segment

To create nested routes, you can nest folders inside each other. For example, to add a route for `/blog`, create a folder called **`blog`** in the **`app`** directory. Then, to make `/blog` publicly accessible, add a **`page.tsx`** file:

```tsx
// app/blog/page.tsx
// Dummy imports
import { getPosts } from '@/lib/posts';
import { Post } from '@/ui/post';

export default async function Page() {
  const posts = await getPosts();

  return (
    <ul>
      {posts.map((post) => (
        <Post key={post.id} post={post} />
      ))}
    </ul>
  );
}
```

You can continue nesting folders to create nested routes. For example, to create a route for a specific blog post, create a new **`[slug]`** folder inside **`blog`** and add a **`page`** file:

```tsx
// app/blog/[slug]/page.tsx
function generateStaticParams() {}

export default function Page() {
  return <h1>Hello, Blog Post Page!</h1>;
}
```

Wrapping a folder name in square brackets (e.g. **`[slug]`**) creates a **dynamic route segment** which is used to generate multiple pages from data (e.g. blog posts, product pages, etc.).

### Nesting Layouts

By default, layouts in the folder hierarchy are also nested, which means they wrap child layouts via their **`children`** prop. You can nest layouts by adding **`layout`** inside specific route segments (folders).

For example, to create a layout for the `/blog` route, add a new **`layout`** file inside the **`blog`** folder.

```tsx
// app/blog/layout.tsx
export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return <section>{children}</section>;
}
```

If you were to combine the two layouts above, the root layout (`app/layout.tsx`) would wrap the blog layout (`app/blog/layout.tsx`), which would wrap the blog (`app/blog/page.tsx`) and blog post page (`app/blog/[slug]/page.tsx`).

### Creating a Dynamic Segment

Dynamic segments allow you to create routes that are generated from data. For example, instead of manually creating a route for each individual blog post, you can create a dynamic segment to generate the routes based on blog post data.

To create a dynamic segment, wrap the segment (folder) name in square brackets: **`[segmentName]`**. For example, in the `app/blog/[slug]/page.tsx` route, the **`[slug]`** is the dynamic segment.

```tsx
// app/blog/[slug]/page.tsx
export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPost(slug);

  return (
    <div>
      <h1>{post.title}</h1>
      <p>{post.content}</p>
    </div>
  );
}
```

### Linking Between Pages

You can use the **`<Link>`** component to navigate between routes. **`<Link>`** is a built-in Next.js component that extends the HTML **`<a>`** tag to provide prefetching and client-side navigation.

For example, to generate a list of blog posts, import **`<Link>`** from `next/link` and pass a **`href`** prop to the component:

```tsx
// app/ui/post.tsx
import Link from 'next/link';

export default async function Post({ post }) {
  const posts = await getPosts();

  return (
    <ul>
      {posts.map((post) => (
        <li key={post.slug}>
          <Link href={`/blog/${post.slug}`}>{post.title}</Link>
        </li>
      ))}
    </ul>
  );
}
```

> **Good to know:** **`<Link>`** is the primary way to navigate between routes in Next.js. You can also use the **`useRouter`** hook for more advanced navigation.

---

## Linking and Navigating

In Next.js, routes are rendered on the server by default. This often means the client has to wait for a server response before a new route can be shown. Next.js comes with built-in prefetching, streaming, and client-side transitions ensuring navigation stays fast and responsive.

This guide explains how navigation works in Next.js and how you can optimize it for dynamic routes and slow networks.

### How Navigation Works

To understand how navigation works in Next.js, it helps to be familiar with the following concepts:

- **Server Rendering**
- **Prefetching**
- **Streaming**
- **Client-side transitions**

#### Server Rendering

In Next.js, **Layouts** and **Pages** are React Server Components by default. On initial and subsequent navigations, the Server Component Payload is generated on the server before being sent to the client.

There are two types of server rendering, based on when it happens:

- **Static Rendering** (or Prerendering) happens at build time or during revalidation and the result is cached
- **Dynamic Rendering** happens at request time in response to a client request

The trade-off of server rendering is that the client must wait for the server to respond before the new route can be shown. Next.js addresses this delay by prefetching routes the user is likely to visit and performing client-side transitions.

> **Good to know:** HTML is also generated for the initial visit.

#### Prefetching

Prefetching is the process of loading a route in the background before the user navigates to it. This makes navigation between routes in your application feel instant, because by the time a user clicks on a link, the data to render the next route is already available client side.

Next.js automatically prefetches routes linked with the **`<Link>`** component when they enter the user's viewport.

```tsx
// app/layout.tsx
import Link from 'next/link';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body>
        <nav>
          {/* Prefetched when the link is hovered or enters the viewport */}
          <Link href='/blog'>Blog</Link>
          {/* No prefetching */}
          <a href='/contact'>Contact</a>
        </nav>
        {children}
      </body>
    </html>
  );
}
```

How much of the route is prefetched depends on whether it's static or dynamic:

- **Static Route:** the full route is prefetched
- **Dynamic Route:** prefetching is skipped, or the route is partially prefetched if **`loading.tsx`** is present

By skipping or partially prefetching dynamic routes, Next.js avoids unnecessary work on the server for routes the users may never visit. However, waiting for a server response before navigation can give the users the impression that the app is not responding.

To improve the navigation experience to dynamic routes, you can use streaming.

#### Streaming

Streaming allows the server to send parts of a dynamic route to the client as soon as they're ready, rather than waiting for the entire route to be rendered. This means users see something sooner, even if parts of the page are still loading.

For dynamic routes, it means they can be partially prefetched. That is, shared layouts and loading skeletons can be requested ahead of time.

To use streaming, create a **`loading.tsx`** in your route folder:

```tsx
// app/dashboard/loading.tsx
export default function Loading() {
  // Add fallback UI that will be shown while the route is loading.
  return <LoadingSkeleton />;
}
```

Behind the scenes, Next.js will automatically wrap the **`page.tsx`** contents in a **`<Suspense>`** boundary. The prefetched fallback UI will be shown while the route is loading, and swapped for the actual content once ready.

> **Good to know:** You can also use **`<Suspense>`** to create loading UI for nested components.

Benefits of **`loading.tsx`**:

- Immediate navigation and visual feedback for the user
- Shared layouts remain interactive and navigation is interruptible
- Improved Core Web Vitals: TTFB, FCP, and TTI

To further improve the navigation experience, Next.js performs a client-side transition with the **`<Link>`** component.

#### Client-side Transitions

Traditionally, navigation to a server-rendered page triggers a full page load. This clears state, resets scroll position, and blocks interactivity.

Next.js avoids this with client-side transitions using the **`<Link>`** component. Instead of reloading the page, it updates the content dynamically by:

- Keeping any shared layouts and UI
- Replacing the current page with the prefetched loading state or a new page if available

Client-side transitions are what makes a server-rendered apps feel like client-rendered apps. And when paired with prefetching and streaming, it enables fast transitions, even for dynamic routes.

### What Can Make Transitions Slow?

These Next.js optimizations make navigation fast and responsive. However, under certain conditions, transitions can still feel slow. Here are some common causes and how to improve the user experience:

#### Dynamic Routes Without loading.tsx

When navigating to a dynamic route, the client must wait for the server response before showing the result. This can give the users the impression that the app is not responding.

We recommend adding **`loading.tsx`** to dynamic routes to enable partial prefetching, trigger immediate navigation, and display a loading UI while the route renders.

```tsx
// app/blog/[slug]/loading.tsx
export default function Loading() {
  return <LoadingSkeleton />;
}
```

> **Good to know:** In development mode, you can use the Next.js Devtools to identify if the route is static or dynamic. See **`devIndicators`** for more information.

#### Dynamic Segments Without generateStaticParams

If a dynamic segment could be prerendered but isn't because it's missing **`generateStaticParams`**, the route will fallback to dynamic rendering at request time.

Ensure the route is statically generated at build time by adding **`generateStaticParams`**:

```tsx
// app/blog/[slug]/page.tsx
export async function generateStaticParams() {
  const posts = await fetch('https://.../posts').then((res) => res.json());

  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  // ...
}
```

#### Slow Networks

On slow or unstable networks, prefetching may not finish before the user clicks a link. This can affect both static and dynamic routes. In these cases, the **`loading.tsx`** fallback may not appear immediately because it hasn't been prefetched yet.

To improve perceived performance, you can use the **`useLinkStatus`** hook to show inline visual feedback to the user (like spinners or text glimmers on the link) while a transition is in progress.

```tsx
// app/ui/loading-indicator.tsx
'use client';

import { useLinkStatus } from 'next/link';

export default function LoadingIndicator() {
  const { pending } = useLinkStatus();
  return pending ? <div role='status' aria-label='Loading' className='spinner' /> : null;
}
```

You can "debounce" the loading indicator by adding an initial animation delay (e.g. 100ms) and starting the animation as invisible (e.g. opacity: 0). This means the loading indicator will only be shown if the navigation takes longer than the specified delay.

```css
.spinner {
  /* ... */
  opacity: 0;
  animation:
    fadeIn 500ms 100ms forwards,
    rotate 1s linear infinite;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes rotate {
  to {
    transform: rotate(360deg);
  }
}
```

> **Good to know:** You can use other visual feedback patterns like a progress bar.

#### Disabling Prefetching

You can opt out of prefetching by setting the **`prefetch`** prop to **`false`** on the **`<Link>`** component. This is useful to avoid unnecessary usage of resources when rendering large lists of links (e.g. an infinite scroll table).

```tsx
<Link prefetch={false} href='/blog'>
  Blog
</Link>
```

However, disabling prefetching comes with trade-offs:

- Static routes will only be fetched when the user clicks the link
- Dynamic routes will need to be rendered on the server first before the client can navigate to it

To reduce resource usage without fully disabling prefetch, you can prefetch only on hover. This limits prefetching to routes the user is more likely to visit, rather than all links in the viewport.

```tsx
// app/ui/hover-prefetch-link.tsx
'use client';

import Link from 'next/link';
import { useState } from 'react';

function HoverPrefetchLink({ href, children }: { href: string; children: React.ReactNode }) {
  const [active, setActive] = useState(false);

  return (
    <Link href={href} prefetch={active ? null : false} onMouseEnter={() => setActive(true)}>
      {children}
    </Link>
  );
}
```

#### Hydration Not Completed

**`<Link>`** is a Client Component and must be hydrated before it can prefetch routes. On the initial visit, large JavaScript bundles can delay hydration, preventing prefetching from starting right away.

React mitigates this with Selective Hydration and you can further improve this by:

- Using the **`@next/bundle-analyzer`** plugin to identify and reduce bundle size by removing large dependencies
- Moving logic from the client to the server where possible. See the Server and Client Components docs for guidance

### Examples

#### Native History API

Next.js allows you to use the native **`window.history.pushState`** and **`window.history.replaceState`** methods to update the browser's history stack without reloading the page.

**`pushState`** and **`replaceState`** calls integrate into the Next.js Router, allowing you to sync with **`usePathname`** and **`useSearchParams`**.

##### window.history.pushState

Use it to add a new entry to the browser's history stack. The user can navigate back to the previous state. For example, to sort a list of products:

```tsx
'use client';

import { useSearchParams } from 'next/navigation';

export default function SortProducts() {
  const searchParams = useSearchParams();

  function updateSorting(sortOrder: string) {
    const params = new URLSearchParams(searchParams.toString());
    params.set('sort', sortOrder);
    window.history.pushState(null, '', `?${params.toString()}`);
  }

  return (
    <>
      <button onClick={() => updateSorting('asc')}>Sort Ascending</button>
      <button onClick={() => updateSorting('desc')}>Sort Descending</button>
    </>
  );
}
```

##### window.history.replaceState

Use it to replace the current entry on the browser's history stack. The user is not able to navigate back to the previous state. For example, to switch the application's locale:

```tsx
'use client';

import { usePathname } from 'next/navigation';

export function LocaleSwitcher() {
  const pathname = usePathname();

  function switchLocale(locale: string) {
    // e.g. '/en/about' or '/fr/contact'
    const newPath = `/${locale}${pathname}`;
    window.history.replaceState(null, '', newPath);
  }

  return (
    <>
      <button onClick={() => switchLocale('en')}>English</button>
      <button onClick={() => switchLocale('fr')}>French</button>
    </>
  );
}
```

---

## Server and Client Components

By default, layouts and pages are **Server Components**, which lets you fetch data and render parts of your UI on the server, optionally cache the result, and stream it to the client. When you need interactivity or browser APIs, you can use **Client Components** to layer in functionality.

This page explains how Server and Client Components work in Next.js and when to use them, with examples of how to compose them together in your application.

### When to Use Server and Client Components?

The client and server environments have different capabilities. Server and Client components allow you to run logic in each environment depending on your use case.

#### Use Client Components when you need:

- State and event handlers (e.g. **`onClick`**, **`onChange`**)
- Lifecycle logic (e.g. **`useEffect`**)
- Browser-only APIs (e.g. **`localStorage`**, **`window`**, **`Navigator.geolocation`**, etc.)
- Custom hooks

#### Use Server Components when you need:

- Fetch data from databases or APIs close to the source
- Use API keys, tokens, and other secrets without exposing them to the client
- Reduce the amount of JavaScript sent to the browser
- Improve the First Contentful Paint (FCP), and stream content progressively to the client

For example, the **`<Page>`** component is a Server Component that fetches data about a post, and passes it as props to the **`<LikeButton>`** which handles client-side interactivity.

```tsx
// app/[id]/page.tsx
import LikeButton from '@/app/ui/like-button';
import { getPost } from '@/lib/data';

export default async function Page({ params }: { params: { id: string } }) {
  const post = await getPost(params.id);

  return (
    <div>
      <main>
        <h1>{post.title}</h1>
        {/* ... */}
        <LikeButton likes={post.likes} />
      </main>
    </div>
  );
}
```

```tsx
// app/ui/like-button.tsx
'use client';

import { useState } from 'react';

export default function LikeButton({ likes }: { likes: number }) {
  // ...
}
```

### How Do Server and Client Components Work in Next.js?

#### On the Server

On the server, Next.js uses React's APIs to orchestrate rendering. The rendering work is split into chunks, by individual route segments (layouts and pages):

- **Server Components** are rendered into a special data format called the React Server Component Payload (RSC Payload)
- **Client Components** and the RSC Payload are used to prerender HTML

> **What is the React Server Component Payload (RSC)?**
>
> The RSC Payload is a compact binary representation of the rendered React Server Components tree. It's used by React on the client to update the browser's DOM. The RSC Payload contains:
>
> - The rendered result of Server Components
> - Placeholders for where Client Components should be rendered and references to their JavaScript files
> - Any props passed from a Server Component to a Client Component

#### On the Client (First Load)

Then, on the client:

1. HTML is used to immediately show a fast non-interactive preview of the route to the user
2. RSC Payload is used to reconcile the Client and Server Component trees
3. JavaScript is used to hydrate Client Components and make the application interactive

> **What is hydration?**
>
> Hydration is React's process for attaching event handlers to the DOM, to make the static HTML interactive.

#### Subsequent Navigations

On subsequent navigations:

- The RSC Payload is prefetched and cached for instant navigation
- Client Components are rendered entirely on the client, without the server-rendered HTML

### Examples

#### Using Client Components

You can create a Client Component by adding the **`"use client"`** directive at the top of the file, above your imports.

```tsx
// app/ui/counter.tsx
'use client';

import { useState } from 'react';

export default function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>{count} likes</p>
      <button onClick={() => setCount(count + 1)}>Click me</button>
    </div>
  );
}
```

**`"use client"`** is used to declare a boundary between the Server and Client module graphs (trees).

Once a file is marked with **`"use client"`**, all its imports and child components are considered part of the client bundle. This means you don't need to add the directive to every component that is intended for the client.

#### Reducing TSX Bundle Size

To reduce the size of your client TypeScript bundles, add **`'use client'`** to specific interactive components instead of marking large parts of your UI as Client Components.

For example, the **`<Layout>`** component contains mostly static elements like a logo and navigation links, but includes an interactive search bar. **`<Search />`** is interactive and needs to be a Client Component, however, the rest of the layout can remain a Server Component.

```tsx
// app/layout.tsx
// Client Component
import Search from './search';
// Server Component
import Logo from './logo';

// Layout is a Server Component by default
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <nav>
        <Logo />
        <Search />
      </nav>
      <main>{children}</main>
    </>
  );
}
```

```tsx
// app/ui/search.tsx
'use client';

export default function Search() {
  // ...
}
```

#### Passing Data from Server to Client Components

You can pass data from Server Components to Client Components using props.

```tsx
// app/[id]/page.tsx
import LikeButton from '@/app/ui/like-button';
import { getPost } from '@/lib/data';

export default async function Page({ params }: { params: { id: string } }) {
  const post = await getPost(params.id);

  return <LikeButton likes={post.likes} />;
}
```

```tsx
// app/ui/like-button.tsx
'use client';

export default function LikeButton({ likes }: { likes: number }) {
  // ...
}
```

Alternatively, you can stream data from a Server Component to a Client Component with the **`use`** Hook.

> **Good to know:** Props passed to Client Components need to be serializable by React.

#### Interleaving Server and Client Components

You can pass Server Components as a prop to a Client Component. This allows you to visually nest server-rendered UI within Client components.

A common pattern is to use **`children`** to create a slot in a **`<ClientComponent>`**. For example, a **`<Cart>`** component that fetches data on the server, inside a **`<Modal>`** component that uses client state to toggle visibility.

```tsx
// app/ui/modal.tsx
'use client';

export default function Modal({ children }: { children: React.ReactNode }) {
  return <div>{children}</div>;
}
```

Then, in a parent Server Component (e.g.**`<Page>`**), you can pass a **`<Cart>`** as the child of the **`<Modal>`**:

```tsx
// app/page.tsx
import Modal from './ui/modal';
import Cart from './ui/cart';

export default function Page() {
  return (
    <Modal>
      <Cart />
    </Modal>
  );
}
```

In this pattern, all Server Components will be rendered on the server ahead of time, including those as props. The resulting RSC payload will contain references of where Client Components should be rendered within the component tree.

#### Context Providers

React context is commonly used to share global state like the current theme. However, React context is not supported in Server Components.

To use context, create a Client Component that accepts children:

```tsx
// app/theme-provider.tsx
'use client';

import { createContext } from 'react';

export const ThemeContext = createContext({});

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  return <ThemeContext.Provider value='dark'>{children}</ThemeContext.Provider>;
}
```

Then, import it into a Server Component (e.g. layout):

```tsx
// app/layout.tsx
import ThemeProvider from './theme-provider';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
```

Your Server Component will now be able to directly render your provider, and all other Client Components throughout your app will be able to consume this context.

> **Good to know:** You should render providers as deep as possible in the tree – notice how **`ThemeProvider`** only wraps **`{children}`** instead of the entire **`<html>`** document. This makes it easier for Next.js to optimize the static parts of your Server Components.

#### Third-party Components

When using a third-party component that relies on client-only features, you can wrap it in a Client Component to ensure it works as expected.

For example, the **`<Carousel />`** can be imported from the **`acme-carousel`** package. This component uses **`useState`**, but it doesn't yet have the **`"use client"`** directive.

If you use **`<Carousel />`** within a Client Component, it will work as expected:

```tsx
// app/gallery.tsx
'use client';

import { useState } from 'react';
import { Carousel } from 'acme-carousel';

export default function Gallery() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <button onClick={() => setIsOpen(true)}>View pictures</button>
      {/* Works, since Carousel is used within a Client Component */}
      {isOpen && <Carousel />}
    </div>
  );
}
```

However, if you try to use it directly within a Server Component, you'll see an error. This is because Next.js doesn't know **`<Carousel />`** is using client-only features.

To fix this, you can wrap third-party components that rely on client-only features in your own Client Components:

```tsx
// app/carousel.tsx
'use client';

import { Carousel } from 'acme-carousel';

export default Carousel;
```

Now, you can use **`<Carousel />`** directly within a Server Component:

```tsx
// app/page.tsx
import Carousel from './carousel';

export default function Page() {
  return (
    <div>
      <p>View pictures</p>
      {/*  Works, since Carousel is a Client Component */}
      <Carousel />
    </div>
  );
}
```

> **Advice for Library Authors**
>
> If you're building a component library, add the **`"use client"`** directive to entry points that rely on client-only features. This lets your users import components into Server Components without needing to create wrappers.
>
> It's worth noting some bundlers might strip out **`"use client"`** directives. You can find an example of how to configure esbuild to include the **`"use client"`** directive in the React Wrap Balancer and Vercel Analytics repositories.

#### Preventing Environment Poisoning

JavaScript modules can be shared between both Server and Client Components modules. This means it's possible to accidentally import server-only code into the client. For example, consider the following function:

```tsx
// lib/data.ts
export async function getData() {
  const res = await fetch('https://external-service.com/data', {
    headers: {
      authorization: process.env.API_KEY,
    },
  });

  return res.json();
}
```

This function contains an **`API_KEY`** that should never be exposed to the client.

In Next.js, only environment variables prefixed with **`NEXT_PUBLIC_`** are included in the client bundle. If variables are not prefixed, Next.js replaces them with an empty string.

As a result, even though **`getData()`** can be imported and executed on the client, it won't work as expected.

To prevent accidental usage in Client Components, you can use the **`server-only`** package.

Then, import the package into a file that contains server-only code:

```tsx
// lib/data.ts
import 'server-only';

export async function getData() {
  const res = await fetch('https://external-service.com/data', {
    headers: {
      authorization: process.env.API_KEY,
    },
  });

  return res.json();
}
```

Now, if you try to import the module into a Client Component, there will be a build-time error.

The corresponding **`client-only`** package can be used to mark modules that contain client-only logic like code that accesses the **`window`** object.

In Next.js, installing **`server-only`** or **`client-only`** is optional. However, if your linting rules flag extraneous dependencies, you may install them to avoid issues.

```bash
# Terminal
pnpm add server-only
```

Next.js handles **`server-only`** and **`client-only`** imports internally to provide clearer error messages when a module is used in the wrong environment. The contents of these packages from NPM are not used by Next.js.

Next.js also provides its own type declarations for **`server-only`** and **`client-only`**, for TypeScript configurations where **`noUncheckedSideEffectImports`** is active.
