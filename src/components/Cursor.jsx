import { useEffect, useRef, useState } from 'react'
import { viewState } from '../lib/viewState'

export default function Cursor() {
  const dotRef = useRef(null)
  const ringRef = useRef(null)
  const labelRef = useRef(null)
  const [enabled, setEnabled] = useState(false)
  const [label, setLabel] = useState(null)
  const [hovering, setHovering] = useState(false)

  useEffect(() => {
    if (viewState.isTouch) return
    setEnabled(true)

    let ringX = window.innerWidth / 2
    let ringY = window.innerHeight / 2

    let raf
    const tick = () => {
      const mouseX = viewState.pointerPx.x
      const mouseY = viewState.pointerPx.y
      ringX += (mouseX - ringX) * 0.18
      ringY += (mouseY - ringY) * 0.18
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`
      }
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)

    const readState = (e) => {
      const el = e.target.closest('[data-cursor]')
      if (!el) return null
      return el.getAttribute('data-cursor')
    }

    const onOver = (e) => {
      const state = readState(e)
      if (!state) return
      setHovering(true)
      setLabel(state === 'hover' ? null : state.toUpperCase())
    }
    const onOut = (e) => {
      const state = readState(e)
      if (!state) return
      setHovering(false)
      setLabel(null)
    }
    document.addEventListener('mouseover', onOver)
    document.addEventListener('mouseout', onOut)

    return () => {
      document.removeEventListener('mouseover', onOver)
      document.removeEventListener('mouseout', onOut)
      cancelAnimationFrame(raf)
    }
  }, [])

  if (!enabled) return null

  return (
    <>
      <div
        ref={dotRef}
        className="fixed top-0 left-0 w-1.5 h-1.5 rounded-full bg-signal pointer-events-none z-[100] -translate-x-1/2 -translate-y-1/2"
      />
      <div
        ref={ringRef}
        className={`fixed top-0 left-0 rounded-full border pointer-events-none z-[100] -translate-x-1/2 -translate-y-1/2 flex items-center justify-center transition-[width,height,border-color,background-color] duration-200 ease-out ${
          hovering ? 'w-16 h-16 border-signal bg-signal/10' : 'w-8 h-8 border-bone/40 bg-transparent'
        }`}
      >
        {label && (
          <span ref={labelRef} className="mono-tag text-[9px] tracking-wider text-bone">
            {label}
          </span>
        )}
      </div>
      <style>{`
        @media (pointer: fine) {
          a, button, [data-cursor] { cursor: none; }
          body { cursor: none; }
        }
      `}</style>
    </>
  )
}
