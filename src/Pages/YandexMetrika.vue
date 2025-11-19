<template>
  <div class="min-h-screen p-6 bg-gradient-to-br from-[var(--mainColor)] via-[var(--secondColor)] to-[var(--fourthColor)]">
    <h1 class="text-3xl font-bold mb-6 text-[var(--text-color)]">Дашборд — Yandex.Metrika</h1>

    <div v-if="!token.valueOf" class="text-white">
      ❌ Нет Yandex токена. Подключите аккаунт в настройках.
    </div>

    <div v-else>
      <div class="flex gap-3 items-center mb-4">
        <div v-if="loading" class="text-white">Загрузка данных...</div>
        <div v-if="error" class="text-red-300">Ошибка: {{ error }}</div>
        <button class="btn-primary ml-auto" @click="refresh">Обновить</button>
      </div>

      <div v-if="counters.length === 0 && !loading" class="text-white-300">
        Не найдено ни одного счётчика.
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div
          v-for="counter in counters"
          :key="counter.id"
          class="glass p-4 rounded-xl shadow-md border border-[var(--glass-border)]"
        >
          <div class="flex items-start justify-between gap-3">
            <div>
              <h3 class="font-semibold mb-1 text-white">{{ counter.name || `Счётчик ${counter.id}` }}</h3>
              <p class="text-sm text-white-300 mb-2">ID: {{ counter.id }}</p>
              <p class="text-xs text-white-300 mb-2">Часовой пояс: {{ counter.time_zone || '—' }}</p>
              <p class="text-xs text-white-300">URL: <span class="break-all">{{ counter.site }}</span></p>
            </div>

            <div class="text-right">
              <span class="text-sm text-white-300">Статус</span>
              <div :class="['status-badge', counterStatusColor(counter)]" style="margin-top:6px">
                {{ counterStatusText(counter) }}
              </div>
            </div>
          </div>

          <hr class="my-3 border-[rgba(255,255,255,0.06)]" />

          <div class="grid grid-cols-2 gap-3">
            <div class="p-3 bg-[var(--glass-bg)] rounded">
              <div class="text-sm text-white-300">Посещения</div>
              <div class="text-xl font-semibold text-white">{{ formatNumber(metricsMap[counter.id]?.visits) }}</div>
            </div>
            <div class="p-3 bg-[var(--glass-bg)] rounded">
              <div class="text-sm text-white-300">Пользователи</div>
              <div class="text-xl font-semibold text-white">{{ formatNumber(metricsMap[counter.id]?.users) }}</div>
            </div>
            <div class="p-3 bg-[var(--glass-bg)] rounded">
              <div class="text-sm text-white-300">Просмотры</div>
              <div class="text-xl font-semibold text-white">{{ formatNumber(metricsMap[counter.id]?.pageviews) }}</div>
            </div>
            <div class="p-3 bg-[var(--glass-bg)] rounded">
              <div class="text-sm text-white-300">Отказ</div>
              <div class="text-xl font-semibold text-white">{{ formatPercent(metricsMap[counter.id]?.bounce) }}</div>
            </div>
          </div>

          <div class="mt-3 flex gap-2">
            <button class="btn-primary" @click="loadCounterDetails(counter.id)">Подробно</button>
            <button class="ml-auto px-3 py-1 rounded border text-sm text-white-300" @click="exportCSV(counter.id)">Экспорт CSV</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useLocalStorage } from '@vueuse/core'

/**
 * Компонент для получения аналитики из Yandex.Metrika через бэкенд-прокси.
 * Ожидается, что бэкенд принимает POST /api/yandex-metrika
 * body: { endpoint: string, method?: 'GET'|'POST', params?: object }
 * и пересылает запрос к Yandex API, добавляя Authorization: Bearer <token>
 *
 * BACK_URL берём из env (VITE_APP_BACK_URL) или используем localhost:3000 по умолчанию
 */

const token = useLocalStorage('yandex_token', '')
const BACK_URL = import.meta.env.VITE_APP_BACK_URL || 'http://localhost:3000'

type Counter = {
  id: number
  name?: string
  site?: string
  time_zone?: string
  // ... other fields from management API
}

const counters = ref<Counter[]>([])
const loading = ref(false)
const error = ref<string | null>(null)

// metricsMap: { [counterId]: { visits, users, pageviews, bounce } }
const metricsMap = ref<Record<number, { visits: number; users: number; pageviews: number; bounce: number }>>({})

/** Утилиты */
function formatNumber(v?: number) {
  if (!v && v !== 0) return '—'
  return String(Math.round(v))
}
function formatPercent(v?: number) {
  if (!v && v !== 0) return '—'
  return `${Number(v).toFixed(2)}%`
}

/** Backend proxy request helper */
async function proxyRequest(options: { endpoint: string; method?: 'GET' | 'POST'; params?: any }) {
  const res = await fetch(`${BACK_URL}/api/yandex-metrika`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token.value}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      endpoint: options.endpoint,
      method: options.method || 'GET',
      params: options.params || {},
    }),
  })

  if (!res.ok) {
    const text = await res.text().catch(() => 'unknown')
    throw new Error(`Proxy error ${res.status}: ${text}`)
  }

  return res.json()
}

/** Получаем список счётчиков (management API) */
async function fetchCounters() {
  error.value = null
  loading.value = true
  try {
    // Ожидаем, что бэкенд выполнит GET https://api-metrika.yandex.net/management/v1/counters
    const data = await proxyRequest({ endpoint: 'management/v1/counters', method: 'GET' })
    // data.counters — ожидаемая форма в API Yandex
    counters.value = Array.isArray(data.counters) ? data.counters.map((c: any) => ({
      id: c.id,
      name: c.name,
      site: c.site,
      time_zone: c.time_zone,
    })) : []
    // После получения счётчиков — подгружаем метрики для каждого
    await Promise.all(counters.value.map(c => fetchMetricsForCounter(c.id)))
  } catch (err: any) {
    console.error('fetchCounters error', err)
    error.value = err?.message || 'Неизвестная ошибка'
  } finally {
    loading.value = false
  }
}

/** Для простоты — получаем базовые метрики за последние 7 дней (stat/v1/data) */
async function fetchMetricsForCounter(counterId: number) {
  try {
    // Yandex stat endpoint: /stat/v1/data?ids={id}&metrics=ym:s:visits,ym:s:users,ym:s:pageviews,ym:s:bounceRate&date1=...&date2=...
    const to = new Date()
    const from = new Date()
    from.setDate(to.getDate() - 7)
    const date1 = from.toISOString().slice(0, 10)
    const date2 = to.toISOString().slice(0, 10)

    const params = {
      ids: String(counterId),
      metrics: 'ym:s:visits,ym:s:users,ym:s:pageviews,ym:s:bounceRate',
      group: 'day',
      date1,
      date2,
      // дополнительные опции при необходимости
    }

    const data = await proxyRequest({
      endpoint: 'stat/v1/data',
      method: 'GET',
      params,
    })

    // Yandex возвращает структуру с data и totals либо with 'totals' field
    // Попробуем получить суммарные значения: data.totals или data.totals[0]
    let visits = 0, users = 0, pageviews = 0, bounce = 0
    if (data.totals && Array.isArray(data.totals) && data.totals.length > 0) {
      // Обычно totals — массив строк чисел
      const t = data.totals[0]
      visits = Number(t[0] ?? 0)
      users = Number(t[1] ?? 0)
      pageviews = Number(t[2] ?? 0)
      bounce = Number(t[3] ?? 0)
    } else if (Array.isArray(data.data) && data.data.length > 0) {
      // как fallback — суммируем по дням
      for (const row of data.data) {
        const metrics = row?.metrics?.[0] ?? []
        visits += Number(metrics[0] ?? 0)
        users += Number(metrics[1] ?? 0)
        pageviews += Number(metrics[2] ?? 0)
        bounce += Number(metrics[3] ?? 0)
      }
      if (data.data.length > 0) bounce = bounce / data.data.length // средний bounce
    }

    metricsMap.value[counterId] = {
      visits,
      users,
      pageviews,
      bounce,
    }
  } catch (err) {
    console.warn('fetchMetricsForCounter error', err)
    metricsMap.value[counterId] = { visits: 0, users: 0, pageviews: 0, bounce: 0 }
  }
}

/** Подгружаем подробности счётчика (можно роутить на детальную страницу) */
async function loadCounterDetails(counterId: number) {
  // Здесь можно реализовать подробный запрос (сегменты, источники, цели)
  // Пока просто откроем консоль и подгрузим метрики ещё раз
  loading.value = true
  await fetchMetricsForCounter(counterId)
  loading.value = false
  // в реале: router.push(`/counters/${counterId}`)
}

/** Экспорт CSV: запрос на бек, который сам сформирует CSV и вернёт ссылку (или стрим) */
async function exportCSV(counterId: number) {
  try {
    loading.value = true
    const data = await proxyRequest({
      endpoint: 'stat/v1/data',
      method: 'GET',
      params: {
        ids: String(counterId),
        metrics: 'ym:s:visits,ym:s:users,ym:s:pageviews,ym:s:bounceRate',
        date1: new Date(Date.now() - 7 * 24 * 3600 * 1000).toISOString().slice(0, 10),
        date2: new Date().toISOString().slice(0, 10),
        // можно добавить format=csv, но многие API возвращают JSON — бек должен преобразовать
      },
    })

    // если бек вернёт URL в data.download_url — откроем
    if (data.download_url) {
      window.open(data.download_url, '_blank')
    } else {
      // fallback: скачиваем JSON как файл
      const blob = new Blob([JSON.stringify(data)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `metrika-${counterId}.json`
      a.click()
      URL.revokeObjectURL(url)
    }
  } catch (err: any) {
    console.error('exportCSV error', err)
    error.value = err?.message || 'Не удалось экспортировать'
  } finally {
    loading.value = false
  }
}

/** Статус счётчика (условно) */
function counterStatusText(c: Counter) {
  // Если есть site — считаем активен. Можно расширить по полям из API.
  return c.site ? 'ACTIVE' : 'UNKNOWN'
}
function counterStatusColor(c: Counter) {
  return c.site ? 'status-enabled' : 'status-unknown'
}

/** Обновить вручную */
async function refresh() {
  await fetchCounters()
}

/** Инициализация */
onMounted(async () => {
  if (!token.value) return
  await fetchCounters()
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
  padding: 4px 8px;
  border-radius: 6px;
  font-weight: 600;
  font-size: 12px;
}
.status-enabled {
  background-color: #34d399; /* зеленый */
  color: #065f46;
}
.status-unknown {
  background-color: #9ca3af; /* серый */
  color: #111827;
}

/* Кнопки / базовый стиль */
.btn-primary {
  inline-size: auto;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border-radius: 8px;
  font-weight: 600;
  color: white;
  background: var(--btn-gradient);
  box-shadow: var(--btn-shadow);
}
</style>
