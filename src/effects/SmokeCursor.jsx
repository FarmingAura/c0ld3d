import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { viewState } from '../lib/viewState'

// ---- Simulation shader: decays previous frame, advects it slightly for
// organic turbulence, and stamps in new "ink" wherever the cursor has been. ----
const SIM_FRAGMENT = /* glsl */ `
  precision highp float;
  uniform sampler2D uPrev;
  uniform vec2 uResolution;
  uniform vec2 uPointer;      // 0..1
  uniform vec2 uPrevPointer;  // 0..1
  uniform float uVelocity;    // 0..1 normalized
  uniform float uTime;
  uniform float uHasPointer;
  varying vec2 vUv;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
  }

  void main() {
    vec2 uv = vUv;
    float aspect = uResolution.x / uResolution.y;

    // gentle domain warp so the trail feels like it's drifting in turbulence,
    // not just fading in place
    vec2 warp = vec2(
      sin(uv.y * 10.0 + uTime * 0.6),
      cos(uv.x * 10.0 + uTime * 0.5)
    ) * 0.0016;

    vec4 prev = texture2D(uPrev, uv + warp);
    float decay = 0.965;
    vec4 base = prev * decay;

    // stamp ink along the segment between previous and current pointer position
    // (so fast movement leaves a continuous trail, not dotted samples)
    float ink = 0.0;
    const int STEPS = 8;
    for (int i = 0; i < STEPS; i++) {
      float t = float(i) / float(STEPS - 1);
      vec2 p = mix(uPrevPointer, uPointer, t);
      vec2 d = uv - p;
      d.x *= aspect;
      float radius = mix(0.012, 0.05, clamp(uVelocity, 0.0, 1.0));
      float falloff = smoothstep(radius, 0.0, length(d));
      ink = max(ink, falloff);
    }
    ink *= uHasPointer;

    float intensity = clamp(base.r + ink, 0.0, 1.0);
    gl_FragColor = vec4(intensity, 0.0, 0.0, 1.0);
  }
`

// ---- Render shader: turns the scalar intensity field into a
// black -> dark red -> bright red -> transparent smoke look. ----
const RENDER_FRAGMENT = /* glsl */ `
  precision highp float;
  uniform sampler2D uField;
  varying vec2 vUv;

  void main() {
    float v = texture2D(uField, vUv).r;

    vec3 dark = vec3(0.05, 0.0, 0.0);
    vec3 red = vec3(0.72, 0.09, 0.07);
    vec3 hot = vec3(1.0, 0.35, 0.22);

    vec3 color = mix(dark, red, smoothstep(0.0, 0.5, v));
    color = mix(color, hot, smoothstep(0.55, 1.0, v));

    float alpha = smoothstep(0.02, 0.35, v) * 0.85;
    gl_FragColor = vec4(color, alpha);
  }
`

const PASS_VERTEX = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 1.0);
  }
`

export default function SmokeCursor() {
  const canvasRef = useRef(null)

  useEffect(() => {
    if (viewState.reducedMotion) return

    const canvas = canvasRef.current
    const isTouch = viewState.isTouch
    const scale = isTouch ? 0.5 : 0.75 // render the sim small, upscale — cheap + soft

    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: false,
      powerPreference: 'low-power',
    })
    renderer.setPixelRatio(1)

    let width = Math.max(1, Math.floor(window.innerWidth * scale))
    let height = Math.max(1, Math.floor(window.innerHeight * scale))
    renderer.setSize(window.innerWidth, window.innerHeight, false)

    const simScene = new THREE.Scene()
    const renderScene = new THREE.Scene()
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1)

    const rtOptions = {
      type: THREE.UnsignedByteType,
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
      format: THREE.RGBAFormat,
      depthBuffer: false,
      stencilBuffer: false,
    }
    let rtA = new THREE.WebGLRenderTarget(width, height, rtOptions)
    let rtB = new THREE.WebGLRenderTarget(width, height, rtOptions)

    const quadGeo = new THREE.PlaneGeometry(2, 2)

    const simUniforms = {
      uPrev: { value: rtA.texture },
      uResolution: { value: new THREE.Vector2(width, height) },
      uPointer: { value: new THREE.Vector2(-1, -1) },
      uPrevPointer: { value: new THREE.Vector2(-1, -1) },
      uVelocity: { value: 0 },
      uTime: { value: 0 },
      uHasPointer: { value: 0 },
    }
    const simMaterial = new THREE.ShaderMaterial({
      vertexShader: PASS_VERTEX,
      fragmentShader: SIM_FRAGMENT,
      uniforms: simUniforms,
    })
    simScene.add(new THREE.Mesh(quadGeo, simMaterial))

    const renderUniforms = { uField: { value: rtB.texture } }
    const renderMaterial = new THREE.ShaderMaterial({
      vertexShader: PASS_VERTEX,
      fragmentShader: RENDER_FRAGMENT,
      uniforms: renderUniforms,
      transparent: true,
    })
    renderScene.add(new THREE.Mesh(quadGeo, renderMaterial))

    let pointerNorm = { x: -1, y: -1 }
    let prevPointerNorm = { x: -1, y: -1 }
    let hasPointer = 0
    let lastMoveTime = performance.now()

    const updatePointerFromClient = (clientX, clientY) => {
      prevPointerNorm = pointerNorm
      pointerNorm = {
        x: clientX / window.innerWidth,
        y: 1 - clientY / window.innerHeight,
      }
      hasPointer = 1
      lastMoveTime = performance.now()
    }

    const onMouseMove = (e) => updatePointerFromClient(e.clientX, e.clientY)
    const onTouchMove = (e) => {
      const t = e.touches[0]
      if (t) updatePointerFromClient(t.clientX, t.clientY)
    }
    const onLeave = () => {
      hasPointer = 0
    }

    window.addEventListener('mousemove', onMouseMove, { passive: true })
    window.addEventListener('touchmove', onTouchMove, { passive: true })
    window.addEventListener('mouseleave', onLeave)

    const onResize = () => {
      width = Math.max(1, Math.floor(window.innerWidth * scale))
      height = Math.max(1, Math.floor(window.innerHeight * scale))
      rtA.setSize(width, height)
      rtB.setSize(width, height)
      simUniforms.uResolution.value.set(width, height)
      renderer.setSize(window.innerWidth, window.innerHeight, false)
    }
    window.addEventListener('resize', onResize)

    let rafId
    let lastT = performance.now()
    const clock = { t: 0 }

    const tick = (now) => {
      rafId = requestAnimationFrame(tick)
      const dt = Math.min(0.05, (now - lastT) / 1000)
      lastT = now
      clock.t += dt

      // fade out "has pointer" if idle for a bit, so trail settles/dissipates
      const idleFor = now - lastMoveTime
      const activePointer = idleFor < 120 ? hasPointer : 0

      simUniforms.uPointer.value.set(pointerNorm.x, pointerNorm.y)
      simUniforms.uPrevPointer.value.set(prevPointerNorm.x, prevPointerNorm.y)
      const dx = pointerNorm.x - prevPointerNorm.x
      const dy = pointerNorm.y - prevPointerNorm.y
      const speed = Math.min(1, Math.sqrt(dx * dx + dy * dy) * 14)
      simUniforms.uVelocity.value = speed
      simUniforms.uHasPointer.value = activePointer
      simUniforms.uTime.value = clock.t

      // ping-pong: simulate into rtB reading from rtA, then swap
      simUniforms.uPrev.value = rtA.texture
      renderer.setRenderTarget(rtB)
      renderer.render(simScene, camera)

      renderUniforms.uField.value = rtB.texture
      renderer.setRenderTarget(null)
      renderer.render(renderScene, camera)

      const tmp = rtA
      rtA = rtB
      rtB = tmp

      prevPointerNorm = pointerNorm
    }
    rafId = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('touchmove', onTouchMove)
      window.removeEventListener('mouseleave', onLeave)
      window.removeEventListener('resize', onResize)
      rtA.dispose()
      rtB.dispose()
      quadGeo.dispose()
      simMaterial.dispose()
      renderMaterial.dispose()
      renderer.dispose()
    }
  }, [])

  if (viewState.reducedMotion) return null

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-[60] pointer-events-none"
      style={{ mixBlendMode: 'screen' }}
      aria-hidden="true"
    />
  )
}
