<template>
  <header class="header flex items-center justify-between px-6 py-4 ">
    <div class="flex items-center gap-3">
      <router-link to="/" class="w-10 h-10 rounded-md flex items-center justify-center bg-[linear-gradient(90deg,var(--mainColor),#f1d6b5)] text-black font-bold">GM</router-link>
      <div>
        <h1 class="text-lg font-semibold">Agency AdHub</h1>
        <p class="text-xs text-white-400">AgencyCRM — реклама в одном месте</p>
      </div>
    </div>

    <div class="flex items-center gap-3">
      <button class="btn-primary" @click="menuStore.toggle()">
        Меню
      </button>
    </div>
  </header>
</template>

<script setup lang="ts">
import { useMenuStore } from '@/stores/useMenuStore';

const menuStore = useMenuStore()

// Emits: toggle-menu
</script>

<style scoped>
.header{
  width: 100%;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 9;
  background: #1c1c1c;
}
</style>
