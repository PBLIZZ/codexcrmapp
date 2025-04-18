/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './node_modules/@shadcn/ui/dist/**/*.{js,ts,jsx,tsx}'
  ],
  theme: { extend: {} },
  plugins: []
};