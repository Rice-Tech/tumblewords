import { Text } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import {
  ContactForcePayload,
  CylinderCollider,
  RapierRigidBody,
  RigidBody,
} from "@react-three/rapier";
import { easing } from "maath";
import { useCallback, useRef } from "react";
import * as THREE from "three";
import { useSnapshot } from "valtio";
import { state } from "@/MiniGame1";
import { PingPong } from "./Pingpong";
import { useGatherWords } from "../contexts/GatherWordsContext";

export function Paddle({
  vec = new THREE.Vector3(),
  dir = new THREE.Vector3(),
}) {
  const { contextWords } = useGatherWords();
  const api = useRef<RapierRigidBody>(null);
  const model = useRef<THREE.Group>(null);
  const { count } = useSnapshot(state);
  const contactForce = useCallback((payload: ContactForcePayload) => {
    state.api.pong(payload.totalForceMagnitude / 100);
    if (!model.current) {
      return;
    }
    model.current.position.y = -payload.totalForceMagnitude / 10000;
  }, []);
  useFrame((state, delta) => {
    vec.set(state.pointer.x, state.pointer.y, 0.5).unproject(state.camera);
    dir.copy(vec).sub(state.camera.position).normalize();
    vec.add(dir.multiplyScalar(state.camera.position.length()));
    api.current?.setNextKinematicTranslation({ x: vec.x, y: vec.y, z: 0 });
    //   if (state.pointer.y > 0.6)
    //     api.current?.setNextKinematicTranslation({ x: x, y: 0.6, z: 0 });
    //   else api.current?.setNextKinematicTranslation({ x: vec.x, y: vec.y, z: 0 });
    api.current?.setNextKinematicRotation({
      x: 0,
      y: 0,
      z: (state.pointer.x * Math.PI) / 10,
      w: 1,
    });
    if (!model.current) {
      return;
    }
    easing.damp3(model.current.position, [0, 0, 0], 0.2, delta);
    easing.damp3(
      state.camera.position,
      [-state.pointer.x * 4, 2.5 + -state.pointer.y * 4, 12],
      0.3,
      delta
    );
    state.camera.lookAt(0, 0, 0);
  });
  return (
    <RigidBody
      ccd
      canSleep={false}
      ref={api}
      type="kinematicPosition"
      colliders={false}
      onContactForce={contactForce}
    >
      <CylinderCollider args={[0.15, 1.75]} />
      <group ref={model} position={[0, 2, 0]} scale={0.15}>
        <Text
          anchorX="center"
          anchorY="middle"
          rotation={[-Math.PI / 2, 0, 0]}
          position={[-3, 1, 0]}
          fontSize={5}
        > 
        {count+"\n"}
          {contextWords.map((word, index) => `${index+1}) ${word.word}`).join("\n")}
        </Text>
        <group rotation={[0, -0.04, 0]} scale={1}>
          <PingPong></PingPong>
        </group>
      </group>
    </RigidBody>
  );
}
