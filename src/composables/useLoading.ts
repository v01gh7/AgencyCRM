// composables/useLoading.ts
import { ref } from 'vue'

export const isRouteLoading = ref(false)

export function useLoading() {
  return {
    isRouteLoading
  }
}