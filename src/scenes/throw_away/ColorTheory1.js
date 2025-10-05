import React, { useState, useRef } from "react"
import { useFrame } from "@react-three/fiber"
import { Html, Sphere, Torus, Cone, Cylinder, Box } from "@react-three/drei"
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing"
import OrthoV2 from "../../components/controls/OrthoV2"
import SimpleLighting from "../../components/environment/SimpleLighting"
import ColorPalettes from "./ColorPalettes"

function Floating({ children, speed = .1, height = 0.25 }) {
    const ref = useRef()
    speed = .1
    useFrame(({ clock }) => {
        const t = clock.getElapsedTime() * speed
        ref.current.position.y = Math.sin(t) * height + (ref.current.userData.baseY || 0)
        ref.current.rotation.y += 0.01 * speed
    })
    return <group ref={ref}>{children}</group>
}

export default function Scene() {
    const palettes = ColorPalettes()
    const [mode, setMode] = useState("complementary")
    const palette = palettes[mode].colors
    const label = palettes[mode].label

    const cycleMode = () => {
        const keys = Object.keys(palettes)
        const currentIndex = keys.indexOf(mode)
        const nextMode = keys[(currentIndex + 1) % keys.length]
        setMode(nextMode)
    }

    return (
        <>
            <OrthoV2 />
            <SimpleLighting ambientIntensity={0.6} directionalIntensity={2.0} />

            <color attach="background" args={["#222"]} />

            {/* Floating shapes */}
            <Floating speed={1.2}>
                <Box position={[0, 1, 0]}>
                    <meshStandardMaterial
                        color={palette.primary}
                        emissive={palette.secondary}
                        emissiveIntensity={1.5}
                        metalness={0.8}
                        roughness={0.2}
                    />
                </Box>
            </Floating>

            <Floating speed={0.8}>
                <Sphere args={[0.5, 32, 32]} position={[2, 0.5, -1]}>
                    <meshStandardMaterial
                        color={palette.secondary}
                        emissive={palette.primary}
                        emissiveIntensity={1.2}
                    />
                </Sphere>
            </Floating>

            <Floating speed={1.5}>
                <Cylinder args={[0.5, 0.5, 2, 32]} position={[-2, 1, 1]}>
                    <meshStandardMaterial
                        color={palette.tertiary}
                        emissive={"#fff"}
                        emissiveIntensity={0.4}
                    />
                </Cylinder>
            </Floating>

            <Floating speed={1.1}>
                <Cone args={[0.5, 1.5, 32]} position={[1.5, 0.75, 2]} rotation={[0, Math.PI / 4, 0]}>
                    <meshStandardMaterial
                        color={palette.secondary}
                        emissive={palette.primary}
                        emissiveIntensity={1.0}
                    />
                </Cone>
            </Floating>

            <Floating speed={0.9}>
                <Torus args={[0.6, 0.2, 16, 100]} position={[-1.5, 1.2, -2]} rotation={[Math.PI / 2, 0, 0]}>
                    <meshStandardMaterial
                        color={palette.primary}
                        emissive={palette.secondary}
                        emissiveIntensity={0.6}
                    />
                </Torus>
            </Floating>

            {/* Backdrop plane */}
            <mesh position={[0, 2, -5]} receiveShadow>
                <planeGeometry args={[12, 6]} />
                <meshStandardMaterial color={"#666"} roughness={1} metalness={0.1} />
            </mesh>

            {/* Post-processing for glow and vignette */}
            <EffectComposer>
                <Bloom intensity={1.05} luminanceThreshold={.95} />
                <Vignette eskil={false} offset={0.1} darkness={0.8} />
            </EffectComposer>

            {/* Palette info UI */}
            <Html position={[0, -2.5, 0]} center>
                <div
                    style={{
                        background: "rgba(0,0,0,0.6)",
                        color: "#fff",
                        padding: "10px 15px",
                        borderRadius: "8px",
                        fontFamily: "sans-serif",
                        minWidth: "200px",
                        textAlign: "center",
                    }}
                >
                    <div style={{ fontSize: "14px", marginBottom: "6px" }}>
                        <strong>Mode:</strong> {mode.charAt(0).toUpperCase() + mode.slice(1)}
                    </div>
                    <div style={{ fontSize: "12px", opacity: 0.8 }}>{label}</div>
                    <button
                        onClick={cycleMode}
                        style={{
                            marginTop: "8px",
                            padding: "6px 10px",
                            fontSize: "12px",
                            border: "none",
                            borderRadius: "4px",
                            cursor: "pointer",
                            background: "#ffd166",
                            color: "#333",
                            fontWeight: 600,
                        }}
                    >
                        Switch Palette
                    </button>
                </div>
            </Html>
        </>
    )
}
