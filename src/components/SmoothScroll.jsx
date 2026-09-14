import { useEffect } from 'react'
import Lenis from 'lenis'
import gsap from 'gsap'
import { viewState, detectEnvironment } from '../lib/viewState'

export default function SmoothScroll({ children }) {
  useEffect(() => {
    detectEnvironment()

    // Pointer tracking lives here so every layer (cursor, smoke, 3D parallax)
    // reads one shared source instead of attaching its own listener.
    const handlePointer = (e) => {
      const x = e.clientX ?? (e.touches && e.touches[0]?.clientX)
      const y = e.clientY ?? (e.touches && e.touches[0]?.clientY)
      if (x == null || y == null) return
      viewState.pointerPx.x = x
      viewState.pointerPx.y = y
      viewState.pointer.x = (x / window.innerWidth) * 2 - 1
      viewState.pointer.y = -((y / window.innerHeight) * 2 - 1)
    }
    window.addEventListener('mousemove', handlePointer, { passive: true })
    window.addEventListener('touchmove', handlePointer, { passive: true })

    if (viewState.reducedMotion) {
      return () => {
        window.removeEventListener('mousemove', handlePointer)
        window.removeEventListener('touchmove', handlePointer)
      }
    }

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => 1 - Math.pow(1 - t, 3),
      smoothWheel: true,
    })

    function raf(time) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }
    requestAnimationFrame(raf)

    lenis.on('scroll', ({ progress, velocity }) => {
      viewState.scrollProgress = progress
      viewState.scrollVelocity = velocity
      gsap.ticker.tick()
    })

    // let anchor links use lenis
    const handleClick = (e) => {
      const target = e.target.closest('a[href^="#"]')
      if (!target) return
      const id = target.getAttribute('href')
      if (id.length <= 1) return
      const el = document.querySelector(id)
      if (el) {
        e.preventDefault()
        lenis.scrollTo(el, { offset: -80 })
      }
    }
    document.addEventListener('click', handleClick)

    return () => {
      document.removeEventListener('click', handleClick)
      window.removeEventListener('mousemove', handlePointer)
      window.removeEventListener('touchmove', handlePointer)
      lenis.destroy()
    }
  }, [])

  return children
}
