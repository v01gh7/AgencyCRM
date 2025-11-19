<template>
  <div class="min-h-screen p-6 bg-gradient-to-br from-[var(--mainColor)] via-[var(--secondColor)] to-[var(--fourthColor)]">
    <h1 class="text-3xl font-bold mb-6 text-[var(--text-color)]">Дашборд Google Ads</h1>

    <div v-if="!userStore.isAuthenticated" class="text-white">
      ❌ Нет токена или пользователь не авторизован. Пожалуйста, войдите.
    </div>

    <div v-else>
      <div v-if="loading" class="text-white mb-4">Загрузка отчётов...</div>

      <div v-for="(account, index) in accounts" :key="index" class="mb-6">
        <h2 class="text-xl font-semibold mb-2 text-white">Аккаунт: {{ account.customerId }}</h2>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <!-- Кампании -->
          <div
            v-for="camp in account.campaigns"
            :key="camp.campaignId"
            class="glass p-4 rounded-xl shadow-md border border-[var(--glass-border)]"
          >
            <h3 class="font-semibold mb-1 text-white">{{ camp.name }}</h3>
            <span :class="['status-badge', statusColor(camp.status)]">{{ camp.status }}</span>
            <p class="text-sm text-white-300 mb-1">Показы: {{ camp.impressions }}</p>
            <p class="text-sm text-white-300 mb-1">Клики: {{ camp.clicks }}</p>
            <p class="text-sm text-white-300">CTR: {{ camp.ctr }}%</p>
          </div>

          <!-- Группы объявлений -->
          <div
            v-for="adg in account.adGroups"
            :key="adg.adGroupId"
            class="glass p-4 rounded-xl shadow-md border border-[var(--glass-border)]"
          >
            <h3 class="font-semibold mb-1 text-white">{{ adg.name }}</h3>
            <span :class="['status-badge', statusColor(adg.status)]">{{ adg.status }}</span>
            <p class="text-sm text-white-300 mb-1">Показы: {{ adg.impressions }}</p>
            <p class="text-sm text-white-300 mb-1">Клики: {{ adg.clicks }}</p>
            <p class="text-sm text-white-300">CTR: {{ adg.ctr }}%</p>
          </div>
        </div>
      </div>

      <button
        class="mt-6 px-4 py-2 bg-red-500 text-white rounded shadow-md hover:brightness-110"
        @click="logout"
      >
        Выйти
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useLocalStorage } from '@vueuse/core'
import { useUserStore } from '@/stores/useUserStore'
import { googleConfig } from '@/config/google'

interface Campaign {
  campaignId: string
  name: string
  status: string
  impressions: number
  clicks: number
  ctr: number
}

interface AdGroup {
  adGroupId: string
  name: string
  status: string
  impressions: number
  clicks: number
  ctr: number
}

interface Account {
  customerId: string
  campaigns: Campaign[]
  adGroups: AdGroup[]
}

const userStore = useUserStore()
const token = useLocalStorage('google_token', '')

const accounts = ref<Account[]>([])
const loading = ref(false)

const BACK_URL = import.meta.env.VITE_APP_BACK_URL || 'http://localhost:3000'

async function fetchGAQL(customerId: string, query: string) {
  const res = await fetch(`${BACK_URL}/api/google-ads`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token.value}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
		endpoint: `customers/${customerId}/googleAds:search`,
		query: { query },
		method: 'POST'
    }),
  })

  if (!res.ok) throw new Error(`Ошибка GAQL: ${res.status} ${res.statusText}`)
  const data = await res.json()
  return data.results || []
}

async function fetchReports() {
  if (!token.value) return
  loading.value = true

  try {
    // Получаем доступные аккаунты
    const res = await fetch(`${BACK_URL}/api/google-ads`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token.value}`, 'Content-Type': 'application/json', 'developer-token': googleConfig.googleAdsDevToken },
      body: JSON.stringify({ endpoint: 'customers:listAccessibleCustomers', method: 'GET' }),
    })
    const data = await res.json()
    const customerIds: string[] = data.resourceNames?.map((r: string) => r.split('/').pop()) || []

    accounts.value = []

    for (const customerId of customerIds) {
      const account: Account = { customerId, campaigns: [], adGroups: [] }

      // Кампании
      const campaignsQuery = `
        SELECT campaign.id, campaign.name, campaign.status, metrics.clicks, metrics.impressions
        FROM campaign
        ORDER BY campaign.id
        LIMIT 10
      `
      try {
        const campResults = await fetchGAQL(customerId, campaignsQuery)
        account.campaigns = campResults.map((r: any) => ({
          campaignId: r.campaign.id,
          name: r.campaign.name,
          status: r.campaign.status,
          impressions: r.metrics.impressions || 0,
          clicks: r.metrics.clicks || 0,
          ctr: r.metrics.impressions ? ((r.metrics.clicks / r.metrics.impressions) * 100).toFixed(2) : 0
        }))
      } catch (err) {
        console.error('Ошибка получения кампаний', err)
      }

      // Группы объявлений
      const adGroupsQuery = `
        SELECT ad_group.id, ad_group.name, ad_group.status, metrics.clicks, metrics.impressions
        FROM ad_group
        ORDER BY ad_group.id
        LIMIT 10
      `
      try {
        const adGroupResults = await fetchGAQL(customerId, adGroupsQuery)
        account.adGroups = adGroupResults.map((r: any) => ({
          adGroupId: r.adGroup.id,
          name: r.adGroup.name,
          status: r.adGroup.status,
          impressions: r.metrics.impressions || 0,
          clicks: r.metrics.clicks || 0,
          ctr: r.metrics.impressions ? ((r.metrics.clicks / r.metrics.impressions) * 100).toFixed(2) : 0
        }))
      } catch (err) {
        console.error('Ошибка получения групп объявлений', err)
      }

      accounts.value.push(account)
    }
  } catch (err) {
    console.error('Не удалось получить отчёты:', err)
  } finally {
    loading.value = false
  }
}

// Цвета статуса
function statusColor(status: string) {
  switch (status) {
    case 'ENABLED':
      return 'status-enabled'
    case 'PAUSED':
      return 'status-paused'
    case 'REMOVED':
      return 'status-removed'
    default:
      return 'status-unknown'
  }
}

function logout() {
  userStore.logout()
}

onMounted(async () => {
  if (userStore.isAuthenticated) {
    await fetchReports()
  }
})


definePageMeta({
  requiresAuth: true
})


</script>

<style scoped>
.glass {
  backdrop-filter: blur(8px);
  background-color: rgba(255, 255, 255, 0.05);
  border-radius: 1rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
}
.text-white-300 {
  color: rgba(255, 255, 255, 0.7);
}
.status-badge {
  display: inline-block;
  padding: 2px 6px;
}
.status-enabled {
  background-color: #34d399; /* зеленый */
  color: #065f46;
}
.status-paused {
  background-color: #facc15; /* желтый */
  color: #78350f;
}
.status-removed {
  background-color: #f87171; /* красный */
  color: #7f1d1d;
}
.status-unknown {
  background-color: #9ca3af; /* серый */
  color: #111827;
}
</style>
