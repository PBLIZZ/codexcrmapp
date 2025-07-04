# Quick Start

A quick guide to getting started with Base UI.

## Install the library

Install Base UI using a package manager.

```bash
npm i @base-ui-components/react
```

All components are included in a single package. Base UI is tree-shakeable, so your app bundle will contain only the components that you actually use.

## Set up portals

Base UI uses portals for components that render popups, such as Dialog and Popover. To make portalled components always appear on top of the entire page, add the following style to your application layout root:

**layout.tsx**
```tsx
<body>
  <div className="root">
    {children}
  </div>
</body>
```

**styles.css**
```css
.root {
  isolation: isolate;
}
```

This style creates a separate stacking context for your application's `.root` element. This way, popups will always appear above the page contents, and any z-index property in your styles won't interfere with them.

## Assemble a component

This demo shows you how to import a Popover component, assemble its parts, and apply styles with Tailwind CSS.

**index.tsx**
```tsx
import * as React from 'react';
import { Popover } from '@base-ui-components/react/popover';

export default function ExamplePopover() {
  return (
    <Popover.Root>
      <Popover.Trigger className="inline-flex items-center justify-center rounded-md p-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900">
        <BellIcon aria-label="Notifications" className="h-5 w-5" />
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Positioner sideOffset={8}>
          <Popover.Popup className="w-72 rounded-lg bg-white p-4 shadow-lg ring-1 ring-black/5 transition-all data-[starting-style]:opacity-0 data-[starting-style]:scale-95">
            <Popover.Arrow className="fill-white stroke-black/5 stroke-1">
              <ArrowSvg />
            </Popover.Arrow>
            <Popover.Title className="text-lg font-semibold text-gray-900">Notifications</Popover.Title>
            <Popover.Description className="mt-2 text-sm text-gray-600">
              You are all caught up. Good job!
            </Popover.Description>
          </Popover.Popup>
        </Popover.Positioner>
      </Popover.Portal>
    </Popover.Root>
  );
}

function ArrowSvg(props: React.ComponentProps<'svg'>) {
  return (
    <svg width="20" height="10" viewBox="0 0 20 10" fill="none" {...props}>
      <path
        d="M9.66437 2.60207L4.80758 6.97318C4.07308 7.63423 3.11989 8 2.13172 8H0V10H20V8H18.5349C17.5468 8 16.5936 7.63423 15.8591 6.97318L11.0023 2.60207C10.622 2.2598 10.0447 2.25979 9.66437 2.60207Z"
      />
      <path
        d="M8.99542 1.85876C9.75604 1.17425 10.9106 1.17422 11.6713 1.85878L16.5281 6.22989C17.0789 6.72568 17.7938 7.00001 18.5349 7.00001L15.89 7L11.0023 2.60207C10.622 2.2598 10.0447 2.2598 9.66436 2.60207L4.77734 7L2.13171 7.00001C2.87284 7.00001 3.58774 6.72568 4.13861 6.22989L8.99542 1.85876Z"
      />
      <path
        d="M10.3333 3.34539L5.47654 7.71648C4.55842 8.54279 3.36693 9 2.13172 9H0V8H2.13172C3.11989 8 4.07308 7.63423 4.80758 6.97318L9.66437 2.60207C10.0447 2.25979 10.622 2.2598 11.0023 2.60207L15.8591 6.97318C16.5936 7.63423 17.5468 8 18.5349 8H20V9H18.5349C17.2998 9 16.1083 8.54278 15.1901 7.71648L10.3333 3.34539Z"
      />
    </svg>
  );
}

function BellIcon(props: React.ComponentProps<'svg'>) {
  return (
    <svg fill="currentcolor" width="20" height="20" viewBox="0 0 16 16" {...props}>
      <path d="M 8 1 C 7.453125 1 7 1.453125 7 2 L 7 3.140625 C 5.28125 3.589844 4 5.144531 4 7 L 4 10.984375 C 4 10.984375 3.984375 11.261719 3.851563 11.519531 C 3.71875 11.78125 3.558594 12 3 12 L 3 13 L 13 13 L 13 12 C 12.40625 12 12.253906 11.78125 12.128906 11.53125 C 12.003906 11.277344 12 11.003906 12 11.003906 L 12 7 C 12 5.144531 10.71875 3.589844 9 3.140625 L 9 2 C 9 1.453125 8.546875 1 8 1 Z M 8 13 C 7.449219 13 7 13.449219 7 14 C 7 14.550781 7.449219 15 8 15 C 8.550781 15 9 14.550781 9 14 C 9 13.449219 8.550781 13 8 13 Z M 8 4 C 9.664063 4 11 5.335938 11 7 L 11 10.996094 C 11 10.996094 10.988281 11.472656 11.234375 11.96875 C 11.238281 11.980469 11.246094 11.988281 11.25 12 L 4.726563 12 C 4.730469 11.992188 4.738281 11.984375 4.742188 11.980469 C 4.992188 11.488281 5 11.015625 5 11.015625 L 5 7 C 5 5.335938 6.335938 4 8 4 Z" />
    </svg>
  );
}
```

## Next steps

This walkthrough outlines the basics of putting together a Base UI component. Browse the rest of the documentation to see what components are available in the library and how to use them.

# Accessibility

Learn how to make the most of Base UI's accessibility features and guidelines.

Accessibility is a top priority for Base UI. Base UI components handle many complex accessibility details including ARIA attributes, role attributes, pointer interactions, keyboard navigation, and focus management. The goal is to provide an accessible user experience out of the box, with intuitive APIs for configuration.

This page highlights some of the key accessibility features of Base UI, as well as some ways you will need to augment the library, in order to ensure that your application is accessible to everyone.

## Keyboard navigation

Base UI components adhere to the WAI-ARIA Authoring Practices to provide basic keyboard accessibility out of the box. This is critical for users who have difficulty using a pointer device, but it's also important for users who prefer navigating with a keyboard or other input mode.

Many components provide support for arrow keys, alphanumeric keys, Home, End, Enter, and Esc.

## Focus management

Base UI components manage focus automatically following a user interaction. Additionally, some components provide props like `initialFocus` and `finalFocus`, to configure focus management.

While Base UI components manage focus, it's the developer's responsibility to visually indicate focus. This is typically handled by styling the `:focus` or `:focus-visible` CSS pseudo-classes. WCAG provides guidelines on focus appearance.

## Color contrast

When styling elements, it's important to meet the minimum requirements for color contrast between each foreground element and its corresponding background element. Unless your application has strict requirements around compliance with current standards, consider adhering to APCA, which is slated to become the new standard in WCAG 3.

## Accessible labels

Base UI provides components like Form, Input, Field, Fieldset to automatically associate form controls. Additionally, you can use the native HTML `<label>` element to provide context to corresponding inputs.

Most applications will present custom controls that require accessible names provided by markup features such as `alt`, `aria-label` or `aria-labelledby`. WAI-ARIA provides guidelines on providing accessible names to custom controls.

## Testing

Base UI components are tested on a broad spectrum of browsers, devices, platforms, screen readers, and environments.

# Styling

A guide to styling Base UI components with Tailwind CSS.

Base UI components are unstyled and don't bundle CSS, making them perfectly compatible with Tailwind CSS. You retain total control of your styling layer.

## Style hooks

### CSS classes

Components that render an HTML element accept a `className` prop to style the element with Tailwind classes.

**switch.tsx**
```tsx
<Switch.Thumb className="h-5 w-5 rounded-full bg-white shadow-sm transition-transform" />
```

The prop can also be passed a function that takes the component's state as an argument.

**switch.tsx**
```tsx
<Switch.Thumb className={(state) => (
  state.checked ? "h-5 w-5 rounded-full bg-green-500" : "h-5 w-5 rounded-full bg-gray-200"
)} />
```

### Data attributes

Components provide data attributes designed for styling their states with Tailwind. For example, Switch can be styled using its `[data-checked]` and `[data-unchecked]` attributes, among others.

**switch example with Tailwind**
```tsx
<Switch.Thumb className="h-5 w-5 rounded-full bg-gray-200 shadow-sm transition-all data-[checked]:bg-green-500" />
```

### CSS variables

Components expose CSS variables to aid in styling, often containing dynamic numeric values to be used in sizing or transform calculations. For example, Popover exposes CSS variables on its `Popup` component like `--available-height` and `--anchor-width`.

**popover with Tailwind**
```tsx
<Popover.Popup className="max-h-[var(--available-height)] w-[var(--anchor-width)] rounded-md bg-white p-4 shadow-lg" />
```

Check out each component's API reference for a complete list of available data attributes and CSS variables.

## Tailwind CSS

Apply Tailwind classes to each part via the `className` prop.

**menu.tsx**
```tsx
import * as React from 'react';
import { Menu } from '@base-ui-components/react/menu';

export default function ExampleMenu() {
  return (
    <Menu.Root>
      <Menu.Trigger className="flex h-10 items-center justify-center gap-1.5 rounded-md border border-gray-200 bg-gray-50 px-3.5 text-base font-medium text-gray-900 select-none hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-1 focus-visible:outline-blue-800 active:bg-gray-100 data-[popup-open]:bg-gray-100">
        Song
      </Menu.Trigger>
      <Menu.Portal>
        <Menu.Positioner className="outline-none" sideOffset={8}>
          <Menu.Popup className="origin-[var(--transform-origin)] rounded-md bg-[canvas] py-1 text-gray-900 shadow-lg shadow-gray-200 outline outline-1 outline-gray-200 transition-[transform,scale,opacity] data-[ending-style]:scale-90 data-[ending-style]:opacity-0 data-[starting-style]:scale-90 data-[starting-style]:opacity-0 dark:shadow-none dark:-outline-offset-1 dark:outline-gray-300">
            <Menu.Item className="flex cursor-default py-2 pr-8 pl-4 text-sm leading-4 outline-none select-none data-[highlighted]:relative data-[highlighted]:z-0 data-[highlighted]:text-gray-50 data-[highlighted]:before:absolute data-[highlighted]:before:inset-x-1 data-[highlighted]:before:inset-y-0 data-[highlighted]:before:z-[-1] data-[highlighted]:before:rounded-sm data-[highlighted]:before:bg-gray-900">
              Add to Library
            </Menu.Item>
            <Menu.Item className="flex cursor-default py-2 pr-8 pl-4 text-sm leading-4 outline-none select-none data-[highlighted]:relative data-[highlighted]:z-0 data-[highlighted]:text-gray-50 data-[highlighted]:before:absolute data-[highlighted]:before:inset-x-1 data-[highlighted]:before:inset-y-0 data-[highlighted]:before:z-[-1] data-[highlighted]:before:rounded-sm data-[highlighted]:before:bg-gray-900">
              Add to Playlist
            </Menu.Item>
          </Menu.Popup>
        </Menu.Positioner>
      </Menu.Portal>
    </Menu.Root>
  );
}
```

# Animation

A guide to animating Base UI components with Tailwind CSS.

Base UI components can be animated using Tailwind's transition and animation utilities. Each component provides a number of data attributes to target its states, as well as a few attributes specifically for animation.

## CSS transitions with Tailwind

Use the following Base UI attributes for creating transitions when a component becomes visible or hidden:

- `[data-starting-style]` corresponds to the initial style to transition from.
- `[data-ending-style]` corresponds to the final style to transition to.

Transitions are recommended over CSS animations, because a transition can be smoothly cancelled midway. For example, if the user closes a popup before it finishes opening, with CSS transitions it will smoothly animate to its closed state without any abrupt changes.

**popover with Tailwind transitions**
```tsx
<Popover.Popup 
  className="
    box-border 
    p-4 
    bg-white 
    rounded-md 
    shadow-lg 
    origin-[var(--transform-origin)] 
    transition-all 
    duration-150 
    data-[starting-style]:opacity-0 
    data-[starting-style]:scale-90 
    data-[ending-style]:opacity-0 
    data-[ending-style]:scale-90
  "
>
  {/* Popup content */}
</Popover.Popup>
```

## CSS animations with Tailwind

Use the following Base UI attributes for creating CSS animations when a component becomes visible or hidden:

- `[data-open]` corresponds to the style applied when a component becomes visible.
- `[data-closed]` corresponds to the style applied before a component becomes hidden.

**Example with Tailwind animations**
```tsx
// In your global CSS or Tailwind config
// @keyframes scaleIn {
//   from { opacity: 0; transform: scale(0.9); }
//   to { opacity: 1; transform: scale(1); }
// }
// @keyframes scaleOut {
//   from { opacity: 1; transform: scale(1); }
//   to { opacity: 0; transform: scale(0.9); }
// }

<Popover.Popup 
  className="
    rounded-md 
    bg-white 
    p-4 
    shadow-lg
    data-[open]:animate-scaleIn
    data-[closed]:animate-scaleOut
  "
>
  {/* Popup content */}
</Popover.Popup>
```

## JavaScript animations

JavaScript animation libraries such as Motion require control of the mounting and unmounting lifecycle of components in order for exit animations to play.

Base UI relies on `element.getAnimations()` to detect if animations have finished on an element. When using Motion, the opacity property lets this detection work easily, so always animating opacity to a new value for exit animations will work. If it shouldn't be animated, you can use a value close to 1, such as opacity: 0.9999.

### Elements removed from the DOM when closed

Most components like Popover are unmounted from the DOM when they are closed. To animate them:

1. Make the component controlled with the `open` prop so AnimatePresence can see the state as a child
2. Specify `keepMounted` on the Portal part
3. Use the render prop to compose the Popup with motion.div

**animated-popover.tsx**
```tsx
function App() {
  const [open, setOpen] = React.useState(false);
  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger className="px-4 py-2 rounded-md bg-blue-500 text-white">
        Trigger
      </Popover.Trigger>
      <AnimatePresence>
        {open && (
          <Popover.Portal keepMounted>
            <Popover.Positioner>
              <Popover.Popup
                render={
                  <motion.div
                    className="bg-white p-4 rounded-md shadow-lg"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                  />
                }
              >
                Popup
              </Popover.Popup>
            </Popover.Positioner>
          </Popover.Portal>
        )}
      </AnimatePresence>
    </Popover.Root>
  );
}
```

### Elements kept in the DOM when closed

The Select component must be kept mounted in the DOM even when closed. In this case, a different approach is needed to animate it with Motion.

1. Make the component controlled with the `open` prop
2. Use the render prop to compose the Popup with motion.div
3. Animate the properties based on the open state, avoiding AnimatePresence

**animated-select.tsx**
```tsx
function App() {
  const [open, setOpen] = React.useState(false);
  return (
    <Select.Root open={open} onOpenChange={setOpen}>
      <Select.Trigger className="px-4 py-2 border rounded-md">
        <Select.Value />
      </Select.Trigger>
      <Select.Portal>
        <Select.Positioner>
          <Select.Popup
            render={
              <motion.div
                className="bg-white p-2 rounded-md shadow-lg"
                initial={false}
                animate={{
                  opacity: open ? 1 : 0,
                  scale: open ? 1 : 0.8,
                }}
              />
            }
          >
            Popup
          </Select.Popup>
        </Select.Positioner>
      </Select.Portal>
    </Select.Root>
  );
}
```

### Manual unmounting

For full control, you can manually unmount the component when it's closed once animations have finished using an actionsRef passed to the Root:

**manual-unmount.tsx**
```tsx
function App() {
  const [open, setOpen] = React.useState(false);
  const actionsRef = React.useRef({ unmount: () => {} });
  return (
    <Popover.Root open={open} onOpenChange={setOpen} actionsRef={actionsRef}>
      <Popover.Trigger className="px-4 py-2 rounded-md bg-blue-500 text-white">
        Trigger
      </Popover.Trigger>
      <AnimatePresence>
        {open && (
          <Popover.Portal keepMounted>
            <Popover.Positioner>
              <Popover.Popup
                render={
                  <motion.div
                    className="bg-white p-4 rounded-md shadow-lg"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    onAnimationComplete={() => {
                      if (!open) {
                        actionsRef.current.unmount();
                      }
                    }}
                  />
                }
              >
                Popup
              </Popover.Popup>
            </Popover.Positioner>
          </Popover.Portal>
        )}
      </AnimatePresence>
    </Popover.Root>
  );
}
```

# Composition

A guide to composing Base UI components with your own React components.

## Composing custom React components

Use the `render` prop to compose a Base UI part with your own React components.

For example, most triggers render a `<button>` by default. The code snippet below shows how to use a custom button instead.

**index.tsx**
```tsx
<Menu.Trigger render={<MyButton className="px-4 py-2 bg-blue-500 text-white rounded-md" />}>
  Open menu
</Menu.Trigger>
```

The custom component must forward the `ref`, and spread all the received props on its underlying DOM node.

## Composing multiple components

In situations where you need to compose multiple Base UI components with custom React components, `render` props can be nested as deeply as necessary. Working with Tooltip is a common example.

**index.tsx**
```tsx
<Dialog.Root>
  <Tooltip.Root>
    <Tooltip.Trigger
      render={
        <Dialog.Trigger
          render={
            <Menu.Trigger render={<MyButton className="px-4 py-2 bg-blue-500 text-white rounded-md" />}>
              Open menu
            </Menu.Trigger>
          }
        />
      }
    />
    <Tooltip.Portal>
      <Tooltip.Positioner>
        <Tooltip.Popup className="bg-gray-800 text-white p-2 rounded shadow-lg">
          Tooltip content
        </Tooltip.Popup>
      </Tooltip.Positioner>
    </Tooltip.Portal>
  </Tooltip.Root>
  <Dialog.Portal>
    <Dialog.Backdrop className="fixed inset-0 bg-black/30" />
    <Dialog.Positioner className="fixed inset-0 flex items-center justify-center">
      <Dialog.Content className="bg-white p-6 rounded-lg shadow-xl max-w-md">
        Dialog content
      </Dialog.Content>
    </Dialog.Positioner>
  </Dialog.Portal>
</Dialog.Root>
```

## Changing the default rendered element

You can also use the `render` prop to override the rendered element of the component.

For example, `Menu.Item` renders a `<div>` by default. The code snippet below shows how to render it as an `<a>` element so that it works like a link.

**index.tsx**
```tsx
import * as React from 'react';
import { Menu } from '@base-ui-components/react/menu';

export default () => (
  <Menu.Root>
    <Menu.Trigger className="px-4 py-2 bg-blue-500 text-white rounded-md">
      Song
    </Menu.Trigger>
    <Menu.Portal>
      <Menu.Positioner>
        <Menu.Popup className="bg-white rounded-md shadow-lg p-2">
          <Menu.Item 
            render={<a href="base-ui.com" className="block px-4 py-2 hover:bg-gray-100 rounded" />}
          >
            Add to Library
          </Menu.Item>
        </Menu.Popup>
      </Menu.Positioner>
    </Menu.Portal>
  </Menu.Root>
);
```

Each Base UI component renders the most appropriate element by default, and in most cases, rendering a different element is recommended only on a case-by-case basis.

## Render function

If you are working in an extremely performance-sensitive application, you might want to pass a function to the `render` prop instead of a React element.

**switch.tsx**
```tsx
<Switch.Thumb
  render={(props, state) => 
    <span 
      {...props}
      className={`block h-5 w-5 rounded-full transform transition-transform ${
        state.checked ? 'bg-green-500 translate-x-5' : 'bg-gray-200'
      }`}
    >
      {state.checked ? 
        <CheckIcon className="h-3 w-3 text-white mx-auto mt-1" /> : 
        <XIcon className="h-3 w-3 text-gray-600 mx-auto mt-1" />
      }
    </span>
  }
/>
```

Using a function gives you complete control over spreading props and also allows you to render different content based on the component's state.

# Utilities

## useRender

Hook for enabling a render prop in custom components.

The `useRender` hook lets you build custom components that provide a render prop to override the default rendered element.

### API Reference

#### Input Parameters

| Prop | Type | Default |
| ---- | ---- | ------- |
| render | RenderProp<State> | undefined |
| props | Record<string, unknown> | undefined |
| ref | React.Ref<RenderedElementType> \| React.Ref<RenderedElementType>[] | undefined |
| state | State | undefined |

#### Return Value

| Prop | Type |
| ---- | ---- |
| element | React.ReactElement |

### Usage

```tsx
const element = useRender({
  // Input parameters
});
```

### Examples

A render prop for a custom Text component lets consumers use it to replace the default rendered p element with a different tag or component.

```tsx
'use client';
import * as React from 'react';
import { useRender } from '@base-ui-components/react/use-render';
import { mergeProps } from '@base-ui-components/react/merge-props';

interface TextProps extends useRender.ComponentProps<'p'> {}

function Text(props: TextProps) {
  const { render = <p />, ...otherProps } = props;

  const element = useRender({
    render,
    props: mergeProps<'p'>({ className: "text-gray-900 leading-normal" }, otherProps),
  });

  return element;
}

export default function ExampleText() {
  return (
    <div>
      <Text>Text component rendered as a paragraph tag</Text>
      <Text render={<strong className="font-bold" />}>Text component rendered as a strong tag</Text>
    </div>
  );
}
```

The callback version of the render prop enables more control of how props are spread, and also passes the internal state of a component.

```tsx
'use client';
import * as React from 'react';
import { useRender } from '@base-ui-components/react/use-render';
import { mergeProps } from '@base-ui-components/react/merge-props';

interface CounterState {
  odd: boolean;
}

interface CounterProps extends useRender.ComponentProps<'button', CounterState> {}

function Counter(props: CounterProps) {
  const { render = <button />, ...otherProps } = props;

  const [count, setCount] = React.useState(0);
  const odd = count % 2 === 1;
  const state = React.useMemo(() => ({ odd }), [odd]);

  const defaultProps: useRender.ElementProps<'button'> = {
    className: "px-4 py-2 bg-blue-500 text-white rounded-md",
    type: 'button',
    children: (
      <React.Fragment>
        Counter: <span>{count}</span>
      </React.Fragment>
    ),
    onClick() {
      setCount((prev) => prev + 1);
    },
    'aria-label': `Count is ${count}, click to increase.`,
  };

  const element = useRender({
    render,
    state,
    props: mergeProps<'button'>(defaultProps, otherProps),
  });

  return element;
}

export default function ExampleCounter() {
  return (
    <Counter
      render={(props, state) => (
        <button {...props} className="px-4 py-2 bg-blue-500 text-white rounded-md">
          {props.children}
          <span className="ml-2">{state.odd ? '👎' : '👍'}</span>
        </button>
      )}
    />
  );
}
```

### Merging props

The `mergeProps` function merges two or more sets of React props together. It safely merges three types of props:

- Event handlers, so that all are invoked
- className strings
- style properties

`mergeProps` merges objects from left to right, so that subsequent objects' properties in the arguments overwrite previous ones. Merging props is useful when creating custom components, as well as inside the callback version of the render prop for any Base UI component.

#### Using mergeProps in the render callback

```tsx
import { mergeProps } from '@base-ui-components/react/merge-props';

function Button() {
  return (
    <Component
      render={(props, state) => (
        <button
          {...mergeProps<'button'>(props, {
            className: "px-4 py-2 bg-blue-500 text-white rounded-md",
          })}
        />
      )}
    />
  );
}
```

### Merging refs

When building custom components, you often need to control a ref internally while still letting external consumers pass their own—merging refs lets both parties have access to the underlying DOM element. The ref option in useRender enables this, which holds an array of refs to be merged together.

In React 19, `React.forwardRef()` is not needed when building primitive components, as the external ref prop is already contained inside props. Your internal ref can be passed to ref to be merged with props.ref:

#### React 19

```tsx
function Text({ render = <p />, ...props }: TextProps) {
  const internalRef = React.useRef<HTMLElement | null>(null);
  const element = useRender({
    ref: internalRef,
    props,
    render,
  });
  return element;
}
```

### TypeScript

To type props, there are two interfaces:

- `useRender.ComponentProps` for a component's external (public) props. It types the render prop and HTML attributes.
- `useRender.ElementProps` for the element's internal (private) props. It types HTML attributes alone.

#### Typing Props

```tsx
interface ButtonProps extends useRender.ComponentProps<'button'> {}

function Button({ render = <button />, ...props }: ButtonProps) {
  const defaultProps: useRender.ElementProps<'button'> = {
    className: "px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600",
    type: 'button',
    children: 'Click me',
  };
  const element = useRender({
    render,
    props: mergeProps<'button'>(defaultProps, props),
  });
  return element;
}
```

### Migrating from Radix UI

Radix UI uses an `asChild` prop, while Base UI uses a `render` prop. Learn more about how composition works in Base UI in the composition guide.

In Radix UI, the Slot component lets you implement an asChild prop.

#### Radix UI Slot Component

```tsx
import { Slot } from 'radix-ui';

function Button({ asChild, ...props }) {
  const Comp = asChild ? Slot.Root : 'button';
  return <Comp {...props} />;
}

// Usage
<Button asChild>
  <a href="/contact">Contact</a>
</Button>
```

In Base UI, useRender lets you implement a render prop. The example below is the equivalent implementation to the Radix example above.

#### Base UI Render Prop

```tsx
import { useRender } from '@base-ui-components/react/use-render';

function Button({ render = <button />, ...props }) {
  return useRender({ render, props });
}

// Usage
<Button render={<a href="/contact">Contact</a>} />
```

# Appendix: Base UI vs. Radix UI

Base UI is a newer alternative to Radix UI, created by a collaboration of developers from Radix, Material UI, and Floating UI. This section provides context on how Base UI compares to Radix UI for those considering migration or choosing between the two libraries.

## Origins and Development

Base UI is an open-source React component library created by a team including developers from Radix, Material UI, and Floating UI. It was designed with a focus on accessibility, performance, and developer experience, similar to Radix UI but with some key differences in approach.

## Key Differences

### Import Pattern
Base UI uses a subdirectory import pattern rather than the per-component packaging pattern used by Radix:

```tsx
// Base UI
import { Switch } from "@base-ui-components/react/switch";
// Or import multiple components
import { Switch, Toggle } from "@base-ui-components/react";

// Radix UI
import * as Switch from '@radix-ui/react-switch';
```

### Component Composition
Base UI uses the `render` prop for component composition, while Radix UI uses the `asChild` prop:

```tsx
// Base UI
<Menu.Trigger render={<Button>Open Menu</Button>} />

// Radix UI
<Menu.Trigger asChild>
  <Button>Open Menu</Button>
</Menu.Trigger>
```

### API Consistency
Base UI focuses on providing a more consistent API across components, making the developer experience more predictable. The library is designed to be tree-shakeable, meaning you only include the components you actually use in your bundle.

## Considerations for Migration

When considering migrating from Radix UI to Base UI:

1. **Component coverage**: Check if Base UI provides all the components you currently use in Radix UI.
2. **API differences**: Be aware of the different approaches to component composition and styling.
3. **Gradual adoption**: Both libraries support incremental adoption, so you can migrate component by component.

If you're using shadcn/ui (which is built on Radix UI), you can still consider adopting Base UI for new components while maintaining your existing shadcn components. This approach allows you to gradually transition while keeping your UI consistent.

## Source Information

The information in this appendix is based on the official Base UI documentation and developer blogs comparing the two libraries as of July 2025. For the most up-to-date information, visit the official [Base UI website](https://base-ui.com) and [Radix UI website](https://www.radix-ui.com).