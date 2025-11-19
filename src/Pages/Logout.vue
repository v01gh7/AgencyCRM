// новый компонент Logout.vue
<script setup lang="ts">
import { useUserStore } from '@/stores/useUserStore'
import { useRouter } from 'vue-router'

const userStore = useUserStore()
const router = useRouter()

// сразу вызываем logout при монтировании
userStore.logout()

// перенаправляем на главную или signin
router.navigateTo('/signin')
definePageMeta({
  guestOnly: true
})
</script>

<template>
    <div>Выход...</div>
</template>
