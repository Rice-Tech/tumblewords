import { Text } from "@react-three/drei";
import { RapierRigidBody, RigidBody } from "@react-three/rapier";
import { useCallback, useRef } from "react";
import * as THREE from "three";
import { state } from "@/MiniGame1";

interface WordItemProps {
  position: THREE.Vector3;
  color: string;
  inText: string;
  boxId: number;
  posScale: number;
}

export function WordItem({ position, color, inText, boxId }: WordItemProps) {
  const api = useRef<RapierRigidBody>(null);

  const contactForce = useCallback(() => {
    if (boxId === 1) {
      state.api.soundEnemy1();
      state.api.changeEnemy1Text();
    } else {
      state.api.soundEnemy2();
      state.api.changeEnemy2Text();
    }
  }, []);

  return (
    <RigidBody
      colliders="cuboid"
      type="dynamic"
      gravityScale={0}
      restitution={2.1}
      ccd
      canSleep={false}
      ref={api}
      onContactForce={contactForce}
      position={position}
    >
      <mesh>
        <Text
          anchorX="center"
          anchorY="middle"
          rotation={[0, 0, 0]}
          position={[0, 0, 0.7]}
          fontSize={0.6}
          children={inText}
          color={"red"}
        />
        <boxGeometry args={[2.5, 1, 1]} />
        <meshStandardMaterial color={color} />
      </mesh>
    </RigidBody>
  );
}
