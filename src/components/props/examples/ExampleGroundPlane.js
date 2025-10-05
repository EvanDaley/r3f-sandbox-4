export default function ExampleGroundPlane({ color = "#4a8f3a", ...props }) {
    return (
        <mesh rotation-x={-Math.PI / 2} receiveShadow {...props}>
            <planeGeometry args={[60, 60]} />
            <meshStandardMaterial color={color} roughness={1} />
        </mesh>
    )
}
