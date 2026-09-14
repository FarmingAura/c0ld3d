import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { viewState } from '../lib/viewState'

const SESSION_KEY = 'c0ld3d-intro-seen'

function splitChars(el) {
  const text = el.textContent
  el.textContent = ''
  const spans = []
  text.split('').forEach((ch) => {
    const span = document.createElement('span')
    span.textContent = ch === ' ' ? '\u00A0' : ch
    span.style.display = 'inline-block'
    span.style.willChange = 'transform, opacity'
    el.appendChild(span)
    spans.push(span)
  })
  return spans
}

export default function Intro({ onComplete }) {
  const rootRef = useRef(null)
  const dotRef = useRef(null)
  const sweepRef = useRef(null)
  const nameRef = useRef(null)
  const subRef = useRef(null)

  // Computed synchronously on first render (not in an effect) so we know
  // whether to mount the overlay markup at all *before* the first paint --
  // avoids a render/effect race where refs don't exist yet when skipping.
  const [skip] = useState(() => Boolean(viewState.reducedMotion || sessionStorage.getItem(SESSION_KEY)))

  useEffect(() => {
    if (skip) {
      document.body.style.overflow = ''
      onComplete()
      return
    }

    document.body.style.overflow = 'hidden'
    sessionStorage.setItem(SESSION_KEY, '1')

    const nameChars = splitChars(nameRef.current)
    gsap.set(nameChars, { yPercent: 110, opacity: 0 })
    gsap.set(subRef.current, { opacity: 0, y: 12 })
    gsap.set(sweepRef.current, { scaleX: 0, opacity: 0.9 })
    gsap.set(dotRef.current, { scale: 0, opacity: 0 })

    const tl = gsap.timeline({
      defaults: { ease: 'power3.out' },
      onComplete: () => {
        document.body.style.overflow = ''
        onComplete()
      },
    })

    tl.to(dotRef.current, { scale: 1, opacity: 1, duration: 0.5, ease: 'power2.out' })
      .to(dotRef.current, { scale: 2.4, opacity: 0.5, duration: 0.5, ease: 'power2.in' }, '+=0.1')
      .to(
        sweepRef.current,
        { scaleX: 1, duration: 0.7, ease: 'power4.inOut' },
        '-=0.35'
      )
      .to(dotRef.current, { opacity: 0, duration: 0.2 }, '-=0.3')
      .to(
        nameChars,
        { yPercent: 0, opacity: 1, duration: 0.7, stagger: 0.045, ease: 'power4.out' },
        '-=0.25'
      )
      .to(subRef.current, { opacity: 1, y: 0, duration: 0.6 }, '-=0.25')
      .to({}, { duration: 0.5 }) // hold
      .to(
        rootRef.current,
        { opacity: 0, duration: 0.7, ease: 'power2.inOut' },
        '+=0'
      )

    // failsafe: if anything above throws or a browser stalls the rAF loop,
    // never leave the visitor stuck behind a black overlay
    const failsafe = setTimeout(() => {
      if (document.body.style.overflow === 'hidden') {
        document.body.style.overflow = ''
        onComplete()
      }
    }, 6000)

    return () => {
      clearTimeout(failsafe)
      tl.kill()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (skip) return null

  return (
    <div
      ref={rootRef}
      className="fixed inset-0 z-[300] bg-ink flex flex-col items-center justify-center overflow-hidden"
      aria-hidden="true"
    >
      <div
        ref={dotRef}
        className="absolute w-3 h-3 rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(255,90,70,1) 0%, rgba(228,50,44,0.6) 45%, transparent 75%)',
          boxShadow: '0 0 60px 20px rgba(228,50,44,0.5)',
        }}
      />
      <div
        ref={sweepRef}
        className="absolute inset-0 origin-center"
        style={{
          background:
            'radial-gradient(ellipse at center, rgba(228,50,44,0.16) 0%, rgba(228,50,44,0.04) 40%, transparent 70%)',
        }}
      />

      <div className="relative text-center px-6">
        <h1
          ref={nameRef}
          className="font-display font-semibold text-[16vw] md:text-[8rem] leading-none tracking-tightest text-bone overflow-hidden"
        >
          c0ld3d
        </h1>
        <p ref={subRef} className="mono-tag text-xs md:text-sm text-signal mt-6 tracking-[0.35em]">
          DEVELOPER / BUILDER / CREATOR
        </p>
      </div>
    </div>
  )
}
