import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";

export default function PulsingLight(props) {
    const light = useRef();
    const colors = ["red", "green", "blue", "orange", "purple", "yellow", "pink", "cyan"];
    const color = colors[Math.floor(Math.random() * colors.length)];

    useFrame((state) => {
        const t = (1 + Math.sin(state.clock.elapsedTime * 2)) / 2;
        if (light.current) {
            light.current.intensity = 10 + (t * 10);
        }
    });

    return (
        <pointLight
            ref={light}
            // color={[1, 0.2, 0.5]}
            color={color}
            distance={200}
            {...props}
        />
    );
}
