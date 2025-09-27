export default function ResetEnvAndBg() {
    const { scene } = useThree()
    useEffect(() => {
        scene.environment = null
        scene.background = new THREE.Color('#111111')
    }, [scene])
    return null
}