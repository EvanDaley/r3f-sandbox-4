import React, { useEffect, useMemo } from "react"
import { useGLTF, useVideoTexture } from "@react-three/drei"
import { SkeletonUtils } from "three-stdlib"
import * as THREE from "three"
import { applyVerticalGradient } from "../../../utils/applyVerticalGradient"

const MODEL_PATH = window.location.href + "/models/color_palette/TowerScreen.glb"

const DEFAULT_PALETTE = {
    primary: "#ffb703",
    secondary: "#fcbf49",
    tertiary: "#e9c46a",
}

export default function TowerScreen({
                                   palette,
                                   gradientMode = "low",
                                   gradientEnabled = true,
                                   ...props
                               }) {
    const { scene: original } = useGLTF(MODEL_PATH)
    const scene = useMemo(() => SkeletonUtils.clone(original), [original])
    const active = useMemo(() => palette ?? DEFAULT_PALETTE, [palette])
    const videoUrl = `${window.location.href}/videos/generated/2.mp4`

    const videoTexture = useVideoTexture(videoUrl, { muted: true, loop: true, autoplay: true })

    useEffect(() => {
        const box = new THREE.Box3().setFromObject(scene)
        const minY = box.min.y
        const maxY = box.max.y

        scene.traverse((child) => {
            if (!child.isMesh) return

            const name = child.name.toLowerCase()

            // 👇 Pick the mesh you want the video on
            if (name.includes("side") || name.includes("screen")) {
                // Make sure the video actually plays
                if (videoTexture?.image && videoTexture.image.paused) {
                    videoTexture.image.play().catch(() => {})
                }

                // Flip it vertically and horizontally if needed
                videoTexture.wrapS = THREE.ClampToEdgeWrapping
                videoTexture.wrapT = THREE.ClampToEdgeWrapping
                videoTexture.repeat.set(-1, -1)   // flip both directions
                videoTexture.offset.set(1, 1)

                videoTexture.repeat.x = 1       // increase to stretch video across wider UV space
                videoTexture.offset.x = 0      // recenter it


                child.material = new THREE.MeshBasicMaterial({
                    map: videoTexture,
                    side: THREE.DoubleSide,
                    toneMapped: false,
                })

                // Optionally scale the mesh to correct aspect ratio
                const video = videoTexture.image
                if (video && video.videoWidth && video.videoHeight) {
                    const aspect = video.videoWidth / video.videoHeight // usually < 1 for portrait
                    const targetHeight = 4
                    const targetWidth = targetHeight * aspect
                    child.scale.set(1, 1, 1) // stretch X to correct ratio
                }

                return
            }

            // 🎨 Otherwise, apply your normal color logic
            const isPrimary = name.includes("1") || name.includes("primary")
            const isSecondary = name.includes("2") || name.includes("secondary")
            const color = new THREE.Color(
                isPrimary ? active.primary : isSecondary ? active.secondary : active.tertiary
            )

            child.geometry = child.geometry.clone()
            const emissiveIntensity = isPrimary ? 0.2 : isSecondary ? 0.3 : 1

            if (gradientEnabled) {
                applyVerticalGradient(child.geometry, color, minY, maxY, gradientMode)
                child.material = new THREE.MeshStandardMaterial({
                    vertexColors: true,
                    emissive: color.clone().multiplyScalar(emissiveIntensity),
                    emissiveIntensity,
                    roughness: 0.35,
                    metalness: 0.3,
                })
            } else {
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
    }, [scene, active, gradientMode, gradientEnabled, videoTexture])

    return <primitive object={scene} {...props} />
}

useGLTF.preload(MODEL_PATH)
