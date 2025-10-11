import OrthoV2 from "../../components/controls/OrthoV2"
import SimpleLighting from "../../components/environment/SimpleLighting"
import EffectsV1 from "../../components/effects/EffectsV1"
import PaletteInfoOverlay from "./html/PaletteInfoOverlay"
import usePaletteControls from "./hooks/usePaletteControls"
import DroneCluster from "./objects/DroneCluster"
import ExampleGroundPlane from "../../components/props/examples/ExampleGroundPlane"
import DynamicPaletteDrone from "../../components/props/dynamic_palette/DynamicPaletteDrone"
import React from "react"
import Tower1 from "../../components/props/dynamic_palette/Tower1"
import SelectionRing from "./selection_ring/SelectionRing"
import Tower2 from "../../components/props/dynamic_palette/Tower2"
import useSelection from "./selection_ring/useSelection"
import useSelectable from "./selection_ring/useSelectable"
import Tower3 from "../../components/props/dynamic_palette/Tower3";
import SubDFast2 from "../../components/props/dynamic_palette/SubDFast2";

export default function Scene() {
    const { mode, palette, label, cycleMode } = usePaletteControls()
    const { selected, select, clear } = useSelection()
    const { handleSelect } = useSelectable(select)

    return (
        <>
            <SubDFast2 palette={palette}/>


            <OrthoV2 />
            <SimpleLighting ambientIntensity={1.2} directionalIntensity={2.0} />
            <EffectsV1 />
            <ExampleGroundPlane color={"#222"} />

            <DynamicPaletteDrone
                palette={palette}
                onClick={handleSelect("drone-1")}
            />

            {/*<DroneCluster palette={palette} />*/}
            <PaletteInfoOverlay mode={mode} label={label} onSwitch={cycleMode} />

            <Tower1
                palette={palette}
                position={[-3, 0, -2]}
                onClick={handleSelect("tower-1")}
            />

            <Tower1
                palette={palette}
                position={[-3, 0, 6]}
                onClick={handleSelect("tower-2")}
            />

            <Tower2
                palette={palette}
                position={[3, 0, -1]}
                onClick={handleSelect("tower-3")}
            />


            <Tower3
                palette={palette}
                position={[-5, 0, 2]}
                rotation={[0,Math.PI / 2,0]}
                onClick={handleSelect("tower-3")}
            />

            <SelectionRing
                visible={!!selected}
                position={selected?.position || [0, 0, 0]}
                color="#00ffff"
            />
        </>
    )
}