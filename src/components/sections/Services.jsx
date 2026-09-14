import { useEffect, useRef } from 'react'
import { gsap, ScrollTrigger } from '../../lib/gsapSetup'
import { services } from '../../data/site'
import TiltPanel from '../TiltPanel'
import MaskReveal from '../MaskReveal'

export default function Services() {
  const rootRef = useRef(null)

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) return

    const ctx = gsap.context(() => {
      gsap.from('.service-row', {
        y: 24,
        opacity: 0,
        duration: 0.6,
        stagger: 0.08,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: rootRef.current,
          start: 'top 75%',
        },
      })
    }, rootRef)

    return () => ctx.revert()
  }, [])

  return (
    <section className="relative px-6 md:px-12 py-28 md:py-36 border-t border-line">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-baseline gap-3 mb-14">
          <span className="mono-tag text-signal text-xs">04</span>
          <MaskReveal as="h2" className="font-display text-3xl md:text-4xl text-bone">What I build</MaskReveal>
        </div>

        <div className="divide-y divide-line border-t border-b border-line">
          {services.map((s, i) => (
            <TiltPanel key={s.title} maxTilt={2.5}>
              <div
                data-cursor="view"
                className="service-row group flex flex-col md:flex-row md:items-center gap-2 md:gap-8 py-6 hover:pl-3 transition-all duration-300"
              >
                <span className="mono-tag text-xs text-dim w-10 shrink-0">{String(i + 1).padStart(2, '0')}</span>
                <h3 className="font-display text-xl md:text-2xl text-bone md:w-72 shrink-0 group-hover:text-signal transition-colors duration-300">
                  {s.title}
                </h3>
                <p className="text-dim text-sm md:text-base">{s.body}</p>
              </div>
            </TiltPanel>
          ))}
        </div>
      </div>
    </section>
  )
}
