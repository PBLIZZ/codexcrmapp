## Theming

Using CSS Variables and color utilities for theming.

You can choose between using CSS variables (recommended) or utility classes for theming.

### CSS Variables

<div className="bg-background text-foreground" />
To use CSS variables for theming set tailwind.css
Variables to true in your components.json file.

components.json
{
"style": "default",
"rsc": true,
"tailwind": {
"config": "",
"css": "app/globals.css",
"baseColor": "neutral",
"cssVariables": true
},
"aliases": {
"components": "@/components",
"utils": "@/lib/utils",
"ui": "@/components/ui",
"lib": "@/lib",
"hooks": "@/hooks"
},
"iconLibrary": "lucide"
}

### Utility classes

<div className="bg-zinc-950 dark:bg-white" />
To use utility classes for theming set tailwind.cssVariables to false in your components.json file.

components.json

{
"style": "default",
"rsc": true,
"tailwind": {
"config": "",
"css": "app/globals.css",
"baseColor": "neutral",
"cssVariables": false
},
"aliases": {
"components": "@/components",
"utils": "@/lib/utils",
"ui": "@/components/ui",
"lib": "@/lib",
"hooks": "@/hooks"
},
"iconLibrary": "lucide"
}
Convention
We use a simple background and foreground convention for colors. The background variable is used for the background color of the component and the foreground variable is used for the text color.

The background suffix is omitted when the variable is used for the background color of the component.

Given the following CSS variables:

--primary: oklch(0.205 0 0);
--primary-foreground: oklch(0.985 0 0);
The background color of the following component will be var(--primary) and the foreground color will be var(--primary-foreground).

<div className="bg-primary text-primary-foreground">Hello</div>

### List of variables

Here's the list of variables available for customization:

app/globals.css

:root {
--radius: 0.625rem;
--background: oklch(1 0 0);
--foreground: oklch(0.145 0 0);
--card: oklch(1 0 0);
--card-foreground: oklch(0.145 0 0);
--popover: oklch(1 0 0);
--popover-foreground: oklch(0.145 0 0);
--primary: oklch(0.205 0 0);
--primary-foreground: oklch(0.985 0 0);
--secondary: oklch(0.97 0 0);
--secondary-foreground: oklch(0.205 0 0);
--muted: oklch(0.97 0 0);
--muted-foreground: oklch(0.556 0 0);
--accent: oklch(0.97 0 0);
--accent-foreground: oklch(0.205 0 0);
--destructive: oklch(0.577 0.245 27.325);
--border: oklch(0.922 0 0);
--input: oklch(0.922 0 0);
--ring: oklch(0.708 0 0);
--chart-1: oklch(0.646 0.222 41.116);
--chart-2: oklch(0.6 0.118 184.704);
--chart-3: oklch(0.398 0.07 227.392);
--chart-4: oklch(0.828 0.189 84.429);
--chart-5: oklch(0.769 0.188 70.08);
--sidebar: oklch(0.985 0 0);
--sidebar-foreground: oklch(0.145 0 0);
--sidebar-primary: oklch(0.205 0 0);
--sidebar-primary-foreground: oklch(0.985 0 0);
--sidebar-accent: oklch(0.97 0 0);
--sidebar-accent-foreground: oklch(0.205 0 0);
--sidebar-border: oklch(0.922 0 0);
--sidebar-ring: oklch(0.708 0 0);
}

.dark {
--background: oklch(0.145 0 0);
--foreground: oklch(0.985 0 0);
--card: oklch(0.205 0 0);
--card-foreground: oklch(0.985 0 0);
--popover: oklch(0.269 0 0);
--popover-foreground: oklch(0.985 0 0);
--primary: oklch(0.922 0 0);
--primary-foreground: oklch(0.205 0 0);
--secondary: oklch(0.269 0 0);
--secondary-foreground: oklch(0.985 0 0);
--muted: oklch(0.269 0 0);
--muted-foreground: oklch(0.708 0 0);
--accent: oklch(0.371 0 0);
--accent-foreground: oklch(0.985 0 0);
--destructive: oklch(0.704 0.191 22.216);
--border: oklch(1 0 0 / 10%);
--input: oklch(1 0 0 / 15%);
--ring: oklch(0.556 0 0);
--chart-1: oklch(0.488 0.243 264.376);
--chart-2: oklch(0.696 0.17 162.48);
--chart-3: oklch(0.769 0.188 70.08);
--chart-4: oklch(0.627 0.265 303.9);
--chart-5: oklch(0.645 0.246 16.439);
--sidebar: oklch(0.205 0 0);
--sidebar-foreground: oklch(0.985 0 0);
--sidebar-primary: oklch(0.488 0.243 264.376);
--sidebar-primary-foreground: oklch(0.985 0 0);
--sidebar-accent: oklch(0.269 0 0);
--sidebar-accent-foreground: oklch(0.985 0 0);
--sidebar-border: oklch(1 0 0 / 10%);
--sidebar-ring: oklch(0.439 0 0);
}
Adding new colors
To add new colors, you need to add them to your CSS file and to your tailwind.config.js file.

app/globals.css
Copy
:root {
--warning: oklch(0.84 0.16 84);
--warning-foreground: oklch(0.28 0.07 46);
}

.dark {
--warning: oklch(0.41 0.11 46);
--warning-foreground: oklch(0.99 0.02 95);
}

@theme inline {
--color-warning: var(--warning);
--color-warning-foreground: var(--warning-foreground);
}
You can now use the warning utility class in your components.

<div className="bg-warning text-warning-foreground" />

## Other color formats

### Colors

Using and customizing the color palette in Tailwind CSS projects.

Tailwind CSS includes a vast, beautiful color palette out of the box, carefully crafted by expert designers and suitable for a wide range of different design styles.

<div>
  <div class="bg-sky-50"></div>
  <div class="bg-sky-100"></div>
  <div class="bg-sky-200"></div>
  <div class="bg-sky-300"></div>
  <div class="bg-sky-400"></div>
  <div class="bg-sky-500"></div>
  <div class="bg-sky-600"></div>
  <div class="bg-sky-700"></div>
  <div class="bg-sky-800"></div>
  <div class="bg-sky-900"></div>
  <div class="bg-sky-950"></div>
</div>
The entire color palette is available across all color related utilities, including things like background color, border color, fill, caret color, and many more.

Working with colors
Using color utilities
Use color utilities like bg-white, border-pink-300, and text-gray-950 to set the different color properties of elements in your design:

Tom Watson mentioned you in Logo redesign

9:37am

<div class="flex items-center gap-4 rounded-lg bg-white p-6 shadow-md outline outline-black/5 dark:bg-gray-800">
  <span class="inline-flex shrink-0 rounded-full border border-pink-300 bg-pink-100 p-2 dark:border-pink-300/10 dark:bg-pink-400/10">
    <svg class="size-6 stroke-pink-700 dark:stroke-pink-500"><!-- ... --></svg>
  </span>
  <div>
    <p class="text-gray-700 dark:text-gray-400">
      <span class="font-medium text-gray-950 dark:text-white">Tom Watson</span> mentioned you in
      <span class="font-medium text-gray-950 dark:text-white">Logo redesign</span>
    </p>
    <time class="mt-1 block text-gray-500" datetime="9:37">9:37am</time>
  </div>
</div>
Here's a full list of utilities that use your color palette:

### Utility Description

bg-_ Sets the background color of an element
text-_ Sets the text color of an element
decoration-_ Sets the text decoration color of an element
border-_ Sets the border color of an element
outline-_ Sets the outline color of an element
shadow-_ Sets the color of box shadows
inset-shadow-_ Sets the color of inset box shadows
ring-_ Sets the color of ring shadows
inset-ring-_ Sets the color of inset ring shadows
accent-_ Sets the accent color of form controls
caret-_ Sets the caret color in form controls
fill-_ Sets the fill color of SVG elements
stroke-\* Sets the stroke color of SVG elements
Adjusting opacity
You can adjust the opacity of a color using syntax like bg-black/75, where 75 sets the alpha channel of the color to 75%:

<div>
  <div class="bg-sky-500/10"></div>
  <div class="bg-sky-500/20"></div>
  <div class="bg-sky-500/30"></div>
  <div class="bg-sky-500/40"></div>
  <div class="bg-sky-500/50"></div>
  <div class="bg-sky-500/60"></div>
  <div class="bg-sky-500/70"></div>
  <div class="bg-sky-500/80"></div>
  <div class="bg-sky-500/90"></div>
  <div class="bg-sky-500/100"></div>
</div>
This syntax also supports arbitrary values and the CSS variable shorthand:

HTML

<div class="bg-pink-500/[71.37%]"><!-- ... --></div>
<div class="bg-cyan-400/(--my-alpha-value)"><!-- ... --></div>

### Targeting dark mode

Use the dark variant to write classes like dark:bg-gray-800 that only apply a color when dark mode is active:

<div class="bg-white dark:bg-gray-800 rounded-lg px-6 py-8 ring shadow-xl ring-gray-900/5">
  <div>
    <span class="inline-flex items-center justify-center rounded-md bg-indigo-500 p-2 shadow-lg">
      <svg class="h-6 w-6 stroke-white" ...>
        <!-- ... -->
      </svg>
    </span>
  </div>
  <h3 class="text-gray-900 dark:text-white mt-5 text-base font-medium tracking-tight ">Writes upside-down</h3>
  <p class="text-gray-500 dark:text-gray-400 mt-2 text-sm ">
    The Zero Gravity Pen can be used to write in any orientation, including upside-down. It even works in outer space.
  </p>
</div>
Learn more about styling for dark mode in the dark mode documentation.

Referencing in CSS
Colors are exposed as CSS variables in the --color-\* namespace, so you can reference them in CSS with variables like --color-blue-500 and --color-pink-700:

CSS
@import "tailwindcss";
@layer components {
.typography {
color: var(--color-gray-950);
a {
color: var(--color-blue-500);
&:hover {
color: var(--color-blue-800);
}
}
}
}
You can also use these as arbitrary values in utility classes:

HTML

<div class="bg-[light-dark(var(--color-white),var(--color-gray-950))]">
  <!-- ... -->
</div>
To quickly adjust the opacity of a color when referencing it as a variable in CSS, Tailwind includes a special --alpha() function:

CSS
@import "tailwindcss";
@layer components {
.DocSearch-Hit--Result {
background-color: --alpha(var(--color-gray-950) / 10%);
}
}
Customizing your colors
Use @theme to add custom colors to your project under the --color-\* theme namespace:

CSS
@import "tailwindcss";
@theme {
--color-midnight: #121063;
--color-tahiti: #3ab7bf;
--color-bermuda: #78dcca;
}
Now utilities like bg-midnight, text-tahiti, and fill-bermuda will be available in your project in addition to the default colors.

Learn more about theme variables in the theme variables documentation.

Overriding default colors
Override any of the default colors by defining new theme variables with the same name:

CSS
@import "tailwindcss";
@theme {
--color-gray-50: oklch(0.984 0.003 247.858);
--color-gray-100: oklch(0.968 0.007 247.896);
--color-gray-200: oklch(0.929 0.013 255.508);
--color-gray-300: oklch(0.869 0.022 252.894);
--color-gray-400: oklch(0.704 0.04 256.788);
--color-gray-500: oklch(0.554 0.046 257.417);
--color-gray-600: oklch(0.446 0.043 257.281);
--color-gray-700: oklch(0.372 0.044 257.287);
--color-gray-800: oklch(0.279 0.041 260.031);
--color-gray-900: oklch(0.208 0.042 265.755);
--color-gray-950: oklch(0.129 0.042 264.695);
}
Disabling default colors
Disable any default color by setting the theme namespace for that color to initial:

CSS
@import "tailwindcss";
@theme {
--color-lime-_: initial;
--color-fuchsia-_: initial;
}
This is especially useful for removing the corresponding CSS variables from your output for colors you don't intend to use.

Using a custom palette
Use --color-\*: initial to completely disable all of the default colors and define your own custom color palette:

CSS
@import "tailwindcss";
@theme {
--color-\*: initial;
--color-white: #fff;
--color-purple: #3f3cbb;
--color-midnight: #121063;
--color-tahiti: #3ab7bf;
--color-bermuda: #78dcca;
}
Referencing other variables
Use @theme inline when defining colors that reference other colors:

CSS
@import "tailwindcss";
:root {
--acme-canvas-color: oklch(0.967 0.003 264.542);
}
[data-theme="dark"] {
--acme-canvas-color: oklch(0.21 0.034 264.665);
}
@theme inline {
--color-canvas: var(--acme-canvas-color);
}
Learn more in the theme documentation on referencing other variables.

### Default color palette reference

Here's a complete list of the default colors and their values for reference:

CSS
@theme {
--color-red-50: oklch(0.971 0.013 17.38);
--color-red-100: oklch(0.936 0.032 17.717);
--color-red-200: oklch(0.885 0.062 18.334);
--color-red-300: oklch(0.808 0.114 19.571);
--color-red-400: oklch(0.704 0.191 22.216);
--color-red-500: oklch(0.637 0.237 25.331);
--color-red-600: oklch(0.577 0.245 27.325);
--color-red-700: oklch(0.505 0.213 27.518);
--color-red-800: oklch(0.444 0.177 26.899);
--color-red-900: oklch(0.396 0.141 25.723);
--color-red-950: oklch(0.258 0.092 26.042);
--color-orange-50: oklch(0.98 0.016 73.684);
--color-orange-100: oklch(0.954 0.038 75.164);
--color-orange-200: oklch(0.901 0.076 70.697);
--color-orange-300: oklch(0.837 0.128 66.29);
--color-orange-400: oklch(0.75 0.183 55.934);
--color-orange-500: oklch(0.705 0.213 47.604);
--color-orange-600: oklch(0.646 0.222 41.116);
--color-orange-700: oklch(0.553 0.195 38.402);
--color-orange-800: oklch(0.47 0.157 37.304);
--color-orange-900: oklch(0.408 0.123 38.172);
--color-orange-950: oklch(0.266 0.079 36.259);
--color-amber-50: oklch(0.987 0.022 95.277);
--color-amber-100: oklch(0.962 0.059 95.617);
--color-amber-200: oklch(0.924 0.12 95.746);
--color-amber-300: oklch(0.879 0.169 91.605);
--color-amber-400: oklch(0.828 0.189 84.429);
--color-amber-500: oklch(0.769 0.188 70.08);
--color-amber-600: oklch(0.666 0.179 58.318);
--color-amber-700: oklch(0.555 0.163 48.998);
--color-amber-800: oklch(0.473 0.137 46.201);
--color-amber-900: oklch(0.414 0.112 45.904);
--color-amber-950: oklch(0.279 0.077 45.635);
--color-yellow-50: oklch(0.987 0.026 102.212);
--color-yellow-100: oklch(0.973 0.071 103.193);
--color-yellow-200: oklch(0.945 0.129 101.54);
--color-yellow-300: oklch(0.905 0.182 98.111);
--color-yellow-400: oklch(0.852 0.199 91.936);
--color-yellow-500: oklch(0.795 0.184 86.047);
--color-yellow-600: oklch(0.681 0.162 75.834);
--color-yellow-700: oklch(0.554 0.135 66.442);
--color-yellow-800: oklch(0.476 0.114 61.907);
--color-yellow-900: oklch(0.421 0.095 57.708);
--color-yellow-950: oklch(0.286 0.066 53.813);
--color-lime-50: oklch(0.986 0.031 120.757);
--color-lime-100: oklch(0.967 0.067 122.328);
--color-lime-200: oklch(0.938 0.127 124.321);
--color-lime-300: oklch(0.897 0.196 126.665);
--color-lime-400: oklch(0.841 0.238 128.85);
--color-lime-500: oklch(0.768 0.233 130.85);
--color-lime-600: oklch(0.648 0.2 131.684);
--color-lime-700: oklch(0.532 0.157 131.589);
--color-lime-800: oklch(0.453 0.124 130.933);
--color-lime-900: oklch(0.405 0.101 131.063);
--color-lime-950: oklch(0.274 0.072 132.109);
--color-green-50: oklch(0.982 0.018 155.826);
--color-green-100: oklch(0.962 0.044 156.743);
--color-green-200: oklch(0.925 0.084 155.995);
--color-green-300: oklch(0.871 0.15 154.449);
--color-green-400: oklch(0.792 0.209 151.711);
--color-green-500: oklch(0.723 0.219 149.579);
--color-green-600: oklch(0.627 0.194 149.214);
--color-green-700: oklch(0.527 0.154 150.069);
--color-green-800: oklch(0.448 0.119 151.328);
--color-green-900: oklch(0.393 0.095 152.535);
--color-green-950: oklch(0.266 0.065 152.934);
--color-emerald-50: oklch(0.979 0.021 166.113);
--color-emerald-100: oklch(0.95 0.052 163.051);
--color-emerald-200: oklch(0.905 0.093 164.15);
--color-emerald-300: oklch(0.845 0.143 164.978);
--color-emerald-400: oklch(0.765 0.177 163.223);
--color-emerald-500: oklch(0.696 0.17 162.48);
--color-emerald-600: oklch(0.596 0.145 163.225);
--color-emerald-700: oklch(0.508 0.118 165.612);
--color-emerald-800: oklch(0.432 0.095 166.913);
--color-emerald-900: oklch(0.378 0.077 168.94);
--color-emerald-950: oklch(0.262 0.051 172.552);
--color-teal-50: oklch(0.984 0.014 180.72);
--color-teal-100: oklch(0.953 0.051 180.801);
--color-teal-200: oklch(0.91 0.096 180.426);
--color-teal-300: oklch(0.855 0.138 181.071);
--color-teal-400: oklch(0.777 0.152 181.912);
--color-teal-500: oklch(0.704 0.14 182.503);
--color-teal-600: oklch(0.6 0.118 184.704);
--color-teal-700: oklch(0.511 0.096 186.391);
--color-teal-800: oklch(0.437 0.078 188.216);
--color-teal-900: oklch(0.386 0.063 188.416);
--color-teal-950: oklch(0.277 0.046 192.524);
--color-cyan-50: oklch(0.984 0.019 200.873);
--color-cyan-100: oklch(0.956 0.045 203.388);
--color-cyan-200: oklch(0.917 0.08 205.041);
--color-cyan-300: oklch(0.865 0.127 207.078);
--color-cyan-400: oklch(0.789 0.154 211.53);
--color-cyan-500: oklch(0.715 0.143 215.221);
--color-cyan-600: oklch(0.609 0.126 221.723);
--color-cyan-700: oklch(0.52 0.105 223.128);
--color-cyan-800: oklch(0.45 0.085 224.283);
--color-cyan-900: oklch(0.398 0.07 227.392);
--color-cyan-950: oklch(0.302 0.056 229.695);
--color-sky-50: oklch(0.977 0.013 236.62);
--color-sky-100: oklch(0.951 0.026 236.824);
--color-sky-200: oklch(0.901 0.058 230.902);
--color-sky-300: oklch(0.828 0.111 230.318);
--color-sky-400: oklch(0.746 0.16 232.661);
--color-sky-500: oklch(0.685 0.169 237.323);
--color-sky-600: oklch(0.588 0.158 241.966);
--color-sky-700: oklch(0.5 0.134 242.749);
--color-sky-800: oklch(0.443 0.11 240.79);
--color-sky-900: oklch(0.391 0.09 240.876);
--color-sky-950: oklch(0.293 0.066 243.157);
--color-blue-50: oklch(0.97 0.014 254.604);
--color-blue-100: oklch(0.932 0.032 255.585);
--color-blue-200: oklch(0.882 0.059 254.128);
--color-blue-300: oklch(0.809 0.105 251.813);
--color-blue-400: oklch(0.707 0.165 254.624);
--color-blue-500: oklch(0.623 0.214 259.815);
--color-blue-600: oklch(0.546 0.245 262.881);
--color-blue-700: oklch(0.488 0.243 264.376);
--color-blue-800: oklch(0.424 0.199 265.638);
--color-blue-900: oklch(0.379 0.146 265.522);
--color-blue-950: oklch(0.282 0.091 267.935);
--color-indigo-50: oklch(0.962 0.018 272.314);
--color-indigo-100: oklch(0.93 0.034 272.788);
--color-indigo-200: oklch(0.87 0.065 274.039);
--color-indigo-300: oklch(0.785 0.115 274.713);
--color-indigo-400: oklch(0.673 0.182 276.935);
--color-indigo-500: oklch(0.585 0.233 277.117);
--color-indigo-600: oklch(0.511 0.262 276.966);
--color-indigo-700: oklch(0.457 0.24 277.023);
--color-indigo-800: oklch(0.398 0.195 277.366);
--color-indigo-900: oklch(0.359 0.144 278.697);
--color-indigo-950: oklch(0.257 0.09 281.288);
--color-violet-50: oklch(0.969 0.016 293.756);
--color-violet-100: oklch(0.943 0.029 294.588);
--color-violet-200: oklch(0.894 0.057 293.283);
--color-violet-300: oklch(0.811 0.111 293.571);
--color-violet-400: oklch(0.702 0.183 293.541);
--color-violet-500: oklch(0.606 0.25 292.717);
--color-violet-600: oklch(0.541 0.281 293.009);
--color-violet-700: oklch(0.491 0.27 292.581);
--color-violet-800: oklch(0.432 0.232 292.759);
--color-violet-900: oklch(0.38 0.189 293.745);
--color-violet-950: oklch(0.283 0.141 291.089);
--color-purple-50: oklch(0.977 0.014 308.299);
--color-purple-100: oklch(0.946 0.033 307.174);
--color-purple-200: oklch(0.902 0.063 306.703);
--color-purple-300: oklch(0.827 0.119 306.383);
--color-purple-400: oklch(0.714 0.203 305.504);
--color-purple-500: oklch(0.627 0.265 303.9);
--color-purple-600: oklch(0.558 0.288 302.321);
--color-purple-700: oklch(0.496 0.265 301.924);
--color-purple-800: oklch(0.438 0.218 303.724);
--color-purple-900: oklch(0.381 0.176 304.987);
--color-purple-950: oklch(0.291 0.149 302.717);
--color-fuchsia-50: oklch(0.977 0.017 320.058);
--color-fuchsia-100: oklch(0.952 0.037 318.852);
--color-fuchsia-200: oklch(0.903 0.076 319.62);
--color-fuchsia-300: oklch(0.833 0.145 321.434);
--color-fuchsia-400: oklch(0.74 0.238 322.16);
--color-fuchsia-500: oklch(0.667 0.295 322.15);
--color-fuchsia-600: oklch(0.591 0.293 322.896);
--color-fuchsia-700: oklch(0.518 0.253 323.949);
--color-fuchsia-800: oklch(0.452 0.211 324.591);
--color-fuchsia-900: oklch(0.401 0.17 325.612);
--color-fuchsia-950: oklch(0.293 0.136 325.661);
--color-pink-50: oklch(0.971 0.014 343.198);
--color-pink-100: oklch(0.948 0.028 342.258);
--color-pink-200: oklch(0.899 0.061 343.231);
--color-pink-300: oklch(0.823 0.12 346.018);
--color-pink-400: oklch(0.718 0.202 349.761);
--color-pink-500: oklch(0.656 0.241 354.308);
--color-pink-600: oklch(0.592 0.249 0.584);
--color-pink-700: oklch(0.525 0.223 3.958);
--color-pink-800: oklch(0.459 0.187 3.815);
--color-pink-900: oklch(0.408 0.153 2.432);
--color-pink-950: oklch(0.284 0.109 3.907);
--color-rose-50: oklch(0.969 0.015 12.422);
--color-rose-100: oklch(0.941 0.03 12.58);
--color-rose-200: oklch(0.892 0.058 10.001);
--color-rose-300: oklch(0.81 0.117 11.638);
--color-rose-400: oklch(0.712 0.194 13.428);
--color-rose-500: oklch(0.645 0.246 16.439);
--color-rose-600: oklch(0.586 0.253 17.585);
--color-rose-700: oklch(0.514 0.222 16.935);
--color-rose-800: oklch(0.455 0.188 13.697);
--color-rose-900: oklch(0.41 0.159 10.272);
--color-rose-950: oklch(0.271 0.105 12.094);
--color-slate-50: oklch(0.984 0.003 247.858);
--color-slate-100: oklch(0.968 0.007 247.896);
--color-slate-200: oklch(0.929 0.013 255.508);
--color-slate-300: oklch(0.869 0.022 252.894);
--color-slate-400: oklch(0.704 0.04 256.788);
--color-slate-500: oklch(0.554 0.046 257.417);
--color-slate-600: oklch(0.446 0.043 257.281);
--color-slate-700: oklch(0.372 0.044 257.287);
--color-slate-800: oklch(0.279 0.041 260.031);
--color-slate-900: oklch(0.208 0.042 265.755);
--color-slate-950: oklch(0.129 0.042 264.695);
--color-gray-50: oklch(0.985 0.002 247.839);
--color-gray-100: oklch(0.967 0.003 264.542);
--color-gray-200: oklch(0.928 0.006 264.531);
--color-gray-300: oklch(0.872 0.01 258.338);
--color-gray-400: oklch(0.707 0.022 261.325);
--color-gray-500: oklch(0.551 0.027 264.364);
--color-gray-600: oklch(0.446 0.03 256.802);
--color-gray-700: oklch(0.373 0.034 259.733);
--color-gray-800: oklch(0.278 0.033 256.848);
--color-gray-900: oklch(0.21 0.034 264.665);
--color-gray-950: oklch(0.13 0.028 261.692);
--color-zinc-50: oklch(0.985 0 0);
--color-zinc-100: oklch(0.967 0.001 286.375);
--color-zinc-200: oklch(0.92 0.004 286.32);
--color-zinc-300: oklch(0.871 0.006 286.286);
--color-zinc-400: oklch(0.705 0.015 286.067);
--color-zinc-500: oklch(0.552 0.016 285.938);
--color-zinc-600: oklch(0.442 0.017 285.786);
--color-zinc-700: oklch(0.37 0.013 285.805);
--color-zinc-800: oklch(0.274 0.006 286.033);
--color-zinc-900: oklch(0.21 0.006 285.885);
--color-zinc-950: oklch(0.141 0.005 285.823);
--color-neutral-50: oklch(0.985 0 0);
--color-neutral-100: oklch(0.97 0 0);
--color-neutral-200: oklch(0.922 0 0);
--color-neutral-300: oklch(0.87 0 0);
--color-neutral-400: oklch(0.708 0 0);
--color-neutral-500: oklch(0.556 0 0);
--color-neutral-600: oklch(0.439 0 0);
--color-neutral-700: oklch(0.371 0 0);
--color-neutral-800: oklch(0.269 0 0);
--color-neutral-900: oklch(0.205 0 0);
--color-neutral-950: oklch(0.145 0 0);
--color-stone-50: oklch(0.985 0.001 106.423);
--color-stone-100: oklch(0.97 0.001 106.424);
--color-stone-200: oklch(0.923 0.003 48.717);
--color-stone-300: oklch(0.869 0.005 56.366);
--color-stone-400: oklch(0.709 0.01 56.259);
--color-stone-500: oklch(0.553 0.013 58.071);
--color-stone-600: oklch(0.444 0.011 73.639);
--color-stone-700: oklch(0.374 0.01 67.558);
--color-stone-800: oklch(0.268 0.007 34.298);
--color-stone-900: oklch(0.216 0.006 56.043);
--color-stone-950: oklch(0.147 0.004 49.25);
--color-black: #000;
--color-white: #fff;
}
This can be useful if you want to reuse any of these scales but under a different name, like redefining --color-gray-_ to use the --color-slate-_ scale.

Next.js

## Adding dark mode to your next app.

Install next-themes
Start by installing next-themes:

pnpm
npm
yarn
bun
pnpm add next-themes
Copy
Create a theme provider
components/theme-provider.tsx
Copy
"use client"

import \* as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"

export function ThemeProvider({
children,
...props
}: React.ComponentProps<typeof NextThemesProvider>) {
return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}
Wrap your root layout
Add the ThemeProvider to your root layout and add the suppressHydrationWarning prop to the html tag.

app/layout.tsx

import { ThemeProvider } from "@/components/theme-provider"

export default function RootLayout({ children }: RootLayoutProps) {
return (
<>
<html lang="en" suppressHydrationWarning>
<head />
<body>
<ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
{children}
</ThemeProvider>
</body>
</html>
</>
)
}

### Add a mode toggle

Place a mode toggle on your site to toggle between light and dark mode.

"use client"
import \* as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import {
DropdownMenu,
DropdownMenuContent,
DropdownMenuItem,
DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
export function ModeToggle() {
const { setTheme } = useTheme()
return (
<DropdownMenu>
<DropdownMenuTrigger asChild>
<Button variant="outline" size="icon">
<Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
<Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
<span className="sr-only">Toggle theme</span>
</Button>
</DropdownMenuTrigger>
<DropdownMenuContent align="end">
<DropdownMenuItem onClick={() => setTheme("light")}>
Light
</DropdownMenuItem>
<DropdownMenuItem onClick={() => setTheme("dark")}>
Dark
</DropdownMenuItem>
<DropdownMenuItem onClick={() => setTheme("system")}>
System
</DropdownMenuItem>
</DropdownMenuContent>
</DropdownMenu>
)
}

## Use the shadcn CLI to add components to your project.

### init

Use the init command to initialize configuration and dependencies for a new project.

The init command installs dependencies, adds the cn util and configures CSS variables for the project.

pnpm dlx shadcn@latest init

#### Options

Usage: shadcn init [options] [components...]

initialize your project and install dependencies

Arguments:
components the components to add or a url to the component.

Options:
-t, --template <template> the template to use. (next, next-monorepo)
-b, --base-color <base-color> the base color to use. (neutral, gray, zinc, stone, slate)
-y, --yes skip confirmation prompt. (default: true)
-f, --force force overwrite of existing configuration. (default: false)
-c, --cwd <cwd> the working directory. defaults to the current directory. (default:
"/Users/shadcn/Code/shadcn/ui/packages/shadcn")
-s, --silent mute output. (default: false)
--src-dir use the src directory when creating a new project. (default: false)
--no-src-dir do not use the src directory when creating a new project.
--css-variables use css variables for theming. (default: true)
--no-css-variables do not use css variables for theming.
-h, --help display help for command

### add

Use the add command to add components and dependencies to your project.

pnpm dlx shadcn@latest add [component]

#### Options

Usage: shadcn add [options] [components...]

add a component to your project

Arguments:
components the components to add or a url to the component.

Options:
-y, --yes skip confirmation prompt. (default: false)
-o, --overwrite overwrite existing files. (default: false)
-c, --cwd <cwd> the working directory. defaults to the current directory. (default: "/Users/shadcn/Desktop")
-a, --all add all available components (default: false)
-p, --path <path> the path to add the component to.
-s, --silent mute output. (default: false)
--src-dir use the src directory when creating a new project. (default: false)
--no-src-dir do not use the src directory when creating a new project.
--css-variables use css variables for theming. (default: true)
--no-css-variables do not use css variables for theming.
-h, --help display help for command

### build

Use the build command to generate the registry JSON files.

pnpm dlx shadcn@latest build

This command reads the registry.json file and generates the registry JSON files in the public/r directory.

#### Options

Usage: shadcn build [options] [registry]

build components for a shadcn registry

Arguments:
registry path to registry.json file (default: "./registry.json")

Options:
-o, --output <path> destination directory for json files (default: "./public/r")
-c, --cwd <cwd> the working directory. defaults to the current directory. (default:
"/Users/shadcn/Code/shadcn/ui/packages/shadcn")
-h, --help display help for command
To customize the output directory, use the --output option.

pnpm dlx shadcn@latest build --output ./public/registry
