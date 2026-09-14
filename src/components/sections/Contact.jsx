import { useEffect, useRef, useState } from 'react'
import { ArrowUpRight, Check, Copy } from 'lucide-react'
import { gsap, ScrollTrigger } from '../../lib/gsapSetup'
import { profile } from '../../data/site'
import MaskReveal from '../MaskReveal'

export default function Contact() {
  const rootRef = useRef(null)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) return

    const ctx = gsap.context(() => {
      gsap.from('.contact-reveal', {
        y: 30,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: rootRef.current,
          start: 'top 75%',
        },
      })
    }, rootRef)

    return () => ctx.revert()
  }, [])

  const copyDiscord = async () => {
    try {
      await navigator.clipboard.writeText(profile.discord)
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } catch {
      /* clipboard unavailable */
    }
  }

  return (
    <section id="contact" ref={rootRef} className="relative px-6 md:px-12 py-28 md:py-40 border-t border-line">
      <div className="max-w-5xl mx-auto">
        <p className="contact-reveal mono-tag text-signal text-xs mb-6">Get In Touch</p>
        <div className="mb-8 max-w-3xl">
          <MaskReveal as="h2" className="font-display text-5xl md:text-7xl text-bone leading-[0.95] block">
            LET'S BUILD
          </MaskReveal>
          <MaskReveal as="h2" className="font-display text-5xl md:text-7xl text-signal leading-[0.95] block" delay={0.08}>
            SOMETHING.
          </MaskReveal>
        </div>
        <p className="contact-reveal text-dim text-lg max-w-xl mb-16">
          Have an idea, project or infrastructure that needs to be built? Let's talk.
        </p>

        <div className="contact-reveal grid sm:grid-cols-3 gap-px bg-line rounded-2xl overflow-hidden">
          <a
            href={`mailto:${profile.email}`}
            data-cursor="open"
            className="group bg-surface p-6 flex flex-col justify-between gap-8 hover:bg-surface2 transition-colors duration-300"
          >
            <div className="flex items-center justify-between">
              <p className="mono-tag text-[11px] text-dim">Email</p>
              <ArrowUpRight
                size={16}
                className="text-dim group-hover:text-signal group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300"
              />
            </div>
            <p className="text-bone text-sm break-all">{profile.email}</p>
          </a>

          <a
            href={profile.instagram.url}
            target="_blank"
            rel="noreferrer"
            data-cursor="open"
            className="group bg-surface p-6 flex flex-col justify-between gap-8 hover:bg-surface2 transition-colors duration-300"
          >
            <div className="flex items-center justify-between">
              <p className="mono-tag text-[11px] text-dim">Instagram</p>
              <ArrowUpRight
                size={16}
                className="text-dim group-hover:text-signal group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300"
              />
            </div>
            <p className="text-bone text-sm">{profile.instagram.handle}</p>
          </a>

          <button
            onClick={copyDiscord}
            data-cursor="copy"
            className="group bg-surface p-6 flex flex-col justify-between gap-8 hover:bg-surface2 transition-colors duration-300 text-left"
          >
            <div className="flex items-center justify-between">
              <p className="mono-tag text-[11px] text-dim">Discord</p>
              {copied ? (
                <Check size={16} className="text-signal" />
              ) : (
                <Copy size={16} className="text-dim group-hover:text-signal transition-colors duration-300" />
              )}
            </div>
            <div className="flex items-center justify-between">
              <p className="text-bone text-sm">{profile.discord}</p>
              <span className="mono-tag text-[10px] text-signal">{copied ? 'Copied' : 'Copy'}</span>
            </div>
          </button>
        </div>
      </div>
    </section>
  )
}
