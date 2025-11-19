<template>
  <div>
    <button
      @click="handleYandexAuth"
      class="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-lg font-medium shadow-md transition-all duration-300"
      :style="{
        background: 'var(--btn-gradient)',
        color: 'white',
        boxShadow: 'var(--btn-shadow)'
      }"
    >
      <svg width="22" height="22" viewBox="0 0 48 48">
        <path fill="#FC3F1D" d="M24 2L10 6v16c0 9.94 6.51 19.44 14 24c7.49-4.56 14-14.06 14-24V6l-14-4z"/>
      </svg>
      Продолжить с Яндекс
    </button>

    <div v-if="token" class="mt-6 text-sm text-green-300 break-all">
      ✅ Токен Яндекса:<br>{{ token }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { useLocalStorage } from "@vueuse/core";
import { useUserStore } from "@/stores/useUserStore";
import router from "@/router";

// Храним токены
const token = useLocalStorage("yandex_token", "");
const tokenExpires = useLocalStorage("yandex_token_expires", 0);
const tokenType = useLocalStorage("yandex_token_type", "");

// Данные из Яндекс приложения
const CLIENT_ID = import.meta.env.VITE_YANDEX_CLIENT_ID;
const REDIRECT_URI =
  import.meta.env.VITE_YANDEX_REDIRECT ||
  window.location.origin + "/signed";

// SCOPES — точные, проверено
const SCOPES = [
  "metrika:read",
  "metrika:write",
  "metrika:offline_data",
  "metrika:user_params",
  "metrika:expenses"
].join(" ");

const userStore = useUserStore();

function handleYandexAuth() {
  const authUrl = new URL("https://oauth.yandex.kz/authorize");

  authUrl.searchParams.set("response_type", "token");
  authUrl.searchParams.set("client_id", CLIENT_ID);
  authUrl.searchParams.set("redirect_uri", REDIRECT_URI);
  authUrl.searchParams.set("scope", SCOPES);
  authUrl.searchParams.set("force_confirm", "yes");

  const width = 900;
  const height = 700;
  const left = (window.screen.width - width) / 2;
  const top = (window.screen.height - height) / 2;

  const popup = window.open(
    authUrl.toString(),
    "yandex_auth",
    `width=${width},height=${height},left=${left},top=${top}`
  );

  // слушаем ответ
  window.addEventListener("message", async (event: MessageEvent) => {
    if (event.origin !== window.location.origin) return;
    const data = event.data;

    if (data?.access_token) {
      token.value = data.access_token;
      tokenType.value = data.token_type;
      tokenExpires.value = Date.now() + data.expires_in * 1000;

      popup?.close();

      await userStore.fetchUser(true);
      router.push("/");

      console.log("🔥 Яндекс токен успешно получен");
    }
  });
}
</script>

<style scoped>
button:hover {
  filter: brightness(1.1);
  transform: translateY(-1px);
}
</style>
