import React, { useRef, useEffect } from "react"
import { useFrame } from "@react-three/fiber"
import { SpotLight, OrbitControls, useTexture, useHelper } from "@react-three/drei"
import * as THREE from "three"
import { useControls } from "leva"

export default function Scene() {
    const light = useRef()

    // ✅ safer href-based path (handles trailing slashes / filenames)
    const baseHref = window.location.href.endsWith("/")
        ? window.location.href.slice(0, -1)
        : window.location.href
    const texture = useTexture(baseHref + "/images/textures/disturb.jpg")

    useEffect(() => {
        if (texture) {
            texture.minFilter = THREE.LinearFilter
            texture.magFilter = THREE.LinearFilter
            texture.generateMipmaps = false
            texture.colorSpace = THREE.SRGBColorSpace
        }
    }, [texture])

    const { intensity, distance, angle, penumbra, decay, color, focus } = useControls("Spotlight", {
        intensity: { value: 100, min: 0, max: 500 },
        distance: { value: 0, min: 0, max: 20 },
        angle: { value: Math.PI / 6, min: 0, max: Math.PI / 3 },
        penumbra: { value: 1, min: 0, max: 1 },
        decay: { value: 2, min: 1, max: 2 },
        focus: { value: 1, min: 0, max: 1 },
        color: "#ffffff",
    })

    useEffect(() => {
        if (light.current && texture) {
            light.current.map = texture
            light.current.shadow.focus = focus
            light.current.needsUpdate = true
        }
    }, [texture, focus])

    useFrame(({ clock }) => {
        const t = clock.getElapsedTime() / 3
        if (light.current) {
            light.current.position.x = Math.cos(t) * 2.5
            light.current.position.z = Math.sin(t) * 2.5
        }
    })

    return (
        <>
            <OrbitControls target={[0, 1, 0]} maxPolarAngle={Math.PI / 2} minDistance={2} maxDistance={10} />
            <hemisphereLight args={["#ffffff", "#8d8d8d", 0.15]} />

            <mesh rotation-x={-Math.PI / 2} position-y={-1} receiveShadow>
                <planeGeometry args={[20, 20]} />
                <meshStandardMaterial color="#bcbcbc" />
            </mesh>

            <mesh castShadow position={[0, 0.8, 0]}>
                <sphereGeometry args={[0.5, 64, 64]} />
                <meshLambertMaterial color="white" />
            </mesh>

            <SpotLight
                ref={light}
                position={[2.5, 5, 2.5]}
                color={color}
                intensity={intensity}
                distance={distance}
                angle={angle}
                penumbra={penumbra}
                decay={decay}
                castShadow
                shadow-mapSize-width={1024}
                shadow-mapSize-height={1024}
                shadow-bias={-0.003}
            />
        </>
    )
}
