import React from "react"
import DynamicPaletteDrone2 from "../../../components/props/dynamic_palette/DynamicPaletteDrone2";
import * as THREE from "three"

export default function DroneCluster({ palette }) {
    // Generate 15 drones with random positions
    const drones = React.useMemo(() => {
        const arr = []
        for (let i = 0; i < 15; i++) {
            const x = THREE.MathUtils.randFloatSpread(20) // range -10 to +10
            const z = THREE.MathUtils.randFloatSpread(20)
            const y = 0
            const gradientMode = Math.random() > 0.5 ? "low" : "low"
            arr.push({ x, y, z, gradientMode })
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
                    gradientMode={d.gradientMode}
                />
            ))}
        </>
    )
}
