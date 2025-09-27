import {OrbitControls, Stage, PerspectiveCamera, Environment, Html, OrthographicCamera, Box} from '@react-three/drei';
import React, { Suspense } from 'react';
import { useBirdGame } from './hooks/useBirdGame';
import { useBirdStore} from "./stores/birdStore";
import PracticeBox from "../../components/characters/PracticeBox";
import ExamplePlane from "../../components/props/examples/ExamplePlane";
import {useFlapControls} from "./hooks/useFlapControls";
import {useGravityLoop} from "./hooks/useGravityLoop";
import {useBroadcastPositions} from "./hooks/useBroadcastPositions";

export default function Scene({ sceneIndex }) {
    const { clickCounts, handleClick, playerNames } = useBirdGame();
    const { playerPositions } = useBirdStore();

    useGravityLoop()
    useBroadcastPositions()
    useFlapControls()

    return (
        <>

            <Stage adjustCamera={false} intensity={1}>
                {/*Ground*/}
                <ExamplePlane
                    position={[0,-2.2,0]}
                    rotation={[-Math.PI / 2, 0, 0]}
                    scale={[10,10,10]}
                />

                {/*<Box*/}
                {/*/>*/}

                {/*Characters*/}
                {Object.entries(playerPositions).map(([playerId, playerPosition], index) => {
                    const playerName = playerNames[playerId] || 'Unknown';

                    // simple hash → color mapping
                    const colors = ["red", "green", "blue", "orange", "purple", "yellow", "pink", "cyan"];
                    const color = colors[index % colors.length];

                    return (
                        <Box
                            key={playerId}
                            scale={[0.5, 0.5, 0.5]}
                            position={playerPosition}
                        >
                            <meshStandardMaterial color={color} />
                        </Box>
                    );
                })}


                {/*Camera and Controls*/}
                <OrthographicCamera makeDefault position={[0,0, 15]} zoom={60} />
                <OrbitControls
                    minPolarAngle={Math.PI / 10}
                    maxPolarAngle={Math.PI / 1.5}
                    enableZoom={true}
                    rotateSpeed={0.12}
                    enablePan={true}
                    enableRotate={true}
                />
                {/*<OrbitControls*/}
                {/*    minPolarAngle={Math.PI / 2}*/}
                {/*    maxPolarAngle={Math.PI / 2}*/}
                {/*    enableRotate={false} // optional, to fully lock it*/}
                {/*/>*/}


            </Stage>
        </>
    );
}
