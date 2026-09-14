import { useEffect, useRef } from 'react'
import { gsap, ScrollTrigger } from '../../lib/gsapSetup'
import { skillGroups } from '../../data/site'
import MaskReveal from '../MaskReveal'

export default function Skills() {
  const rootRef = useRef(null)

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) return

    const ctx = gsap.context(() => {
      gsap.utils.toArray('.skill-col').forEach((col, i) => {
        gsap.from(col, {
          y: 40,
          opacity: 0,
          duration: 0.8,
          delay: i * 0.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: col,
            start: 'top 82%',
          },
        })
      })
    }, rootRef)

    return () => ctx.revert()
  }, [])

  return (
    <section id="skills" ref={rootRef} className="relative px-6 md:px-12 py-28 md:py-36 border-t border-line">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-baseline gap-3 mb-14">
          <span className="mono-tag text-signal text-xs">02</span>
          <MaskReveal as="h2" className="font-display text-3xl md:text-4xl text-bone">Expertise</MaskReveal>
        </div>

        <div className="grid md:grid-cols-3 gap-10 md:gap-8">
          {skillGroups.map((group) => (
            <div key={group.title} className="skill-col">
              <h3 className="text-bone font-display text-lg mb-5 pb-4 border-b border-line">{group.title}</h3>
              <ul className="space-y-3">
                {group.items.map((item) => (
                  <li
                    key={item}
                    className="text-dim text-sm flex items-center gap-3 hover:text-bone transition-colors duration-200"
                  >
                    <span className="w-1 h-1 rounded-full bg-signal shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
