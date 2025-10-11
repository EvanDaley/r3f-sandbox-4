import React, { useEffect, useMemo } from "react"
import { useGLTF } from "@react-three/drei"
import { SkeletonUtils } from "three-stdlib"
import * as THREE from "three"
import { applyVerticalGradient } from "../../../utils/applyVerticalGradient"

const MODEL_PATH = window.location.href + "/models/color_palette/Subdivision-fast-workflow2.glb"

const DEFAULT_PALETTE = {
    primary: "#ffb703",
    secondary: "#fcbf49",
    tertiary: "#e9c46a",
}

export default function SubDFast2({
                                   palette,
                                   gradientMode = "low",
                                   gradientEnabled = true,
                                   ...props
                               }) {
    const { scene: original } = useGLTF(MODEL_PATH)
    const scene = useMemo(() => SkeletonUtils.clone(original), [original])
    const active = useMemo(() => palette ?? DEFAULT_PALETTE, [palette])

    useEffect(() => {
        const box = new THREE.Box3().setFromObject(scene)
        const minY = box.min.y
        const maxY = box.max.y

        scene.traverse((child) => {
            if (!child.isMesh) return

            const name = child.name.toLowerCase()
            const isPrimary = name.includes("1") || name.includes("primary")
            const isSecondary = name.includes("2") || name.includes("secondary")
            const color = new THREE.Color(
                isPrimary ? active.primary : isSecondary ? active.secondary : active.tertiary
            )

            child.geometry = child.geometry.clone()
            const emissiveIntensity = isPrimary ? 0.2 : isSecondary ? 0.3 : 1

            if (gradientEnabled) {
                // ✅ Apply gradient mode
                applyVerticalGradient(child.geometry, color, minY, maxY, gradientMode)
                child.material = new THREE.MeshStandardMaterial({
                    vertexColors: true,
                    emissive: color.clone().multiplyScalar(emissiveIntensity),
                    emissiveIntensity,
                    roughness: 0.35,
                    metalness: 0.3,
                })
            } else {
                // ✅ Bright, non-gradient mode (preserves original look)
                child.material = child.material.clone()
                child.material.color.copy(color)
                child.material.emissive.copy(color)
                child.material.emissiveIntensity = 0.8
                child.material.metalness = 0.6
                child.material.roughness = 0.3
                child.material.needsUpdate = true
            }

            child.castShadow = true
            child.receiveShadow = true
        })
    }, [scene, active, gradientMode, gradientEnabled])

    return <primitive object={scene} {...props} />
}

useGLTF.preload(MODEL_PATH)
