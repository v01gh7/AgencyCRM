<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-[var(--mainColor)] via-[var(--secondColor)] to-[var(--fourthColor)] p-4">
    <div class="bg-[var(--glass-bg)] backdrop-blur-md border border-[var(--glass-border)] rounded-2xl shadow-2xl p-8 w-full max-w-md text-center">
      <h1 class="text-3xl font-bold mb-2 text-[var(--text-color)]">Авторизация Google/Yandex</h1>
      <p class="text-slate-200 mb-6 text-[var(--text-color)] header-subtext">Подключи аккаунт, чтобы тестировать Google Ads API или Yandex Metrika</p>

      <GoogleAuth />
      <br>
      <YandexAuth />
    </div>
  </div>
</template>


<script setup lang="ts">
import GoogleAuth from '@/components/Auth/Google/Auth/GoogleAuth.vue'
import YandexAuth from '@/components/Auth/Yandex/Auth/YandexAuth.vue'

definePageMeta({
  requiresAuth: false
})
</script>

<style scoped>  </style>
