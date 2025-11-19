import { defineNuxtConfig } from 'nuxt/config';

export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  typescript: {
    typeCheck: 'build',
    strict: true
  },
  app: {
    pageTransition: { name: 'route-fade', mode: 'out-in' },
    rootId: 'app',
    rootTag: 'body'    
  },
  srcDir: 'src/', 
  alias: {
    '@': './src'
  },
  postcss: {
    plugins: {
      '@tailwindcss/postcss': {},
      'autoprefixer': {},
    }
  }  
})