import { paymentAssets } from '../../data/payments'
import { useMultiPrice } from '../../hooks/useMultiPrice'

function sumHeld(records) {
  return records.reduce((sum, r) => sum + parseFloat(String(r.amount).replace('+', '')), 0)
}

function formatCoin(n) {
  return n.toLocaleString(undefined, { maximumFractionDigits: n < 1 ? 6 : 4 })
}

function formatUsd(n) {
  return `$${n.toLocaleString(undefined, { maximumFractionDigits: 2 })}`
}

export default function PortfolioTotal() {
  const ids = paymentAssets.map((a) => a.coingeckoId)
  const { prices, status } = useMultiPrice(ids)

  const rows = paymentAssets.map((asset) => {
    const held = sumHeld(asset.records)
    const price = prices[asset.coingeckoId] ?? null
    const value = price !== null ? held * price : null
    return { ...asset, held, price, value }
  })

  const anyPriced = rows.some((r) => r.value !== null)
  const total = rows.reduce((sum, r) => sum + (r.value ?? 0), 0)

  return (
    <div className="border border-line rounded-2xl bg-surface p-6 mb-10 flex flex-wrap items-center justify-between gap-8">
      <div>
        <p className="mono-tag text-[11px] text-dim mb-1">Total portfolio value (live)</p>
        <p className="font-display text-3xl md:text-4xl text-bone">
          {anyPriced ? formatUsd(total) : status === 'error' ? '—' : '…'}
        </p>
      </div>

      <div className="flex flex-wrap gap-8">
        {rows.map((r) => (
          <div key={r.id} className="text-right">
            <p className="mono-tag text-[11px] text-dim">{r.name} held</p>
            <p className="font-display text-lg text-bone leading-tight">
              {formatCoin(r.held)} {r.name}
            </p>
            <p className="mono-tag text-xs text-dim">
              {r.value !== null ? `≈ ${formatUsd(r.value)}` : status === 'error' ? 'unavailable' : 'pricing…'}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
