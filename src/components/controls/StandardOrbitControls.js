import {Box, OrbitControls, PerspectiveCamera} from "@react-three/drei";
import React from "react";
import * as THREE from "three";

export default function StandardOrbitControls(props) {
    return (
        <>
            <PerspectiveCamera
                makeDefault
                position={[-15, 4, 10]}
                fov={25}
            />

            <OrbitControls
                autoRotate
                autoRotateSpeed={0.00}
                enableZoom={true}
                makeDefault
                maxPolarAngle={Math.PI / 2}
                mouseButtons={{
                    LEFT: null,
                    MIDDLE: THREE.MOUSE.ROTATE,
                    RIGHT: THREE.MOUSE.PAN
                }}
                onChange={(e) => {
                    const cam = e.target.object;
                    if (cam.position.y < 2) {
                        cam.position.y = 2; // clamp to ground
                    }
                }}
            />
        </>
    );
}
