import {
    Stage,
    Environment, Box,
} from '@react-three/drei'
import Characters from "./objects/Characters";
import GridOrbitControls from "./objects/GridOrbitControls";
import GridEffectsComposer from "./effects/GridEffectsComposer";
import UnevenlySpacedGrid from "./objects/UnevenlySpacedGrid";
import PulsingLight from "./objects/PulsingLight";
import {useSceneInitializer} from "./hooks/useSceneInitializer";

export default function Scene() {
    useSceneInitializer()

    return (
        <>
            {/*<fogExp2 attach="fog" args={['#d0d0ff', 0.05]} />*/}
            <fog attach="fog" args={['black', 15, 22.5]} />

            <Stage
                intensity={0.5}
                environment="city"
                shadows={{ type: 'accumulative', bias: -0.001, intensity: Math.PI }}
                adjustCamera={false}
            >
                <Characters/>

                {/* Ground plane */}
                {/*<mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow position={[0,0,0]}>*/}
                {/*    <planeGeometry args={[100, 100]} />*/}
                {/*    <meshStandardMaterial color="#e9e2e4"  />*/}
                {/*</mesh>*/}

                <Box/>

                <UnevenlySpacedGrid position={[0, 0, 0]} />
                <GridOrbitControls/>
                <GridEffectsComposer/>

                <Environment background preset="sunset" blur={0.8} />
            </Stage>


        </>
    )
}
