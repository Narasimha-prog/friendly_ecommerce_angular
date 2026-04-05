import { defineConfig } from 'vite'
import angular from '@analogjs/vite-plugin-angular';
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [angular(),tailwindcss()],
})
