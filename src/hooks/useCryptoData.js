import { useEffect, useRef, useState } from 'react'

const PRICE_URL = (id) =>
  `https://api.coingecko.com/api/v3/simple/price?ids=${id}&vs_currencies=usd&include_24hr_change=true`

const CHART_URL = (id) => `https://api.coingecko.com/api/v3/coins/${id}/market_chart?vs_currency=usd&days=1`

const POLL_MS = 60_000

export function useLiveAsset(coingeckoId) {
  const [price, setPrice] = useState(null)
  const [change24h, setChange24h] = useState(null)
  const [series, setSeries] = useState(null)
  const [status, setStatus] = useState('loading') // loading | ok | error
  const mounted = useRef(true)

  useEffect(() => {
    mounted.current = true

    async function fetchAll() {
      try {
        const [priceRes, chartRes] = await Promise.all([
          fetch(PRICE_URL(coingeckoId)),
          fetch(CHART_URL(coingeckoId)),
        ])
        if (!priceRes.ok || !chartRes.ok) throw new Error('bad response')

        const priceJson = await priceRes.json()
        const chartJson = await chartRes.json()

        if (!mounted.current) return

        const p = priceJson?.[coingeckoId]?.usd
        const c = priceJson?.[coingeckoId]?.usd_24h_change

        const points = (chartJson?.prices || []).map(([t, v]) => ({ t, v }))

        setPrice(typeof p === 'number' ? p : null)
        setChange24h(typeof c === 'number' ? c : null)
        setSeries(points.length ? points : null)
        setStatus('ok')
      } catch (err) {
        if (mounted.current) setStatus('error')
      }
    }

    fetchAll()
    const interval = setInterval(fetchAll, POLL_MS)

    return () => {
      mounted.current = false
      clearInterval(interval)
    }
  }, [coingeckoId])

  return { price, change24h, series, status }
}
