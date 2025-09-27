import {OrbitControls, Stage, PerspectiveCamera, Environment, Html, OrthographicCamera} from '@react-three/drei';
import React, { Suspense } from 'react';
import { useScene1Game } from '../hooks/useScene1Game';

export default function Scene({ sceneIndex }) {
    const { clickCounts, handleClick, playerNames } = useScene1Game();

    return (
        <>
            {/*<Suspense fallback={null}>*/}
            {/*    <Environment preset="studio" background={true} blur={1.5} />*/}
            {/*</Suspense>*/}
            {/*<PerspectiveCamera makeDefault position={[0,0,0]} zoom={1} />*/}
            <PerspectiveCamera makeDefault position={[0, 0, 9]} fov={30} zoom={1} />

            <Stage adjustCamera={false} intensity={1} contactShadow shadows>
                <Html transform occlude={'blending'} position={[0, 0, 0]} scale={0.5}>
                    <div style={{
                        padding: 20,
                        backgroundColor: 'white',
                        borderRadius: 10,
                        textAlign: 'center',
                        minWidth: '300px',
                    }}>
                        <h2>Scene 1 - Click Game!</h2>
                        
                        <button 
                            onClick={handleClick}
                            style={{
                                padding: '20px 40px',
                                fontSize: '18px',
                                backgroundColor: '#4CAF50',
                                color: 'white',
                                border: 'none',
                                borderRadius: '5px',
                                cursor: 'pointer',
                                marginBottom: '20px'
                            }}
                        >
                            Click Me!
                        </button>

                        <div>
                            <h3>Click Leaderboard:</h3>
                            {Object.entries(clickCounts).map(([playerId, clicks]) => {
                                const playerName = playerNames[playerId] || 'Unknown';
                                return (
                                    <div key={playerId} style={{ margin: '5px 0' }}>
                                        {playerName}: {clicks} clicks
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </Html>
            </Stage>
        </>
    );
}
