import React, { useMemo } from "react"
import { Sphere, Torus, Cone, Cylinder, Box } from "@react-three/drei"
import FloatingEffect from "./FloatingEffect"

const DEFAULT_PALETTE = {
    label: "Sophisticated & Subtle",
    colors: {
        primary: "#ffb703",
        secondary: "#fcbf49",
        tertiary: "#e9c46a",
    },
}

export default function RandomFloatingObjects({ palette }) {
    // Make sure palette updates trigger new colors
    const { primary, secondary, tertiary } = useMemo(() => {
        const active = palette?.colors ? palette.colors : DEFAULT_PALETTE.colors

        return {
            primary: active.primary,
            secondary: active.secondary,
            tertiary: active.tertiary,
        }
    }, [palette])

    return (
        <>
            <FloatingEffect speed={1.2}>
                <Box position={[0, 1, 0]}>
                    <meshStandardMaterial
                        color={primary}
                        emissive={secondary}
                        emissiveIntensity={1.5}
                        metalness={0.8}
                        roughness={0.2}
                    />
                </Box>
            </FloatingEffect>

            <FloatingEffect speed={0.8}>
                <Sphere args={[0.5, 32, 32]} position={[2, 0.5, -1]}>
                    <meshStandardMaterial
                        color={secondary}
                        emissive={primary}
                        emissiveIntensity={1.2}
                    />
                </Sphere>
            </FloatingEffect>

            <FloatingEffect speed={1.5}>
                <Cylinder args={[0.5, 0.5, 2, 32]} position={[-2, 1, 1]}>
                    <meshStandardMaterial
                        color={tertiary}
                        emissive={"#fff"}
                        emissiveIntensity={0.4}
                    />
                </Cylinder>
            </FloatingEffect>

            <FloatingEffect speed={1.1}>
                <Cone
                    args={[0.5, 1.5, 32]}
                    position={[1.5, 0.75, 2]}
                    rotation={[0, Math.PI / 4, 0]}
                >
                    <meshStandardMaterial
                        color={secondary}
                        emissive={primary}
                        emissiveIntensity={1.0}
                    />
                </Cone>
            </FloatingEffect>

            <FloatingEffect speed={0.9}>
                <Torus
                    args={[0.6, 0.2, 16, 100]}
                    position={[-1.5, 1.2, -2]}
                    rotation={[Math.PI / 2, 0, 0]}
                >
                    <meshStandardMaterial
                        color={primary}
                        emissive={secondary}
                        emissiveIntensity={0.6}
                    />
                </Torus>
            </FloatingEffect>
        </>
    )
}
