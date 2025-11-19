import { useUserStore } from '~/stores/useUserStore'
import { useMenuStore } from '~/stores/useMenuStore'
import { useLoading } from '~/composables/useLoading'
import { defineNuxtRouteMiddleware, navigateTo } from 'nuxt/app'

export default defineNuxtRouteMiddleware(async (to, from) => {
  const userStore = useUserStore()
  const menuStore = useMenuStore()
  const { isRouteLoading } = useLoading()

  isRouteLoading.value = true

  if (!userStore.loaded.value) {
    await userStore.fetchUser()
  }

  // requiresAuth аналог
  if (to.meta.requiresAuth && !userStore.isAuthenticated) {
    return navigateTo('/signin')
  }

  // guestOnly аналог
  if (to.meta.guestOnly && userStore.isAuthenticated) {
    return navigateTo('/')
  }
})
