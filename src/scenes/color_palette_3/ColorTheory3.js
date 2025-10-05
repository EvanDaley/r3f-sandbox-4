import React, { useState, useRef } from "react"
import { useFrame } from "@react-three/fiber"
import { Html, Sphere, Torus, Cone, Cylinder, Box } from "@react-three/drei"
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing"
import OrthoV2 from "../../components/controls/OrthoV2"
import SimpleLighting from "../../components/environment/SimpleLighting"
import ColorPalettes from "./ColorPalettes"
import FloatingEffect from "./FloatingEffect";
import EffectsV1 from "../../components/effects/EffectsV1";
import RandomFloatingObjects from "./RandomFloatingObjects";
import PaletteInfoOverlay from "./PaletteInfoOverlay";

export default function Scene() {
    const palettes = ColorPalettes()
    const [mode, setMode] = useState("monochrome")
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
            <EffectsV1/>
            <color attach="background" args={["#222"]} />

            <RandomFloatingObjects palette={palette} />
        </>
    )
}
