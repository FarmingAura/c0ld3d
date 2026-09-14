import { useEffect, useRef } from 'react'
import { gsap, ScrollTrigger } from '../../lib/gsapSetup'
import { timeline } from '../../data/site'
import MaskReveal from '../MaskReveal'

export default function Experience() {
  const rootRef = useRef(null)
  const lineRef = useRef(null)

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) return

    const ctx = gsap.context(() => {
      gsap.from('.tl-item', {
        x: -24,
        opacity: 0,
        duration: 0.7,
        stagger: 0.15,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: rootRef.current,
          start: 'top 70%',
        },
      })

      gsap.fromTo(
        lineRef.current,
        { scaleY: 0 },
        {
          scaleY: 1,
          transformOrigin: 'top',
          ease: 'none',
          scrollTrigger: {
            trigger: rootRef.current,
            start: 'top 70%',
            end: 'bottom 60%',
            scrub: 0.6,
          },
        }
      )
    }, rootRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      id="experience"
      ref={rootRef}
      className="relative px-6 md:px-12 py-28 md:py-36 border-t border-line"
    >
      <div className="max-w-4xl mx-auto">
        <div className="flex items-baseline gap-3 mb-16">
          <span className="mono-tag text-signal text-xs">03</span>
          <MaskReveal as="h2" className="font-display text-3xl md:text-4xl text-bone">Experience</MaskReveal>
        </div>

        <div className="relative pl-8 md:pl-12">
          <div className="absolute left-0 top-1 bottom-1 w-px bg-line" />
          <div ref={lineRef} className="absolute left-0 top-1 bottom-1 w-px bg-signal" />

          <div className="space-y-14">
            {timeline.map((item) => (
              <div key={item.title} className="tl-item relative">
                <div className="absolute -left-[35px] md:-left-[51px] top-1 w-2.5 h-2.5 rounded-full bg-signal ring-4 ring-ink" />
                <p className="mono-tag text-xs text-signal mb-2">{item.year}</p>
                <h3 className="font-display text-xl md:text-2xl text-bone mb-2">{item.title}</h3>
                <p className="text-dim leading-relaxed max-w-lg">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
