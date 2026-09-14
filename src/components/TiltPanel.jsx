import { useRef } from 'react'
import { viewState } from '../lib/viewState'

export default function TiltPanel({ children, className = '', maxTilt = 4 }) {
  const ref = useRef(null)
  const glowRef = useRef(null)
  const raf = useRef(null)

  const handleMove = (e) => {
    if (viewState.isTouch || viewState.reducedMotion) return
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const px = (e.clientX - rect.left) / rect.width
    const py = (e.clientY - rect.top) / rect.height
    const rotX = (0.5 - py) * maxTilt
    const rotY = (px - 0.5) * maxTilt

    cancelAnimationFrame(raf.current)
    raf.current = requestAnimationFrame(() => {
      el.style.transform = `perspective(900px) rotateX(${rotX}deg) rotateY(${rotY}deg)`
      if (glowRef.current) {
        glowRef.current.style.background = `radial-gradient(320px circle at ${px * 100}% ${
          py * 100
        }%, rgba(228,50,44,0.16), transparent 65%)`
      }
    })
  }

  const reset = () => {
    const el = ref.current
    if (!el) return
    cancelAnimationFrame(raf.current)
    el.style.transform = 'perspective(900px) rotateX(0deg) rotateY(0deg)'
    if (glowRef.current) glowRef.current.style.background = 'transparent'
  }

  return (
    <div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={reset}
      className={`relative transition-transform duration-300 ease-out will-change-transform ${className}`}
    >
      <div ref={glowRef} className="pointer-events-none absolute inset-0 transition-colors duration-300" />
      {children}
    </div>
  )
}
