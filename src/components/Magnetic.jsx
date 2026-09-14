import { useRef } from 'react'
import { viewState } from '../lib/viewState'

// Wraps a single interactive child and gives it a subtle magnetic pull
// toward the cursor when hovered. Disabled entirely on touch / reduced motion.
export default function Magnetic({ children, strength = 0.35, className = '' }) {
  const ref = useRef(null)
  const raf = useRef(null)

  const handleMove = (e) => {
    if (viewState.isTouch || viewState.reducedMotion) return
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const relX = e.clientX - (rect.left + rect.width / 2)
    const relY = e.clientY - (rect.top + rect.height / 2)

    cancelAnimationFrame(raf.current)
    raf.current = requestAnimationFrame(() => {
      el.style.transform = `translate3d(${relX * strength}px, ${relY * strength}px, 0)`
    })
  }

  const reset = () => {
    const el = ref.current
    if (!el) return
    cancelAnimationFrame(raf.current)
    el.style.transform = 'translate3d(0, 0, 0)'
  }

  return (
    <div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={reset}
      className={`inline-block transition-transform duration-300 ease-out will-change-transform ${className}`}
    >
      {children}
    </div>
  )
}
