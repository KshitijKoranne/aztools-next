"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

function ShaderPlane() {
  const materialRef = useRef<THREE.ShaderMaterial | null>(null);
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uPointer: { value: new THREE.Vector2(0.5, 0.5) },
      uColorA: { value: new THREE.Color("#7c5cff") },
      uColorB: { value: new THREE.Color("#21f6a7") },
      uColorC: { value: new THREE.Color("#ff4ecd") },
    }),
    []
  );

  useFrame(({ clock, pointer }) => {
    if (!materialRef.current) return;
    materialRef.current.uniforms.uTime.value = clock.elapsedTime;
    materialRef.current.uniforms.uPointer.value.lerp(new THREE.Vector2(pointer.x * 0.5 + 0.5, pointer.y * 0.5 + 0.5), 0.05);
  });

  return (
    <mesh scale={[2.9, 2.9, 1]}>
      <planeGeometry args={[2, 2, 128, 128]} />
      <shaderMaterial
        ref={materialRef}
        uniforms={uniforms}
        vertexShader={`
          varying vec2 vUv;
          uniform float uTime;
          uniform vec2 uPointer;

          void main() {
            vUv = uv;
            vec3 pos = position;
            float wave = sin((pos.x * 4.0) + uTime * 0.7) * 0.045;
            wave += cos((pos.y * 5.0) - uTime * 0.55) * 0.035;
            float pull = distance(uv, uPointer);
            pos.z += wave + smoothstep(0.55, 0.0, pull) * 0.13;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
          }
        `}
        fragmentShader={`
          varying vec2 vUv;
          uniform float uTime;
          uniform vec2 uPointer;
          uniform vec3 uColorA;
          uniform vec3 uColorB;
          uniform vec3 uColorC;

          float hash(vec2 p) {
            return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
          }

          float noise(vec2 p) {
            vec2 i = floor(p);
            vec2 f = fract(p);
            float a = hash(i);
            float b = hash(i + vec2(1.0, 0.0));
            float c = hash(i + vec2(0.0, 1.0));
            float d = hash(i + vec2(1.0, 1.0));
            vec2 u = f * f * (3.0 - 2.0 * f);
            return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
          }

          float lines(vec2 uv, float speed, float scale) {
            float n = noise(uv * scale + vec2(uTime * speed, -uTime * speed * 0.7));
            return smoothstep(0.46, 0.5, abs(sin((uv.x + n * 0.22) * 18.0)));
          }

          void main() {
            vec2 uv = vUv;
            vec2 p = uv - 0.5;
            float dist = length(p);
            float pointerGlow = smoothstep(0.55, 0.0, distance(uv, uPointer));
            float ring = smoothstep(0.34, 0.335, abs(dist - 0.34 + sin(uTime * 0.3) * 0.025));
            float mesh = lines(uv + pointerGlow * 0.04, 0.08, 3.2);
            float vapor = noise(uv * 3.0 + vec2(uTime * 0.03, uTime * -0.02));
            vec3 color = mix(uColorA, uColorB, uv.x + vapor * 0.32);
            color = mix(color, uColorC, smoothstep(0.2, 0.95, uv.y + sin(uTime * 0.18) * 0.12));
            color += uColorB * pointerGlow * 0.55;
            color += uColorA * ring * 0.22;
            color += vec3(1.0) * mesh * 0.05;
            float vignette = smoothstep(0.86, 0.18, dist);
            gl_FragColor = vec4(color * vignette, 0.78);
          }
        `}
        transparent
        depthWrite={false}
      />
    </mesh>
  );
}

export function AuroraToolShader() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <Canvas camera={{ position: [0, 0, 1.45], fov: 70 }} dpr={[1, 1.45]} gl={{ antialias: false, alpha: true, powerPreference: "high-performance" }}>
        <ShaderPlane />
      </Canvas>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_12%,transparent,rgba(4,4,12,0.22)_30%,rgba(4,4,12,0.95)_82%)]" />
      <div className="absolute inset-0 az-noise opacity-[0.18]" />
    </div>
  );
}
