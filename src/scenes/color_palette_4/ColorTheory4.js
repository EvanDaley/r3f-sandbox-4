import OrthoV2 from "../../components/controls/OrthoV2"
import SimpleLighting from "../../components/environment/SimpleLighting"
import EffectsV1 from "../../components/effects/EffectsV1"
import PaletteInfoOverlay from "./html/PaletteInfoOverlay"
import usePaletteControls from "./hooks/usePaletteControls"
import DroneCluster from "./objects/DroneCluster";
import ExampleGroundPlane from "../../components/props/examples/ExampleGroundPlane";
import DynamicPaletteDrone from "../../components/props/dynamic_palette/DynamicPaletteDrone";
import React from "react";
import Tower1 from "../../components/props/dynamic_palette/Tower1";
import SelectionRing from "./selection_ring/SelectionRing";
import useSelection from "./selection_ring/useSelection";
import * as THREE from "three"

export default function Scene() {
    const {mode, palette, label, cycleMode} = usePaletteControls()
    const { selected, select, clear } = useSelection()

    return (
        <>
            <OrthoV2/>
            <SimpleLighting ambientIntensity={0.6} directionalIntensity={2.0}/>
            <EffectsV1 />
            <ExampleGroundPlane color={"#222"}/>

            <DynamicPaletteDrone palette={palette}
                                 onClick={(e) => {
                                     e.stopPropagation()
                                     const worldPos = new THREE.Vector3()
                                     e.object.getWorldPosition(worldPos)
                                     select("tower-1", worldPos.toArray())
                                 }}
            />

            <DroneCluster palette={palette} />
            <PaletteInfoOverlay mode={mode} label={label} onSwitch={cycleMode}/>

            <Tower1
                palette={palette}
                position={[-3, 0, -1]}
                onClick={(e) => {
                    e.stopPropagation()
                    const worldPos = new THREE.Vector3()
                    e.object.getWorldPosition(worldPos)
                    select("tower-1", worldPos.toArray())
                }}

            />

            <SelectionRing
                visible={!!selected}
                position={selected?.position || [0, 0, 0]}
                color="#00ffff"
            />
        </>
    )
}
