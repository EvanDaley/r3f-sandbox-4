import React from "react";

export default function SimpleLighting({
                                   ambientIntensity = 0.5,
                                   directionalPosition = [10, 10, 5],
                                   directionalIntensity = 1.2
                               }) {
    return (
        <>
            <ambientLight intensity={ambientIntensity}/>
            <directionalLight position={directionalPosition} intensity={directionalIntensity}/>
        </>
    )
}