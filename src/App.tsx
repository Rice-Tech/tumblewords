import {
  OrbitControls
} from "@react-three/drei";
import { Canvas } from "@react-three/fiber";

import { Box } from "./components/Box";
const App = () => {
  return (
    <Canvas style={{ width: "100%", height: "100vh" }}>
      <ambientLight intensity={Math.PI / 2} />
      <spotLight
        position={[10, 10, 10]}
        angle={0.15}
        penumbra={1}
        decay={0}
        intensity={Math.PI}
      />
      <pointLight position={[-10, -10, -10]} decay={0} intensity={Math.PI} />
      <Box position={[-1.2, 0, 0]}>
      </Box>
      <Box position={[1.2, 0, 0]} />
      <OrbitControls />
    </Canvas>
  );
};

export default App;
