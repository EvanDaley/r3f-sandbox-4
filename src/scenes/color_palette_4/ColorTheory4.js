import OrthoV2 from "../../components/controls/OrthoV2"
import SimpleLighting from "../../components/environment/SimpleLighting"
import EffectsV1 from "../../components/effects/EffectsV1"
import PaletteInfoOverlay from "./html/PaletteInfoOverlay"
import usePaletteControls from "./hooks/usePaletteControls"
import DroneCluster from "./objects/DroneCluster";
import ExampleGroundPlane from "../../components/props/examples/ExampleGroundPlane";
import DynamicPaletteDrone from "../../components/props/dynamic_palette/DynamicPaletteDrone";
import React from "react";

export default function Scene() {
    const {mode, palette, label, cycleMode} = usePaletteControls()

    return (
        <>
            <OrthoV2/>
            <SimpleLighting ambientIntensity={0.6} directionalIntensity={2.0}/>
            <EffectsV1 />
            <ExampleGroundPlane color={"#222"}/>

            <DynamicPaletteDrone palette={palette} />

            <DroneCluster palette={palette} />
            <PaletteInfoOverlay mode={mode} label={label} onSwitch={cycleMode}/>
        </>
    )
}
