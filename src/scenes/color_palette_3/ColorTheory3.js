import React, { useState, useRef } from "react"
import OrthoV2 from "../../components/controls/OrthoV2"
import SimpleLighting from "../../components/environment/SimpleLighting"
import EffectsV1 from "../../components/effects/EffectsV1";
import RandomFloatingObjects from "./objects/RandomFloatingObjects";
import PaletteInfoOverlay from "./html/PaletteInfoOverlay";
import DynamicPaletteDrone from "../../components/props/dynamic_palette/DynamicPaletteDrone";
import usePaletteControls from "./hooks/usePaletteControls";

export default function Scene() {
    const { mode, palette, label, cycleMode } = usePaletteControls();

    return (
        <>
            <OrthoV2 />
            <SimpleLighting ambientIntensity={0.6} directionalIntensity={2.0} />
            <EffectsV1 />
            <color attach="background" args={["#222"]} />

            {/*<RandomFloatingObjects palette={palette} />*/}
            <DynamicPaletteDrone palette={palette} />
            <PaletteInfoOverlay mode={mode} label={label} onSwitch={cycleMode} />
        </>
    );
}