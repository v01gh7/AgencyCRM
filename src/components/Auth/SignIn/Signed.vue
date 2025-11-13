<script setup lang="ts">
import { onMounted } from 'vue'

onMounted(() => {
  // пример URL:
  // http://localhost:5173/signed#access_token=ya29.a0...&token_type=Bearer&expires_in=3599

    const hash = new URLSearchParams(window.location.hash.slice(1))
    const access_token = hash.get('access_token')
    const token_type = hash.get('token_type')
    const expires_in = Number(hash.get('expires_in') || 0)

    if (access_token) {
    // отправляем токен обратно в родителя
        window.opener?.postMessage(
            { access_token, token_type, expires_in, success: true },
            window.location.origin
        )
    }

    // закрываем popup
    window.close()
})
</script>

<template>
    <div>Авторизация завершена, окно закроется...</div>
</template>
