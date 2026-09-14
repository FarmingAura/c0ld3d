import { useState } from 'react'
import { Area, AreaChart, ResponsiveContainer, Tooltip, YAxis } from 'recharts'
import { ArrowDownRight, ArrowUpRight, X } from 'lucide-react'
import { useLiveAsset } from '../../hooks/useCryptoData'

function PriceTooltip({ active, payload }) {
  if (!active || !payload?.length) return null
  const { t, v } = payload[0].payload
  return (
    <div className="bg-surface2 border border-line rounded-lg px-3 py-2 text-xs mono-tag text-bone">
      <p className="text-dim mb-1">{new Date(t).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
      <p>${v.toFixed(v < 1 ? 4 : 2)}</p>
    </div>
  )
}

export default function AssetPanel({ asset }) {
  const { price, change24h, series, status } = useLiveAsset(asset.coingeckoId)
  const [lightbox, setLightbox] = useState(null)
  const isUp = (change24h ?? 0) >= 0

  const totalHeld = asset.records.reduce(
    (sum, r) => sum + parseFloat(String(r.amount).replace('+', '')),
    0
  )
  const totalValue = price !== null ? totalHeld * price : null

  return (
    <div className="border border-line rounded-2xl overflow-hidden bg-surface">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-6 border-b border-line">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center font-display font-semibold text-sm text-ink shrink-0"
            style={{ backgroundColor: asset.accent }}
          >
            {asset.name.slice(0, 1)}
          </div>
          <div>
            <p className="text-bone font-display text-lg leading-tight">{asset.fullName}</p>
            <p className="mono-tag text-[11px] text-dim">{asset.name} / USD</p>
          </div>
        </div>

        <div className="text-right">
          {status === 'loading' && <p className="mono-tag text-sm text-dim">fetching price…</p>}
          {status === 'error' && <p className="mono-tag text-sm text-dim">live price unavailable</p>}
          {status === 'ok' && price !== null && (
            <>
              <p className="font-display text-2xl text-bone">
                ${price < 1 ? price.toFixed(4) : price.toLocaleString(undefined, { maximumFractionDigits: 2 })}
              </p>
              {change24h !== null && (
                <p className={`mono-tag text-xs flex items-center justify-end gap-1 ${isUp ? 'text-signal2' : 'text-dim'}`}>
                  {isUp ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                  {Math.abs(change24h).toFixed(2)}% / 24h
                </p>
              )}
              <p className="mono-tag text-[11px] text-dim mt-1">
                Holding {totalHeld.toLocaleString(undefined, { maximumFractionDigits: totalHeld < 1 ? 6 : 4 })} {asset.name}
                {totalValue !== null &&
                  ` ≈ $${totalValue.toLocaleString(undefined, { maximumFractionDigits: 2 })}`}
              </p>
            </>
          )}
        </div>
      </div>

      {/* Live chart */}
      <div className="h-40 px-2 pt-4">
        {series ? (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={series} margin={{ top: 0, right: 8, left: 8, bottom: 0 }}>
              <defs>
                <linearGradient id={`grad-${asset.id}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={asset.accent} stopOpacity={0.35} />
                  <stop offset="100%" stopColor={asset.accent} stopOpacity={0} />
                </linearGradient>
              </defs>
              <YAxis domain={['auto', 'auto']} hide />
              <Tooltip content={<PriceTooltip />} />
              <Area
                type="monotone"
                dataKey="v"
                stroke={asset.accent}
                strokeWidth={2}
                fill={`url(#grad-${asset.id})`}
                isAnimationActive={true}
                animationDuration={800}
              />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <p className="mono-tag text-xs text-dim">
              {status === 'error' ? 'chart unavailable right now' : 'loading 24h chart…'}
            </p>
          </div>
        )}
      </div>

      {/* Records */}
      <div className="px-6 pt-6">
        <p className="mono-tag text-[11px] text-dim mb-3">Recent receives</p>
        <div className="divide-y divide-line border-t border-line">
          {asset.records.map((r, i) => (
            <div key={i} className="flex items-center justify-between py-3">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-signal2" />
                <span className="text-sm text-bone">Receive</span>
              </div>
              <span className="mono-tag text-sm text-signal2">
                {r.amount} {r.unit}
              </span>
              <span className="mono-tag text-xs text-dim">{r.date || '—'}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Screenshots */}
      <div className="p-6">
        <p className="mono-tag text-[11px] text-dim mb-3">Screenshot proof</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {asset.screenshots.map((src) => (
            <button
              key={src}
              onClick={() => setLightbox(src)}
              data-cursor="hover"
              className="group relative rounded-xl overflow-hidden border border-line bg-surface2 aspect-[3/1] sm:aspect-square"
            >
              <img
                src={src}
                alt={`${asset.fullName} payment proof screenshot`}
                loading="lazy"
                className="w-full h-full object-cover object-left transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-ink/0 group-hover:bg-ink/20 transition-colors duration-300" />
            </button>
          ))}
        </div>
      </div>

      {lightbox && (
        <div
          className="fixed inset-0 z-[90] bg-ink/90 backdrop-blur-sm flex items-center justify-center p-6"
          onClick={() => setLightbox(null)}
        >
          <button
            className="absolute top-6 right-6 text-bone hover:text-signal transition-colors"
            onClick={() => setLightbox(null)}
            aria-label="Close"
          >
            <X size={28} />
          </button>
          <img
            src={lightbox}
            alt="Payment proof enlarged"
            className="max-w-full max-h-full rounded-xl border border-line"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  )
}
