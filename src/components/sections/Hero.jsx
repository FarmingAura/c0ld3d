import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ArrowDown, ArrowUpRight } from 'lucide-react'
import { profile } from '../../data/site'
import Magnetic from '../Magnetic'

export default function Hero() {
  const rootRef = useRef(null)
  const nameRef = useRef(null)

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

      if (prefersReduced) {
        gsap.set(['.hero-word', '.hero-line', '.hero-cta', '.hero-tag'], { opacity: 1, y: 0 })
        return
      }

      tl.set(rootRef.current, { autoAlpha: 1 })
        .from('.hero-tag', { y: 16, opacity: 0, duration: 0.6 })
        .from(
          '.hero-word',
          {
            y: '110%',
            opacity: 0,
            duration: 0.9,
            stagger: 0.08,
          },
          '-=0.3'
        )
        .from('.hero-line', { y: 20, opacity: 0, duration: 0.7, stagger: 0.12 }, '-=0.5')
        .from('.hero-cta', { y: 16, opacity: 0, duration: 0.6, stagger: 0.1 }, '-=0.4')
        .from('.hero-scroll', { opacity: 0, duration: 0.6 }, '-=0.2')

      // subtle idle glow drift
      gsap.to('.hero-glow', {
        x: 40,
        y: 20,
        duration: 8,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      })
    }, rootRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      id="home"
      ref={rootRef}
      className="relative min-h-[100svh] flex flex-col justify-center px-6 md:px-12 pt-28 pb-16 invisible"
      style={{ visibility: 'visible' }}
    >
      <div
        className="hero-glow absolute top-1/3 left-1/4 w-[500px] h-[500px] rounded-full opacity-[0.12] blur-[130px] pointer-events-none"
        style={{ background: 'radial-gradient(circle, #e4322c 0%, transparent 70%)' }}
      />

      <div className="max-w-5xl mx-auto w-full">
        <p className="hero-tag mono-tag text-signal text-xs mb-6">{profile.tagline}</p>

        <h1
          ref={nameRef}
          className="font-display font-semibold text-[18vw] leading-[0.85] md:text-[9rem] tracking-tightest text-bone mb-8 overflow-hidden"
        >
          <span className="inline-block overflow-hidden">
            <span className="hero-word inline-block">{profile.alias}</span>
          </span>
        </h1>

        <div className="max-w-xl mb-10">
          <p className="hero-line text-dim text-base md:text-lg leading-relaxed">{profile.intro}</p>
        </div>

        <p className="hero-line mono-tag text-xs text-dim/80 mb-10">{profile.stats}</p>

        <div className="flex flex-wrap items-center gap-4">
          <Magnetic className="hero-cta">
            <a
              href="#payments"
              data-cursor="view"
              className="group inline-flex items-center gap-2 bg-bone text-ink px-6 py-3.5 rounded-full text-sm font-medium hover:bg-signal transition-colors duration-300"
            >
              Payment Proofs
              <ArrowUpRight size={16} className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          </Magnetic>
          <Magnetic className="hero-cta">
            <a
              href="#contact"
              data-cursor="open"
              className="inline-flex items-center gap-2 border border-line text-bone px-6 py-3.5 rounded-full text-sm font-medium hover:border-signal hover:text-signal transition-colors duration-300"
            >
              Contact Me
            </a>
          </Magnetic>
        </div>
      </div>

      <div className="hero-scroll absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-dim">
        <span className="mono-tag text-[10px]">SCROLL</span>
        <ArrowDown size={14} className="animate-bounce" />
      </div>
    </section>
  )
}
