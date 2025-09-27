// grid_generator/Floor.js
import React, { useState } from "react"
import { grid } from "./grid"
import Cell from "./Cell"
import GridMove from "./GridMove"

export default function Floor({ children }) {
    const spacing = 1
    const cellCount = 15
    const cells = grid(cellCount, cellCount).map(([x, y, z]) => [
        x * spacing,
        0,
        z * spacing,
    ])

    const [position, setPosition] = useState([0, 0, 0])
    const onTargetClicked = (p) => {
        console.log(p)

        return setPosition([p[0], 0, p[2]])
    }

    return (
        <group>
            {cells.map((pos) => (
                <Cell
                    onClick={onTargetClicked}
                    key={`cell-${pos[0]}-${pos[2]}`}
                    position={pos}
                />
            ))}
            <GridMove position={position}>
                {children}
            </GridMove>
        </group>
    )
}
