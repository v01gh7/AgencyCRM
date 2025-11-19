<template>
  <div class="min-h-screen flex flex-col">
    <Header />
    
    <!-- Заменяем router-view на NuxtPage -->
    <NuxtPage />
    
    <!-- Right menu drawer -->
    <div class="fixed inset-y-0 right-0 w-80 z-50 pointer-events-none">
      <div
        :class="['h-full p-6 bg-transparent pointer-events-auto', 'drawer-right', { open: menuStore.isOpen }]"
        style="backdrop-filter: blur(8px);"
      >
        <div class="glass glass-accent h-full flex flex-col">
          <RightMenu />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Убираем импорты - Nuxt автоимпортирует компоненты
// Header и RightMenu должны быть в папке components

// Store тоже будет автоимпортирован если используешь useMenuStore() в composables/
const menuStore = useMenuStore()
</script>