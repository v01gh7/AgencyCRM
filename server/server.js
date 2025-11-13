import express from 'express'
import fetch from 'node-fetch'
import cors from 'cors'
import dotenv from 'dotenv';
dotenv.config();

const app = express()
app.use(cors())
app.use(express.json())

// Developer token берём из env
const DEVELOPER_TOKEN = process.env.GOOGLE_ADS_DEV_TOKEN
if (!DEVELOPER_TOKEN) {
  console.warn('⚠️ GOOGLE_DEVELOPER_TOKEN не задан в .env')
}

/**
 * Универсальный endpoint для проксирования Google Ads API v22
 * POST /api/google-ads
 * body = { endpoint: string, method?: 'GET'|'POST', query?: any }
 * headers: { Authorization: 'Bearer <token>' }
 */
app.post('/api/google-ads', async (req, res) => {
  const { endpoint, method = 'GET', query } = req.body
  const token = req.headers.authorization

  if (!token) return res.status(400).json({ error: 'Authorization header missing' })
  if (!endpoint) return res.status(400).json({ error: 'Endpoint missing' })

  
  try {
    // Составляем корректный URL для v22
    const url = endpoint.startsWith('https://')
      ? endpoint
      : `https://googleads.googleapis.com/v22/${endpoint}`

    const fetchOptions = {
      method,
      headers: {
        Authorization: token,
        'developer-token': DEVELOPER_TOKEN,
        'Content-Type': 'application/json'
      }
    }

    console.log(`Proxying Google Ads API request to endpoint: ${endpoint}`)
    console.log(`Proxying Google Ads API request to endpoint url: ${url}`)


    if (method.toUpperCase() === 'POST' && query) {
      fetchOptions.body = JSON.stringify(query)
    }

    const response = await fetch(url, fetchOptions)
    const data = await response.json()
    res.json(data)
  } catch (err) {
    console.error('Google Ads proxy error:', err)
    res.status(500).json({ error: err.message })
  }
})

app.listen(3000, () => console.log('Server running on http://localhost:3000'))
