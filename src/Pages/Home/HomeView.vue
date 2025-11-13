<template>
  <main class="flex-1 flex items-center justify-center px-6">
    <div class="max-w-5xl w-full grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- Hero -->
      <section class="glass col-span-1 md:col-span-2 flex flex-col gap-4">
        <div class="flex items-center justify-between">
          <div>
            <h2 class="text-2xl font-semibold">Добро пожаловать в <span class="text-primary">GM AdHub</span></h2>
            <p class="text-white-300">Централизованный сбор и анализ рекламных данных</p>
          </div>
          <div>
            <button class="btn-primary">Создать отчёт</button>
          </div>
        </div>

        <div class="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div class="glass p-4">
            <div class="text-sm text-white-400">Расход за неделю</div>
            <div class="text-xl font-bold mt-2">1 240 000 ₸</div>
          </div>

          <div class="glass p-4">
            <div class="text-sm text-white-400">Клики</div>
            <div class="text-xl font-bold mt-2">12 320</div>
          </div>

          <div class="glass p-4">
            <div class="text-sm text-white-400">CTR</div>
            <div class="text-xl font-bold mt-2">4.2%</div>
          </div>
        </div>
      </section>

      <!-- Cards -->
      <div class="glass">
        <h3 class="font-semibold mb-2">Аккаунты</h3>
        <p class="text-sm text-white-300">Список подключенных рекламных кабинетов и состояние синхронизации.</p>
      </div>

      <div class="glass">
        <h3 class="font-semibold mb-2">События</h3>
        <p class="text-sm text-white-300">Журнал синхронизации и ошибки.</p>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
</script>
