import { useTexture } from "@react-three/drei";
import { useFrame} from "@react-three/fiber";
import {
  BallCollider,
  RapierRigidBody,
  RigidBody,
} from "@react-three/rapier";
import { useRef } from "react";
import { state } from "@/MiniGame1";
import logo from "../resources/crossp.jpg";

type Props = {
  [key: string]: any;
};
export function Ball(props: Props) {
  const rigidBodyRef = useRef<RapierRigidBody>(null);
  const map = useTexture(logo);

  useFrame(() => {
    if (!rigidBodyRef.current) {
      return;
    }
    const ball = rigidBodyRef.current;
    if (ball.translation().y < -10) {
      rigidBodyRef.current.setTranslation({ x: 0, y: 5, z: 0 }, true);
      rigidBodyRef.current.setLinvel({ x: 0, y: 5, z: 0 }, true);
      state.api.reset();
    }
  });
  return (
    <group {...props}>
      <RigidBody
        ccd
        ref={rigidBodyRef}
        angularDamping={0.8}
        restitution={1}
        canSleep={false}
        colliders={false}
        enabledTranslations={[true, true, false]}
      >
        <BallCollider args={[0.5]} />
        <mesh castShadow receiveShadow>
          <sphereGeometry args={[0.5, 64, 64]} />
          <meshStandardMaterial map={map} />
        </mesh>
      </RigidBody>

    </group>
  );
}
