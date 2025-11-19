import { createRouter, createWebHistory } from "vue-router"

// импорт твоего редактора
import HomeView from "@/Pages/Home/HomeView.vue"
import GoogleAdsReports from "@/Pages/GoogleAds/GoogleAdsReports.vue"
import YandexMetrikaReports from "@/Pages/YandexMetrika/YandexMetrika.vue"


import SignIn from "@/components/Auth/SignIn/SignIn.vue"
import Signed from "@/components/Auth/SignIn/Signed.vue"
import Logout from "@/components/Auth/SignIn/Logout.vue"
import { useLoading } from '@/composables/useLoading'
import { useUserStore } from "@/stores/useUserStore"
import { useMenuStore } from "@/stores/useMenuStore"

const { isRouteLoading } = useLoading()

const routes = [
  {
    path: "/",
    component: HomeView, // твой главный экран
  },

  {
    path: '/signin',
    name: 'signin',
    component: SignIn,
    meta: { guestOnly: true },
  },  
  {
    path: '/signed',
    name: 'signed',
    component: Signed,
    meta: { guestOnly: true },
  },  
  {
    path: '/logout',
    name: 'logout',
    component: Logout,
    meta: { requiresAuth: true },
  },  
  {
    path: '/google-ads-reports',
    name: 'GoogleAdsReports',
    component: GoogleAdsReports,
    meta: { requiresAuth: true },
  },  
  {
    path: '/yandex-metrika-reports',
    name: 'YandexMetrikaReports',
    component: YandexMetrikaReports,
    meta: { requiresAuth: false },
  },  
  // {
  //   path: '/dashboard',
  //   name: 'dashboard',
  //   component: () => import('@/views/Dashboard.vue'),
  //   meta: { requiresAuth: true }, // 🔒 защищённая страница
  // },
  // {
  //   path: '/login',
  //   name: 'login',
  //   component: () => import('@/views/Login.vue'),
  //   meta: { guestOnly: true },
  // },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// 🧭 Guard с индикатором загрузки
router.beforeEach(async (to, from, next) => {
  const userStore = useUserStore()
  isRouteLoading.value = true

  if (!userStore.loaded.value) {
    await userStore.fetchUser()
  }

  if (to.meta.requiresAuth && !userStore.isAuthenticated.value) {
    return next('/signin')
  }

  if (to.meta.guestOnly && userStore.isAuthenticated.value) {
    return next('/')
  }

  next()
})

router.afterEach(() => {
    const menuStore = useMenuStore()
    menuStore.close() // закрываем RightMenu при любом переходе
  setTimeout(() => {
    isRouteLoading.value = false
  }, 200)
})


export default router
