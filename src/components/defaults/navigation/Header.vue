<template>
  <header class="flex items-center justify-between px-6 py-4">
    <div class="flex items-center gap-3">
      <div class="w-10 h-10 rounded-md flex items-center justify-center bg-[linear-gradient(90deg,var(--mainColor),#f1d6b5)] text-black font-bold">GM</div>
      <div>
        <h1 class="text-lg font-semibold">Agency AdHub</h1>
        <p class="text-xs text-white-400">AgencyCRM — реклама в одном месте</p>
      </div>
    </div>

    <div class="flex items-center gap-3">
      <button class="btn-primary" @click="$emit('toggle-menu')">
        Меню
      </button>
    </div>
  </header>
</template>

<script setup lang="ts">
// Emits: toggle-menu
</script>
