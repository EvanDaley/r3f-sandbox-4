import React from "react"
import DynamicPaletteDrone2 from "../../../components/props/dynamic_palette/DynamicPaletteDrone2"
import * as THREE from "three"

export default function DroneCluster({ palette }) {
    const drones = React.useMemo(() => {
        const arr = []
        const minDistance = 4.0 // roughly each drone's width
        const range = 20        // spawn area
        const maxAttempts = 200 // avoid infinite loops

        for (let i = 0; i < 15; i++) {
            let attempts = 0
            let x, z
            let tooClose = true

            // find a non-overlapping spot
            while (tooClose && attempts < maxAttempts) {
                x = THREE.MathUtils.randFloatSpread(range)
                z = THREE.MathUtils.randFloatSpread(range)
                tooClose = arr.some(d => {
                    const dx = d.x - x
                    const dz = d.z - z
                    return Math.sqrt(dx * dx + dz * dz) < minDistance
                })
                attempts++
            }

            // just a bit of random rotation — subtle variation
            const rotationY = THREE.MathUtils.degToRad(THREE.MathUtils.randFloat(-15, 15))
            arr.push({ x, y: 0, z, rotationY })
        }

        return arr
    }, [])

    return (
        <>
            {drones.map((d, i) => (
                <DynamicPaletteDrone2
                    key={i}
                    palette={palette}
                    position={[d.x, d.y, d.z]}
                    rotation={[0, d.rotationY, 0]}
                    gradientMode="low"
                />
            ))}
        </>
    )
}
