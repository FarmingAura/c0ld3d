import { useEffect, useRef } from 'react'
import { gsap, ScrollTrigger } from '../../lib/gsapSetup'
import { paymentAssets } from '../../data/payments'
import AssetPanel from './AssetPanel'
import PortfolioTotal from './PortfolioTotal'

export default function PaymentProofs() {
  const rootRef = useRef(null)

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) return

    const ctx = gsap.context(() => {
      gsap.from('.asset-panel', {
        y: 40,
        opacity: 0,
        duration: 0.7,
        stagger: 0.15,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: rootRef.current,
          start: 'top 72%',
        },
      })
    }, rootRef)

    return () => ctx.revert()
  }, [])

  return (
    <section id="payments" ref={rootRef} className="relative px-6 md:px-12 py-28 md:py-36 border-t border-line">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-baseline gap-3 mb-4">
          <span className="mono-tag text-signal text-xs">05</span>
          <h2 className="font-display text-3xl md:text-4xl text-bone">Payment Proofs</h2>
        </div>
        <p className="text-dim max-w-lg mb-14">
          Real receive confirmations from clients, plus a live market view of each asset's value.
        </p>

        <PortfolioTotal />

        <div className="grid lg:grid-cols-2 gap-8">
          {paymentAssets.map((asset) => (
            <div key={asset.id} className="asset-panel">
              <AssetPanel asset={asset} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
