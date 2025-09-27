import { Box, Html } from "@react-three/drei";
import React, { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";

export default function PulsingLightWithDebugging() {
    const light = useRef();
    const [intensity, setIntensity] = useState(1);

    useFrame((state) => {
        const t = (1 + Math.sin(state.clock.elapsedTime * 2)) / 2;
        const newIntensity = 1 + t * 400; // not too extreme
        if (light.current) light.current.intensity = newIntensity;
        setIntensity(newIntensity);
    });

    return (
        <>
            {/* Pulsing light */}
            <pointLight ref={light} color={[1, 0.2, 0.5]} distance={20} />

            {/* Debug readout */}
            <Html>
                <p>Light intensity: {intensity.toFixed(2)}</p>
            </Html>

            {/* Objects that actually respond to light */}
            <Box position={[-2, 0, 2]}>
                <meshStandardMaterial color="white" />
            </Box>
            <Box position={[-2, 0, -2]}>
                <meshStandardMaterial color="white" />
            </Box>
        </>
    );
}
