/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
Command: npx gltfjsx@6.2.16 src/resources/Props_3D/Clipboard.glb -t 
*/

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

export function ClipboardModel(props: JSX.IntrinsicElements["group"]) {
  const { nodes, materials } = useGLTF("/Clipboard.glb") as GLTFResult;
  return (
    <group {...props} dispose={null}>
      <mesh
        geometry={nodes.Clipboard.geometry}
        material={materials.Clipboard}
      />
    </group>
  );
}

useGLTF.preload("../resources/Props_3D/Clipboard.glb");