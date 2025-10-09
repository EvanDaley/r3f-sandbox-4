import React, { useState, useRef, useMemo } from "react";
import { Box, Cylinder } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { Vector3 } from "three";
import OrthoV2 from "../../components/controls/OrthoV2";
import SimpleLighting from "../../components/environment/SimpleLighting";
import EffectsV1 from "../../components/effects/EffectsV1";
import * as THREE from "three";

export default function Scene() {
    const [playerPos, setPlayerPos] = useState([0, 0.5, 0]);
    const targetPos = useRef(new Vector3(0, 0.5, 0));

    const trees = useMemo(
        () =>
            Array.from({ length: 50 }).map((_, i) => ({
                id: i,
                position: [
                    (Math.random() - 0.5) * 50,
                    0,
                    (Math.random() - 0.5) * 50,
                ],
                scale: 0.8 + Math.random() * 1.5,
            })),
        []
    );

    return (
        <>
            <OrthoV2 zoom={120} />
            <SimpleLighting ambientIntensity={0.7} directionalIntensity={2.5} />
            <EffectsV1 />
            <color attach="background" args={["#1a1f1a"]} />

            <Ground onClick={(point) => (targetPos.current = point)} />
            {trees.map((tree) => (
                <Tree key={tree.id} position={tree.position} scale={tree.scale} />
            ))}
            <Player position={playerPos} setPlayerPos={setPlayerPos} targetRef={targetPos} />
            {/*<FogOfWar playerPos={playerPos} />*/}
        </>
    );
}

// -------------------------------------------
// Fog of War Shader Plane
// -------------------------------------------
export  function FogOfWar({ playerPos }) {
    const meshRef = useRef();
    const planeSize = 100;

    // create shader material once
    const material = useMemo(() => {
        const uniforms = {
            uPlayerPos: { value: new THREE.Vector2(0, 0) },
            uRadius: { value: 20.0 },
            uFadeWidth: { value: 6.0 },
            uSize: { value: planeSize },
        };

        return new THREE.ShaderMaterial({
            transparent: true,
            depthWrite: false,
            uniforms,
            vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
            fragmentShader: `
  varying vec2 vUv;
  uniform vec2 uPlayerPos;
  uniform float uRadius;
  uniform float uFadeWidth;
  uniform float uSize;

  void main() {
    // Convert UV (0–1) → world-space (−size/2 .. +size/2)
    // Flip Y so Z direction matches world
    vec2 worldPos = vec2(
      (vUv.x - 0.5) * uSize,
      (0.5 - vUv.y) * uSize
    );

    float dist = distance(worldPos, uPlayerPos);

    // smoothstep transitions from 0→1 between (uRadius - uFadeWidth) → uRadius
    // we want inside (dist < uRadius - uFadeWidth) = fully clear (alpha=0)
    // and far outside = fully fogged (alpha=1)
    float fogAmount = smoothstep(uRadius - uFadeWidth, uRadius, dist);

    // fog color — dark grayish
    vec3 fogColor = vec3(0.01, 0.01, 0.01);
    gl_FragColor = vec4(fogColor, fogAmount);
  }
`

        });
    }, []);

    // update uniform every frame
    useFrame(() => {
        material.uniforms.uPlayerPos.value.set(playerPos[0], playerPos[2]);
    });

    return (
        <mesh
            ref={meshRef}
            material={material}
            rotation={[-Math.PI / 2, 0, 0]}
            position={[0, 9, 0]}
        >
            <planeGeometry args={[planeSize, planeSize]} />
        </mesh>
    );
}


// -------------------------------------------
// Environment + Player + Trees
// -------------------------------------------
function Ground({ onClick }) {
    const handlePointerDown = (e) => {
        e.stopPropagation();
        const point = e.point.clone();
        point.y = 0.5;
        console.log(point)

        onClick(point);
    };

    return (
        <mesh
            rotation={[-Math.PI / 2, 0, 0]}
            onPointerDown={handlePointerDown}
            receiveShadow
        >
            <planeGeometry args={[100, 100]} />
            <meshStandardMaterial color="#2d3a2d" />
        </mesh>
    );
}

function Tree({ position, scale }) {
    return (
        <group position={position} scale={scale}>
            <Cylinder args={[0.2, 0.2, 1.5, 8]} position={[0, 0.75, 0]}>
                <meshStandardMaterial color="#8B5A2B" />
            </Cylinder>
            <Cylinder args={[0, 1.2, 2.5, 8]} position={[0, 2, 0]}>
                <meshStandardMaterial color="#2E8B57" />
            </Cylinder>
        </group>
    );
}

function Player({ position, setPlayerPos, targetRef }) {
    const playerRef = useRef();
    const speed = 0.05;
    const tmp = new Vector3();

    useFrame(() => {
        if (!playerRef.current) return;
        const current = playerRef.current.position;
        const target = targetRef.current;
        if (current.distanceTo(target) > 0.05) {
            tmp.copy(target).sub(current).normalize().multiplyScalar(speed);
            current.add(tmp);
            setPlayerPos([current.x, current.y, current.z]);
        }
    });

    return (
        <Box ref={playerRef} position={position}>
            <meshStandardMaterial
                color="#ff5555"
                emissive="#aa2222"
                emissiveIntensity={0.6}
            />
        </Box>
    );
}
