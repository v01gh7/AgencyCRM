import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/Pages/Home/HomeView.vue'

const routes = [
  { path: '/', name: 'home', component: HomeView },
  // добавьте сюда будущие роуты
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
