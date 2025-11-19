import { useMenuStore } from '~/stores/useMenuStore'
import { useLoading } from '~/composables/useLoading'

export default defineNuxtRouteMiddleware((to, from) => {
  const menuStore = useMenuStore()
  const { isRouteLoading } = useLoading()

  // закрыть меню при переходе
  menuStore.close()

  // убрать лоадер
  setTimeout(() => {
    isRouteLoading.value = false
  }, 200)
})
