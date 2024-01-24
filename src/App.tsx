import { OrbitControls, Plane } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";

import { Box } from "./components/Box";
import { Physics, RigidBody } from "@react-three/rapier";
const App = () => {
  return (
    <Canvas style={{ width: "100%", height: "100vh" }}>
      <Physics>
        <ambientLight intensity={Math.PI / 2} />
        <spotLight
          position={[10, 10, 10]}
          angle={0.15}
          penumbra={1}
          decay={0}
          intensity={Math.PI}
        />
        <pointLight position={[-10, -10, -10]} decay={0} intensity={Math.PI} />
        <RigidBody>
          <Box position={[-1.2, 0, 0]}></Box>
        </RigidBody>
        <Box position={[1.2, 0, 0]} />
        <OrbitControls />
        <RigidBody type="fixed">
          <Plane
            scale={[10, 10, 10]}
            rotation={[-(Math.PI/2), 0, 0]}
            position={[0, -1, 0]}
          ></Plane>
        </RigidBody>
      </Physics>
    </Canvas>
  );
};

export default App;
