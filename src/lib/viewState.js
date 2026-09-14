// A single mutable state bag that the smooth-scroll engine writes to every frame,
// and that the 3D scene / shaders / cursor read from every frame.
// Deliberately NOT React state -- going through setState 60x/sec for this would
// thrash re-renders. Everything here is read inside requestAnimationFrame loops.

export const viewState = {
  scrollProgress: 0, // 0..1 across the whole page
  scrollVelocity: 0, // signed, roughly px/frame, smoothed
  pointer: { x: 0, y: 0 }, // normalized -1..1, origin center
  pointerPx: { x: 0, y: 0 }, // raw client px
  isTouch: false,
  reducedMotion: false,
}

export function detectEnvironment() {
  viewState.isTouch = window.matchMedia('(pointer: coarse)').matches
  viewState.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  return viewState
}
