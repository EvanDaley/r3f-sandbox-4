import * as THREE from 'three'
import React, { useMemo } from 'react'

export default function HexTileGrid({
                                        radius = 1,
                                        rows = 10,
                                        cols = 10,
                                        baseColor = '#5f7c1a',
                                        variation = 0.15, // 0–1, controls how much random variation to add
                                        edgeColor = '#2e2e1a',
                                        height = 0.2,
                                        flatTop = true,
                                    }) {
    const group = useMemo(() => {
        const parent = new THREE.Group()
        const hexGeometry = new THREE.CylinderGeometry(radius, radius, height, 6, 1, false)
        const edgesGeometry = new THREE.EdgesGeometry(hexGeometry)

        const horiz = flatTop ? radius * Math.sqrt(3) : radius * 1.5
        const vert = flatTop ? radius * 1.5 : radius * Math.sqrt(3)
        const base = new THREE.Color(baseColor)

        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                // Generate slight random variation in lightness
                const color = base.clone()
                const hsl = {}
                color.getHSL(hsl)
                hsl.l += (Math.random() - 0.5) * variation // random brighten/darken
                hsl.h += (Math.random() - 0.5) * variation * 0.2 // slight hue shift
                color.setHSL(hsl.h, hsl.s, Math.max(0, Math.min(1, hsl.l)))

                const material = new THREE.MeshStandardMaterial({
                    color,
                    roughness: 0.8,
                    metalness: 0.1,
                })

                const mesh = new THREE.Mesh(hexGeometry, material)

                const x = flatTop
                    ? col * horiz + (row % 2 ? horiz / 2 : 0)
                    : col * horiz
                const z = flatTop
                    ? row * vert
                    : row * vert + (col % 2 ? vert / 2 : 0)

                mesh.position.set(x, 0, z)

                // Edge outlines
                const lineMaterial = new THREE.LineBasicMaterial({ color: edgeColor })
                const edges = new THREE.LineSegments(edgesGeometry, lineMaterial)
                mesh.add(edges)

                parent.add(mesh)
            }
        }

        // Center the grid
        const totalWidth = horiz * cols
        const totalHeight = vert * rows
        parent.position.x = -totalWidth / 2
        parent.position.z = -totalHeight / 2

        return parent
    }, [radius, rows, cols, baseColor, variation, edgeColor, height, flatTop])

    return <primitive object={group} />
}
