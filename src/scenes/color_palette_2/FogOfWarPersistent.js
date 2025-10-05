import * as THREE from "three";
import React, { useMemo, useRef } from "react";
import { useThree, useFrame } from "@react-three/fiber";

export default function FogOfWarPersistent({ playerPos, planeSize = 100 }) {
    const { gl } = useThree();

    // 1️⃣ create render target (the memory of explored areas)
    const fogMask = useMemo(() => {
        const rt = new THREE.WebGLRenderTarget(512, 512, {
            minFilter: THREE.LinearFilter,
            magFilter: THREE.LinearFilter,
            format: THREE.RGBAFormat,
        });
        rt.texture.encoding = THREE.LinearEncoding;
        return rt;
    }, []);

    // 2️⃣ create one-time helper scene to render circles into the mask
    const revealScene = useMemo(() => new THREE.Scene(), []);
    const revealCamera = useMemo(() => {
        const c = new THREE.OrthographicCamera(-planeSize / 2, planeSize / 2, planeSize / 2, -planeSize / 2, 0, 10);
        c.position.z = 5;
        return c;
    }, [planeSize]);

    const revealMaterial = useMemo(() => {
        return new THREE.ShaderMaterial({
            transparent: true,
            blending: THREE.CustomBlending,
            blendEquation: THREE.MaxEquation, // keeps previously white pixels
            uniforms: {
                uPlayerPos: { value: new THREE.Vector2(0, 0) },
                uSize: { value: planeSize },
                uRadius: { value: 12.0 },
                uFadeWidth: { value: 5.0 },
            },
            vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
        }
      `,
            fragmentShader: `
        varying vec2 vUv;
        uniform vec2 uPlayerPos;
        uniform float uSize;
        uniform float uRadius;
        uniform float uFadeWidth;
        void main() {
          vec2 worldPos = vec2(
            (vUv.x - 0.5) * uSize,
            (0.5 - vUv.y) * uSize
          );
          float dist = distance(worldPos, uPlayerPos);
          float alpha = 1.0 - smoothstep(uRadius - uFadeWidth, uRadius, dist);
          gl_FragColor = vec4(vec3(1.0), alpha); // white = visible area
        }
      `,
        });
    }, [planeSize]);

    const quad = useMemo(() => {
        const geom = new THREE.PlaneGeometry(planeSize, planeSize);
        const mesh = new THREE.Mesh(geom, revealMaterial);
        revealScene.add(mesh);
        return mesh;
    }, [planeSize, revealMaterial, revealScene]);

    // 3️⃣ fog plane shown in the main scene
    const fogMaterial = useMemo(() => {
        return new THREE.ShaderMaterial({
            transparent: true,
            depthWrite: false,
            uniforms: {
                uMask: { value: fogMask.texture },
                uColor: { value: new THREE.Color(0.05, 0.07, 0.1) },
            },
            vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
        }
      `,
            fragmentShader: `
        varying vec2 vUv;
        uniform sampler2D uMask;
        uniform vec3 uColor;
        void main() {
          float visible = texture2D(uMask, vUv).r;
          float alpha = 1.0 - visible;  // black where not yet revealed
          gl_FragColor = vec4(uColor, alpha);
        }
      `,
        });
    }, [fogMask]);

    const fogPlane = useRef();

    // 4️⃣ update each frame
    useFrame(() => {
        // update player's position in reveal material
        revealMaterial.uniforms.uPlayerPos.value.set(playerPos[0], playerPos[2]);

        // render circle into fogMask
        gl.setRenderTarget(fogMask);
        gl.render(revealScene, revealCamera);
        gl.setRenderTarget(null);

        // ensure fogPlane uses latest texture
        if (fogPlane.current) fogPlane.current.material.uniforms.uMask.value = fogMask.texture;
    });

    return (
        <mesh
            ref={fogPlane}
            rotation={[-Math.PI / 2, 0, 0]}
            position={[0, 5, 0]}
            material={fogMaterial}
        >
            <planeGeometry args={[planeSize, planeSize]} />
        </mesh>
    );
}
