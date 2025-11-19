<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-[var(--mainColor)] via-[var(--secondColor)] to-[var(--fourthColor)] p-4">
    <div class="bg-[var(--glass-bg)] backdrop-blur-md border border-[var(--glass-border)] rounded-2xl shadow-2xl p-8 w-full max-w-md text-center">
      <h1 class="text-3xl font-bold mb-2 text-[var(--text-color)]">Авторизация Google/Yandex</h1>
      <p class="text-slate-200 mb-6 text-[var(--text-color)] header-subtext">Подключи аккаунт, чтобы тестировать Google Ads API или Yandex Metrika</p>

      <GoogleAuth />
    </div>
  </div>
</template>


<script setup lang="ts">
import GoogleAuth from '@/components/Auth/SignIn/GoogleAuth.vue'

</script>


<style scoped>

</style>
