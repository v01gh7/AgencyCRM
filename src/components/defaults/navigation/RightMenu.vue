<template>
  <div class="flex flex-col h-full">
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-lg font-semibold">Навигация</h3>
      <button class="text-sm px-2 py-1" @click="menuStore.close()">Закрыть</button>
    </div>

    <nav class="flex flex-col gap-2">
      <router-link to="/" class="p-3 rounded hover:bg-white/5">Главная</router-link>
      <router-link to="/" class="p-3 rounded hover:bg-white/5">Отчёты</router-link>
      <router-link to="/" class="p-3 rounded hover:bg-white/5">Кабинеты</router-link>
      <router-link to="/" class="p-3 rounded hover:bg-white/5">Настройки</router-link>
      <router-link v-if="userStore.isAuthenticated.value" to="/google-ads-reports" class="p-3 rounded hover:bg-white/5">Google Ads Отчёты</router-link>
      <router-link to="/yandex-metrika-reports" class="p-3 rounded hover:bg-white/5">Yandex Metrika Отчёты</router-link>
      <router-link v-if="!userStore.isAuthenticated.value" to="/signin" class="p-3 rounded hover:bg-white/5">Авторизоваться</router-link>
      <router-link v-if="userStore.isAuthenticated.value" to="/logout" class="p-3 rounded hover:bg-white/5">Выйти</router-link>
    </nav>

    <div class="mt-auto text-sm text-white-400">
      <div>Версия: 0.1</div>
      <div class="mt-2">GM ADHUB</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useMenuStore } from '@/stores/useMenuStore';
import { useUserStore } from '@/stores/useUserStore';

const userStore = useUserStore()
const menuStore = useMenuStore()

</script>
