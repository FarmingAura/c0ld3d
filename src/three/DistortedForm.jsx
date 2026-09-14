import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { viewState } from '../lib/viewState'

const VERTEX = /* glsl */ `
  uniform float uTime;
  varying vec3 vPos;

  // cheap 3D noise-ish displacement via layered sines (keeps this dependency-free)
  float wobble(vec3 p, float t) {
    return sin(p.x * 1.6 + t) * cos(p.y * 1.3 - t * 0.8) * 0.18
         + sin(p.z * 2.1 - t * 0.6) * 0.12;
  }

  void main() {
    vPos = position;
    vec3 p = position;
    float d = wobble(normalize(position) * 2.0, uTime);
    p += normal * d;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
  }
`

const FRAGMENT = /* glsl */ `
  precision mediump float;
  varying vec3 vPos;
  uniform float uOpacity;

  void main() {
    float d = length(vPos);
    vec3 red = vec3(0.89, 0.19, 0.17);
    vec3 dim = vec3(0.2, 0.03, 0.03);
    vec3 color = mix(dim, red, smoothstep(1.2, 2.4, d));
    gl_FragColor = vec4(color, uOpacity);
  }
`

export default function DistortedForm({ position = [4.5, 0, -6], scale = 3.4 }) {
  const meshRef = useRef(null)
  const groupRef = useRef(null)

  const geometry = useMemo(() => new THREE.IcosahedronGeometry(1, 4), [])
  const uniforms = useMemo(() => ({ uTime: { value: 0 }, uOpacity: { value: 0.55 } }), [])

  useFrame((state, delta) => {
    uniforms.uTime.value += delta * 0.6

    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.06
      meshRef.current.rotation.x += delta * 0.03
    }

    if (groupRef.current) {
      // scroll dolly: the form recedes and drifts as you move through sections
      const s = viewState.scrollProgress
      groupRef.current.position.y = position[1] + s * 14
      groupRef.current.position.z = position[2] - s * 6
      groupRef.current.rotation.z = s * 0.6

      // slight cursor parallax
      groupRef.current.position.x =
        position[0] + viewState.pointer.x * 0.8
    }
  })

  return (
    <group ref={groupRef} position={position}>
      <mesh ref={meshRef} geometry={geometry} scale={scale}>
        <shaderMaterial
          vertexShader={VERTEX}
          fragmentShader={FRAGMENT}
          uniforms={uniforms}
          wireframe
          transparent
        />
      </mesh>
    </group>
  )
}
