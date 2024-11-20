// import { defineConfig } from 'vite'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from "tailwindcss";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()], // Add React plugin for Vite here
  css: {
    postcss: {
      plugins: [tailwindcss()], // Add TailwindCSS plugin here
    },
  },
});
