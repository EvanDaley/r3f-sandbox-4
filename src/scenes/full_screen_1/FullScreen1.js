import OrthoV2 from "../../components/controls/OrthoV2";
import SimpleLighting from "../../components/environment/SimpleLighting";
import EffectsV1 from "../../components/effects/EffectsV1";
import ExampleGroundPlane from "../../components/props/examples/ExampleGroundPlane";
import React from "react";

export default function Scene() {
    return (
        <>
            <OrthoV2 />
            <SimpleLighting ambientIntensity={1.2} directionalIntensity={2.0} />
            <EffectsV1 />
            <ExampleGroundPlane color={"#222"} />



        </>
    )
}