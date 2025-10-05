import React, { useEffect, useMemo } from "react"
import { useGLTF } from "@react-three/drei"
import { SkeletonUtils } from "three-stdlib"
import * as THREE from "three"

const MODEL_PATH = window.location.href + "/models/color_palette/DynamicColorDrone2.glb"

const DEFAULT_PALETTE = {
    primary: "#ffb703",
    secondary: "#fcbf49",
    tertiary: "#e9c46a",
}

function applyVerticalGradient(geometry, baseColor, minY, maxY, mode = "low") {
    const pos = geometry.attributes.position
    const colors = new Float32Array(pos.count * 3)
    const height = maxY - minY

    for (let i = 0; i < pos.count; i++) {
        const y = pos.getY(i)
        const t = (y - minY) / height
        const brightness =
            mode === "high" ? 0.05 + 1.45 * Math.pow(t, 1.8) : 0.2 + 1.0 * t

        const c = baseColor.clone().multiplyScalar(brightness)
        colors[i * 3 + 0] = c.r
        colors[i * 3 + 1] = c.g
        colors[i * 3 + 2] = c.b
    }

    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3))
}

export default function DynamicPaletteDrone2({ palette, gradientMode = "high", ...props }) {
    const { scene } = useGLTF(MODEL_PATH)
    const localScene = useMemo(() => SkeletonUtils.clone(scene), [scene])
    const active = palette ?? DEFAULT_PALETTE

    useEffect(() => {
        if (!localScene) return

        const box = new THREE.Box3().setFromObject(localScene)
        const minY = box.min.y
        const maxY = box.max.y

        localScene.traverse((child) => {
            if (!child.isMesh) return

            const name = child.name.toLowerCase()
            const isPrimary = name.includes("1") || name.includes("primary")
            const isSecondary = name.includes("2") || name.includes("secondary")
            const color = new THREE.Color(
                isPrimary ? active.primary : isSecondary ? active.secondary : active.tertiary
            )

            // Clone geometry so gradients are per-instance
            child.geometry = child.geometry.clone()
            applyVerticalGradient(child.geometry, color, minY, maxY, gradientMode)

            // Make tertiary more emissive
            const emissiveIntensity = isPrimary ? 0.2 : isSecondary ? 0.3 : 1

            child.material = new THREE.MeshStandardMaterial({
                vertexColors: true,
                emissive: color.clone().multiplyScalar(emissiveIntensity),
                emissiveIntensity,
                roughness: 0.35,
                metalness: 0.3,
            })
        })
    }, [localScene, active, gradientMode])

    return <primitive object={localScene} {...props} />
}

useGLTF.preload(MODEL_PATH)
