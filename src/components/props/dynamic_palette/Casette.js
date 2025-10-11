import React, { useEffect, useMemo, useRef  } from "react"
import { useGLTF, useVideoTexture } from "@react-three/drei"
import { SkeletonUtils } from "three-stdlib"
import * as THREE from "three"
import { applyVerticalGradient } from "../../../utils/applyVerticalGradient"
import { useFrame } from "@react-three/fiber"

const MODEL_PATH = window.location.href + "/models/color_palette/Casette.glb"

const DEFAULT_PALETTE = {
    primary: "#ffb703",
    secondary: "#fcbf49",
    tertiary: "#e9c46a",
}

export default function Casette({
                                   palette,
                                   gradientMode = "low",
                                   gradientEnabled = true,
                                   ...props
                               }) {
    const { scene: original } = useGLTF(MODEL_PATH)
    const scene = useMemo(() => SkeletonUtils.clone(original), [original])
    const active = useMemo(() => palette ?? DEFAULT_PALETTE, [palette])

    // Load the video texture
    const videoUrl = `${window.location.href}/videos/generated/casette.mp4`
    const videoTexture = useVideoTexture(videoUrl, { muted: true, loop: true, autoplay: true })

    const ref = useRef()

    useFrame((state, delta) => {
        if (!ref.current) return

        // Spin horizontally (Y axis)
        ref.current.rotation.y += delta * 1.5

        // Spin vertically (X axis)
        // ref.current.rotation.x += delta * 0.25
    })


    useEffect(() => {
        const box = new THREE.Box3().setFromObject(scene)
        const minY = box.min.y
        const maxY = box.max.y

        scene.traverse((child) => {
            if (!child.isMesh) return

            const name = child.name.toLowerCase()

            // 🎥 Apply video texture to specific meshes
            if (name.includes("screen") || name.includes("display")) {
                if (videoTexture?.image && videoTexture.image.paused) {
                    videoTexture.image.play().catch(() => {})
                }

                videoTexture.encoding = THREE.sRGBEncoding
                videoTexture.colorSpace = THREE.SRGBColorSpace
                videoTexture.needsUpdate = true

                videoTexture.wrapS = THREE.ClampToEdgeWrapping
                videoTexture.wrapT = THREE.ClampToEdgeWrapping
                videoTexture.repeat.set(1, -1) // flip vertically
                videoTexture.offset.y = 1

                child.material = new THREE.MeshBasicMaterial({
                    map: videoTexture,
                    side: THREE.DoubleSide,
                    toneMapped: false,
                })

                return
            }

            // 🎨 Otherwise apply the normal palette colors
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

    return <>
        <group ref={ref} {...props}>
            <primitive object={scene} {...props} />
        </group>
    </>
}

useGLTF.preload(MODEL_PATH)
