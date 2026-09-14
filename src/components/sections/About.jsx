import { useEffect, useRef } from 'react'
import { gsap, ScrollTrigger } from '../../lib/gsapSetup'
import { aboutFacts, formerOrgs, profile } from '../../data/site'
import MaskReveal from '../MaskReveal'

export default function About() {
  const rootRef = useRef(null)

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) return

    const ctx = gsap.context(() => {
      gsap.from('.about-reveal', {
        y: 30,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
        stagger: 0.08,
        scrollTrigger: {
          trigger: rootRef.current,
          start: 'top 75%',
        },
      })
    }, rootRef)

    return () => ctx.revert()
  }, [])

  return (
    <section id="about" ref={rootRef} className="relative px-6 md:px-12 py-28 md:py-36 border-t border-line">
      <div className="max-w-5xl mx-auto">
        <div className="about-reveal flex items-baseline gap-3 mb-14">
          <span className="mono-tag text-signal text-xs">01</span>
          <MaskReveal as="h2" className="font-display text-3xl md:text-4xl text-bone">About / c0ld3d</MaskReveal>
        </div>

        <div className="grid md:grid-cols-[1.3fr_1fr] gap-14">
          <div className="about-reveal">
            <p className="text-lg md:text-xl text-bone leading-relaxed mb-6">
              A young developer who enjoys experimenting with code and building practical projects — from
              Discord automation to full Minecraft hosting environments.
            </p>
            <p className="text-dim leading-relaxed mb-10">
              {profile.intro} Still {aboutFacts.find((f) => f.label === 'Age')?.value} — the work speaks for
              itself.
            </p>

            <div className="space-y-4">
              <p className="mono-tag text-xs text-dim mb-3">Former Member</p>
              {formerOrgs.map((org) => (
                <div key={org.name} className="flex items-start gap-4 border-l border-line pl-4 py-1">
                  <div>
                    <p className="text-bone font-medium">{org.name}</p>
                    <p className="text-sm text-dim">{org.note}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="about-reveal grid grid-cols-2 gap-px bg-line rounded-2xl overflow-hidden self-start">
            {aboutFacts.map((f) => (
              <div key={f.label} className="bg-surface p-5">
                <p className="mono-tag text-[10px] text-dim mb-2">{f.label.toUpperCase()}</p>
                <p className="text-bone font-display text-lg">{f.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
