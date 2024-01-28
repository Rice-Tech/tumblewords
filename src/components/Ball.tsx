
import { useTexture } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import {
    BallCollider,
    CuboidCollider,
    RapierRigidBody,
    RigidBody
} from "@react-three/rapier";
import { useCallback, useRef } from "react";
import { state } from "@/Tojo";
import logo from "../resources/crossp.jpg";


type Props = {
  [key: string]: any;
};
export function Ball(props: Props) {
    const api = useRef<RapierRigidBody>(null);
    const map = useTexture(logo);
    const { viewport } = useThree();
  
    const onCollisionEnter = useCallback(() => {
      state.api.reset();
      if (!api.current) {
        return;
      }
      api.current.setTranslation({ x: 0, y: 5, z: 0 },true);
      api.current.setLinvel({ x: 0, y: 5, z: 0 }, true);
    }, []);
    return (
      <group {...props}>
        <RigidBody
          ccd
          ref={api}
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
        <RigidBody
          type="fixed"
          colliders={false}
          position={[0, -viewport.height * 2, 0]}
          restitution={2.1}
          onCollisionEnter={onCollisionEnter}
        >
          <CuboidCollider args={[1000, 2, 1000]} />
        </RigidBody>
        <RigidBody
          type="fixed"
          colliders={false}
          position={[0, viewport.height * 4, 0]}
          restitution={2.1}
          onCollisionEnter={onCollisionEnter}
        >
          <CuboidCollider args={[1000, 2, 1000]} />
        </RigidBody>
      </group>
    );
  }