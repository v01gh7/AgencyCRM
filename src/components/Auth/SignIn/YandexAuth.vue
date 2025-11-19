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
    <svg width="32px" fill="none" height="32px" viewBox="0 0 32 32"><mask id="mask0_1315_11716" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="32" height="32"><ellipse cx="16" cy="16.0011" rx="16" ry="16" fill="white"></ellipse></mask><g mask="url(#mask0_1315_11716)"><rect y="0.00224304" width="32" height="32" fill="url(#paint0_linear_1315_11716)"></rect><path d="M0 20H10V32H0V20Z" fill="url(#paint1_linear_1315_11716)"></path><path d="M10 16.4C10 14.1598 10 13.0397 10.436 12.184C10.8195 11.4314 11.4314 10.8195 12.184 10.436C13.0397 10 14.1598 10 16.4 10H22V32H10V16.4Z" fill="url(#paint2_linear_1315_11716)"></path><path d="M22 0H32V32H22V0Z" fill="url(#paint3_linear_1315_11716)"></path></g><defs><linearGradient id="paint0_linear_1315_11716" x1="22.9334" y1="23.2008" x2="-3.46665" y2="-13.5992" gradientUnits="userSpaceOnUse"><stop stop-color="#4643B9"></stop><stop offset="1" stop-color="#1E8AFF"></stop></linearGradient><linearGradient id="paint1_linear_1315_11716" x1="10.6584" y1="27.8479" x2="-18.8276" y2="22.4987" gradientUnits="userSpaceOnUse"><stop stop-color="#FF002E"></stop><stop offset="1" stop-color="#FFADA1"></stop></linearGradient><linearGradient id="paint2_linear_1315_11716" x1="83.8" y1="80.2778" x2="91.207" y2="20.8038" gradientUnits="userSpaceOnUse"><stop stop-color="#3C3BA0"></stop><stop offset="0.489583" stop-color="#1E8AFF"></stop><stop offset="1" stop-color="#00B2FF"></stop></linearGradient><linearGradient id="paint3_linear_1315_11716" x1="22" y1="1.64523" x2="50.1153" y2="16.4011" gradientUnits="userSpaceOnUse"><stop stop-color="#FFEA1A"></stop><stop offset="1" stop-color="#FFB800"></stop></linearGradient></defs></svg>
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
