import { Text } from "@react-three/drei";
import {
  ContactForcePayload,
  RapierRigidBody,
  RigidBody,
} from "@react-three/rapier";
import { useCallback, useRef, useState } from "react";
import * as THREE from "three";
import { state } from "@/MiniGame1";

interface WordItemProps {
  position: THREE.Vector3;
  color: string;
  words: string[];
  boxId: number;
  posScale: number;
}

export function WordItem({ position, color, words, boxId }: WordItemProps) {
  const api = useRef<RapierRigidBody>(null);
  const [wordIndex, setWordIndex] = useState(0);
  const contactForce = useCallback((payload: ContactForcePayload) => {
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
      onCollisionEnter={(event) => {
        if (!event.other.rigidBody) {
          return;
        }
        const userData = event.other.rigidBody.userData as any;
        //const id2 = event.rigidBody?.userData as any;
        const id = userData.id;
        if (id == "ball") {
          setWordIndex((wordIndex + 1) % words.length);
          console.log("Ball");
        } else {
          console.log("Something else");
        }
      }}
      position={position}
    >
      <mesh>
        <Text
          anchorX="center"
          anchorY="middle"
          rotation={[0, 0, 0]}
          position={[0, 0, 0.7]}
          fontSize={0.6}
          color={"red"}
        >
          {words[wordIndex]}
        </Text>
        <boxGeometry args={[2.5, 1, 1]} />
        <meshStandardMaterial color={color} />
      </mesh>
    </RigidBody>
  );
}
