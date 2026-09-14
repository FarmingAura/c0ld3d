import { useEffect, useRef } from 'react'
import { gsap, ScrollTrigger } from '../lib/gsapSetup'

// Wrap a heading in this to get a cinematic "reveal through a mask" entrance
// instead of a plain fade. Falls back to a simple fade for reduced motion.
export default function MaskReveal({ children, as: Tag = 'div', className = '', delay = 0 }) {
  const outerRef = useRef(null)
  const innerRef = useRef(null)

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) {
      gsap.set(innerRef.current, { y: 0, opacity: 1 })
      return
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(
        innerRef.current,
        { yPercent: 105, opacity: 0.4 },
        {
          yPercent: 0,
          opacity: 1,
          duration: 0.9,
          delay,
          ease: 'power4.out',
          scrollTrigger: {
            trigger: outerRef.current,
            start: 'top 88%',
          },
        }
      )
    }, outerRef.current)

    return () => ctx.revert()
  }, [delay])

  return (
    <Tag ref={outerRef} className={`overflow-hidden ${className}`}>
      <span ref={innerRef} className="inline-block">
        {children}
      </span>
    </Tag>
  )
}
