<template>
  <div class="min-h-screen flex flex-col">
    <Header />
    <transition name="route-fade" mode="out-in">
      <router-view />
    </transition>

    <!-- Right menu drawer (portal not required for simple demo) -->
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
import Header from '@/components/defaults/navigation/Header.vue'
import RightMenu from '@/components/defaults/navigation/RightMenu.vue'
import { useMenuStore } from './stores/useMenuStore'

const menuStore = useMenuStore()
</script>
