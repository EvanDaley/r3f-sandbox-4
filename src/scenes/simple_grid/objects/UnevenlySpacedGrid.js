import {Box, Grid, OrbitControls} from "@react-three/drei";
import React from "react";

export default function UnevenlySpacedGrid(props) {

    return (
        <>
            <Grid
                renderOrder={-1}
                position={[0, 0, 0]}
                infiniteGrid
                cellSize={0.6}
                cellThickness={0.6}
                sectionSize={3.3}
                sectionThickness={1.5}
                sectionColor={[0.5, 0.5, 10]}
                fadeDistance={50}
            />
        </>
    );
}
