/// <reference types="nuxt/app" />

// Импорты Vue-компонентов через '*.vue'
declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}
