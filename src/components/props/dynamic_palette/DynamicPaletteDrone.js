import React, { useEffect, useMemo } from "react"
import { useGLTF } from "@react-three/drei"
import * as THREE from "three"

const MODEL_PATH = window.location.href + "/models/color_palette/DynamicColorDrone.glb"

const DEFAULT_PALETTE = {
    primary: "#ffb703",
    secondary: "#fcbf49",
    tertiary: "#e9c46a",
}

export default function DynamicPaletteDrone({ palette, ...props }) {
    const { scene } = useGLTF(MODEL_PATH)
    const active = useMemo(() => palette ?? DEFAULT_PALETTE, [palette])

    useEffect(() => {
        if (!scene) return

        scene.traverse((child) => {
            if (!child.isMesh || !child.material) return

            // Use object name or index to decide which palette color to apply
            let color = null

            if (child.name.toLowerCase().includes("1") || child.name.toLowerCase().includes("primary")) {
                color = new THREE.Color(active.primary)
            } else if (child.name.toLowerCase().includes("2") || child.name.toLowerCase().includes("secondary")) {
                color = new THREE.Color(active.secondary)
            } else {
                color = new THREE.Color(active.tertiary)
            }

            // Apply color and emissive glow
            child.material.color.copy(color)
            child.material.emissive.copy(color)
            // child.material.emissiveIntensity = 0.8
            // child.material.metalness = 0.6
            // child.material.roughness = 0.3
            child.material.needsUpdate = true
            child.castShadow = true
        })
    }, [scene, active])

    return <primitive object={scene} {...props} />
}

useGLTF.preload(MODEL_PATH)
