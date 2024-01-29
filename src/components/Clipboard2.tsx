import * as THREE from "three";
import { useGLTF } from "@react-three/drei";
import { GLTF } from "three-stdlib";

type GLTFResult = GLTF & {
  nodes: {
    Clipboard: THREE.Mesh;
  };
  materials: {
    Clipboard: THREE.MeshStandardMaterial;
  };
};

export function Clipboard2(props: JSX.IntrinsicElements["group"]) {
  const { nodes, materials } = useGLTF("/Clipboard.glb") as GLTFResult;
  return (
    <group {...props} dispose={null} scale={[25,25,25]}>
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Clipboard.geometry}
        material={materials.Clipboard}
      />
    </group>
  );
}

useGLTF.preload("/Clipboard.glb");