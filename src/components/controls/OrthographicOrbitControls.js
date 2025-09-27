import { OrbitControls, OrthographicCamera } from "@react-three/drei";
import React from "react";
import * as THREE from "three";

export default function OrthographicOrbitControls() {
    return (
        <>
            <OrthographicCamera
                makeDefault
                zoom={40}
                position={[22, 16.1, 21]}
            />

            <OrbitControls
                target={[6, 0, 6]}   // <--- important: controls use this, not camera.rotation
                enableRotate={true}
                enableZoom={true}
                enablePan={true}
                mouseButtons={{
                    LEFT: null,
                    MIDDLE: THREE.MOUSE.ROTATE,
                    RIGHT: THREE.MOUSE.PAN,
                }}
                onChange={(e) => {

                    // Debugging cam position
                    // const cam = e.target.object;
                    // console.log("Camera pos:", cam.position.toArray());
                    // console.log("Rotation (deg):", {
                    //     x: THREE.MathUtils.radToDeg(cam.rotation.x).toFixed(2),
                    //     y: THREE.MathUtils.radToDeg(cam.rotation.y).toFixed(2),
                    //     z: THREE.MathUtils.radToDeg(cam.rotation.z).toFixed(2),
                    // });
                }}
            />

        </>
    );
}
