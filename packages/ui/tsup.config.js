import { defineConfig } from "tsup";

export default defineConfig({
  // The entry point of your library. tsup will build everything from here.
  entry: ["src/index.ts"],
  tsconfig: "tsconfig.json",

  // The output format. 'esm' is standard for modern apps and libraries.
  format: ["esm"],

  // --- CRITICAL FIX 1: GENERATE DECLARATION FILES ---
  // This tells tsup to create the .d.ts files that TypeScript needs
  // to understand the props and types of your components.
  dts: true,

  // --- CRITICAL FIX 2: ADD "use client" BANNER ---
  // This automatically adds "use client;" to the top of every
  // compiled component file, making them compatible with Next.js App Router.
  banner: {
    js: '"use client";',
  },

  // Code splitting for better tree-shaking.
  splitting: true,

  // Don't bundle dependencies; they will be installed by the consumer app.
  external: ["react", "react-dom"],

  // Clean the 'dist' folder before each build.
  clean: true,
});
