import { ref, computed } from 'vue'
import { useLocalStorage } from '@vueuse/core'

interface User {
    email: string
    name: string
    picture?: string
    id: string
    locale?: string
}

export const useUserStore = () => {
    const user = useLocalStorage<User | null>('user', null)
    const token = useLocalStorage('google_token', '')
    const loaded = ref(!!user.value)
    const isAuthenticated = computed(() => !!user.value && !!token.value)

    /**
     * Проверяет токен и получает данные о пользователе напрямую из Google
     */
    async function fetchUser(force = false) {
        if (loaded.value && !force) return user.value
        if (!token.value) {
            user.value = null
            loaded.value = true
            return null
        }

        try {
            const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
                headers: {
                    Authorization: `Bearer ${token.value}`,
                },
            })

            if (!res.ok) throw new Error('Invalid token')

            const data = await res.json()
            user.value = {
                email: data.email,
                name: data.name,
                picture: data.picture,
                id: data.sub,
                locale: data.locale,
            }

            localStorage.setItem('user', JSON.stringify(user.value))
        } catch (err) {
            console.warn('Token invalid or expired:', err)
            user.value = null
            token.value = ''
            localStorage.removeItem('user')
            localStorage.removeItem('google_token')
        } finally {
            loaded.value = true
        }

        return user.value
    }
    function logout() {
        user.value = null
        token.value = null
        loaded.value = false
        localStorage.removeItem('user')
        localStorage.removeItem('google_token')
    }

    return {
        user,
        token,
        loaded,
        isAuthenticated,
        fetchUser,
        logout,
    }
}
