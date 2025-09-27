import {Box, OrbitControls} from "@react-three/drei";
import React from "react";
import {Bloom, EffectComposer, ToneMapping} from "@react-three/postprocessing";

export default function GridEffectsComposer(props) {

    return (
        <>
            <EffectComposer disableNormalPass>
                <Bloom luminanceThreshold={2} mipmapBlur />
                <ToneMapping />
            </EffectComposer>
        </>
    );
}
