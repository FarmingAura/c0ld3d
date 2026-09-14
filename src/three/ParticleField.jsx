import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { viewState } from '../lib/viewState'

const VERTEX = /* glsl */ `
  uniform float uTime;
  uniform float uScroll;
  attribute float aSize;
  attribute float aSeed;
  varying float vSeed;
  varying float vFade;

  void main() {
    vSeed = aSeed;
    vec3 p = position;

    // slow organic drift, unique per-particle via seed
    p.x += sin(uTime * 0.15 + aSeed * 6.2831) * 0.6;
    p.y += cos(uTime * 0.12 + aSeed * 4.71) * 0.5;
    p.z += sin(uTime * 0.1 + aSeed * 3.14) * 0.8;

    // gentle scroll-linked drift so the field feels alive while scrolling
    p.y += uScroll * 6.0 * (0.4 + aSeed * 0.6);

    vec4 mvPosition = modelViewMatrix * vec4(p, 1.0);
    float depthFade = smoothstep(-30.0, 2.0, -mvPosition.z);
    vFade = depthFade;

    gl_PointSize = aSize * (180.0 / -mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;
  }
`

const FRAGMENT = /* glsl */ `
  precision mediump float;
  varying float vSeed;
  varying float vFade;

  void main() {
    vec2 uv = gl_PointCoord - 0.5;
    float d = length(uv);
    float glow = smoothstep(0.5, 0.0, d);
    glow = pow(glow, 1.8);

    // mix white-hot core into deep red, biased per-particle
    vec3 red = vec3(0.89, 0.19, 0.17);
    vec3 white = vec3(0.95, 0.94, 0.92);
    vec3 color = mix(red, white, smoothstep(0.85, 1.0, vSeed) * 0.6);

    float alpha = glow * (0.35 + 0.5 * vSeed) * vFade;
    gl_FragColor = vec4(color, alpha);
  }
`

export default function ParticleField({ count = 900 }) {
  const pointsRef = useRef(null)
  const materialRef = useRef(null)

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry()
    const positions = new Float32Array(count * 3)
    const sizes = new Float32Array(count)
    const seeds = new Float32Array(count)

    for (let i = 0; i < count; i++) {
      positions[i * 3 + 0] = (Math.random() - 0.5) * 26
      positions[i * 3 + 1] = (Math.random() - 0.5) * 40
      positions[i * 3 + 2] = (Math.random() - 0.5) * 22 - 4
      sizes[i] = Math.random() * 6 + 2
      seeds[i] = Math.random()
    }

    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geo.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1))
    geo.setAttribute('aSeed', new THREE.BufferAttribute(seeds, 1))
    return geo
  }, [count])

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uScroll: { value: 0 },
    }),
    []
  )

  useFrame((state, delta) => {
    uniforms.uTime.value += delta
    uniforms.uScroll.value = viewState.scrollProgress

    if (pointsRef.current) {
      // whole field responds very subtly to cursor position (parallax)
      const targetX = viewState.pointer.x * 0.6
      const targetY = viewState.pointer.y * 0.4
      pointsRef.current.rotation.y += (targetX * 0.15 - pointsRef.current.rotation.y) * 0.02
      pointsRef.current.rotation.x += (targetY * 0.1 - pointsRef.current.rotation.x) * 0.02
    }
  })

  return (
    <points ref={pointsRef} geometry={geometry}>
      <shaderMaterial
        ref={materialRef}
        vertexShader={VERTEX}
        fragmentShader={FRAGMENT}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}
