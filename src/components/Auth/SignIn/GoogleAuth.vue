<template>
    <div>
        <button
            @click="handleGoogleAuth"
            class="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-lg font-medium shadow-md transition-all duration-300"
            :style="{
            background: 'var(--btn-gradient)',
            color: 'white',
            boxShadow: 'var(--btn-shadow)'
            }"
        >
            <svg style="width: 32px;height: 32px;" width="32px" height="32px" class="w-5 h-5" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Продолжить с Google
        </button>

        <div v-if="token" class="mt-6 text-sm text-green-300 break-all">
            ✅ Токен получен:<br>{{ token }}
        </div>

    </div>

</template>


<script setup lang="ts">
import { useLocalStorage } from '@vueuse/core'
import { googleConfig } from '@/config/google'
import { useUserStore } from '@/stores/useUserStore'
import router from '@/router'

const token = useLocalStorage('google_token', '')
const tokenType = useLocalStorage('google_token_type', '')
const tokenExpires = useLocalStorage('google_token_expires', 0)

const CLIENT_ID = googleConfig.clientId
const REDIRECT_URI = googleConfig.redirectUri || window.location.origin + '/signed'
const SCOPES = [
  'https://www.googleapis.com/auth/adwords',
  'https://www.googleapis.com/auth/userinfo.email',
  'https://www.googleapis.com/auth/userinfo.profile'
].join(' ')

const userStore = useUserStore()

function handleGoogleAuth() {
  const authUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth')
  authUrl.searchParams.set('client_id', CLIENT_ID)
  authUrl.searchParams.set('redirect_uri', REDIRECT_URI)
  authUrl.searchParams.set('response_type', 'token')
  authUrl.searchParams.set('scope', SCOPES)
  authUrl.searchParams.set('include_granted_scopes', 'true')
  authUrl.searchParams.set('prompt', 'select_account')

  const width = 1000
  const height = 800
  const left = (window.screen.width - width) / 2
  const top = (window.screen.height - height) / 2

  const authWindow = window.open(
    authUrl.toString(),
    'google_auth',
    `width=${width},height=${height},left=${left},top=${top}`
  )

  // слушаем ответ из popup
  window.addEventListener('message', async (event: MessageEvent) => {
    if (event.origin !== window.location.origin) return
    const data = event.data

    if (data?.access_token) {
      token.value = data.access_token
      tokenType.value = data.token_type
      tokenExpires.value = Date.now() + data.expires_in * 1000

      authWindow?.close()

      await userStore.fetchUser(true)
      router.push('/')
      console.log('✅ Авторизация успешна, токен сохранён')
    }
  })
}
</script>


<style scoped>
button:hover {
  filter: brightness(1.1);
  transform: translateY(-1px);
}
.header-subtext{
  color: var(--text-color) !important;
}
</style>
