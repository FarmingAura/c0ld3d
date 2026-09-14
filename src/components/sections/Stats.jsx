import { useEffect, useRef } from 'react'
import { gsap, ScrollTrigger } from '../../lib/gsapSetup'
import { stats } from '../../data/site'

export default function Stats() {
  const rootRef = useRef(null)

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const ctx = gsap.context(() => {
      const nums = gsap.utils.toArray('.stat-num')

      if (prefersReduced) {
        nums.forEach((el) => {
          const target = Number(el.dataset.value)
          el.textContent = target + el.dataset.suffix
        })
        return
      }

      nums.forEach((el) => {
        const target = Number(el.dataset.value)
        const isInfinite = el.dataset.infinite === 'true'
        if (isInfinite) return

        const counter = { val: 0 }
        gsap.to(counter, {
          val: target,
          duration: 1.6,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 85%',
          },
          onUpdate: () => {
            el.textContent = Math.round(counter.val) + el.dataset.suffix
          },
        })
      })

      gsap.from('.stat-item', {
        y: 30,
        opacity: 0,
        duration: 0.7,
        stagger: 0.1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: rootRef.current,
          start: 'top 78%',
        },
      })
    }, rootRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={rootRef} className="relative px-6 md:px-12 py-24 md:py-32 border-t border-line">
      <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4">
        {stats.map((s) => (
          <div key={s.label} className="stat-item text-center md:text-left">
            <p
              className="stat-num font-display text-4xl md:text-6xl text-bone mb-2"
              data-value={s.value}
              data-suffix={s.suffix}
              data-infinite={s.isInfinite ? 'true' : 'false'}
            >
              {s.isInfinite ? '∞' : `0${s.suffix}`}
            </p>
            <p className="mono-tag text-xs text-dim">{s.label}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
