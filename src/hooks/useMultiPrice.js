import { useEffect, useRef, useState } from 'react'

const PRICE_URL = (ids) =>
  `https://api.coingecko.com/api/v3/simple/price?ids=${ids.join(',')}&vs_currencies=usd`

const POLL_MS = 60_000

// Fetches live USD prices for several coingecko ids at once (one request instead of N).
export function useMultiPrice(ids) {
  const [prices, setPrices] = useState({})
  const [status, setStatus] = useState('loading') // loading | ok | error
  const mounted = useRef(true)
  const idsKey = ids.join(',')

  useEffect(() => {
    mounted.current = true

    async function fetchAll() {
      try {
        const res = await fetch(PRICE_URL(ids))
        if (!res.ok) throw new Error('bad response')

        const json = await res.json()
        if (!mounted.current) return

        const next = {}
        ids.forEach((id) => {
          const p = json?.[id]?.usd
          if (typeof p === 'number') next[id] = p
        })

        setPrices(next)
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idsKey])

  return { prices, status }
}
