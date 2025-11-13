<template>
  <div class="flex flex-col h-full">
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-lg font-semibold">Навигация</h3>
      <button class="text-sm px-2 py-1" @click="$emit('close')">Закрыть</button>
    </div>

    <nav class="flex flex-col gap-2">
      <router-link to="/" class="p-3 rounded hover:bg-white/5">Главная</router-link>
      <router-link to="/" class="p-3 rounded hover:bg-white/5">Отчёты</router-link>
      <router-link to="/" class="p-3 rounded hover:bg-white/5">Кабинеты</router-link>
      <router-link to="/" class="p-3 rounded hover:bg-white/5">Настройки</router-link>
    </nav>

    <div class="mt-auto text-sm text-white-400">
      <div>Версия: 0.1</div>
      <div class="mt-2">GM ADHUB</div>
    </div>
  </div>
</template>

<script setup lang="ts">
</script>
