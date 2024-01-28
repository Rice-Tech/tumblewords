import * as THREE from "three";
import { useCallback, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Text, useGLTF, useTexture } from "@react-three/drei";
import {
  Physics,
  RigidBody,
  CylinderCollider,
  CuboidCollider,
  BallCollider,
} from "@react-three/rapier";
import { EffectComposer, N8AO, ToneMapping } from "@react-three/postprocessing";
import { proxy, useSnapshot } from "valtio";
import { easing } from "maath";

import pingSound from "./resources/ping.mp3";
import whoo1Sound from "./resources/whoo.mp3";
import whoo2Sound from "./resources/whoo2.mp3";
import officeLoop from "./resources/office game loop 1.mp3";

import logo from "./resources/crossp.jpg";
import bg from "./resources/bg.jpg";

const officeBackground = new Audio(officeLoop);
const whoo1 = new Audio(whoo1Sound);
const whoo2 = new Audio(whoo2Sound);
const ping = new Audio(pingSound);

export function clamp(value: number, min: number, max: number) {
  console.log(value, min, max);
  if (value > max) {
    return max;
  }
  if (value < min) {
    return min;
  }
  return value;
}

const state = proxy({
  count: 0,
  word1: "word1",
  word2: "word2",
  api: {
    pong(velocity: number) {
      ping.currentTime = 0;
      ping.volume = clamp(velocity / 20, 0, 1);
      ping.play();
      if (velocity > 1) ++state.count;
    },
    soundEnemy1() {
      whoo1.currentTime = 0;
      whoo1.play();
    },
    changeEnemy1Text() {
      state.word1 = generateRandomWord();
    },
    soundEnemy2() {
      whoo2.currentTime = 0;
      whoo2.play();
    },
    changeEnemy2Text() {
      state.word2 = generateRandomWord();
    },
    reset: () => (state.count = 0),
  },
});

// Function to generate a random word
function generateRandomWord() {
  const words = [
    "hello",
    "world",
    "typescript",
    "three",
    "fiber",
    "random",
    "word",
    "stack",
    "overflow",
  ];
  return words[Math.floor(Math.random() * words.length)];
}
interface Props {
  ready: boolean;
}
export default function Tojo({ ready }: Props) {
  const { word1, word2 } = useSnapshot(state);
  officeBackground.loop = true;
  ready && officeBackground.play();
  return (
    <>
      <Canvas
        style={{ width: "100%", height: "100vh" }}
        shadows
        dpr={[1, 1.5]}
        gl={{ antialias: false }}
        camera={{ position: [0, 5, 12], fov: 45 }}
      >
        <color attach="background" args={["#f0f0f0"]} />
        <ambientLight intensity={0.5 * Math.PI} />
        <spotLight
          decay={0}
          position={[-10, 15, -5]}
          angle={1}
          penumbra={1}
          intensity={2}
          castShadow
          shadow-mapSize={1024}
          shadow-bias={-0.0001}
        />
        <Physics gravity={[0, -20, 10]} timeStep="vary">
          {ready && <Ball position={[0, 5, 0]} />}
          <Enemy
            color="orange"
            position={[2.75, 1.5, 0]}
            inText={word1}
            boxId={1}
            posScale={5}
          />
          <Enemy
            color="hotpink"
            position={[-2.75, 3.5, 0]}
            inText={word2}
            boxId={2}
            posScale={-2}
          />
          <Paddle />
        </Physics>
        <EffectComposer disableNormalPass>
          <N8AO aoRadius={0.5} intensity={2} />
          {/* <TiltShift2 blur={0.2} /> */}
          <ToneMapping />
        </EffectComposer>
        <Bg />
      </Canvas>
    </>
  );
}

function Paddle({ vec = new THREE.Vector3(), dir = new THREE.Vector3() }) {
  const api = useRef<THREE.Object3D>();
  const model = useRef<THREE.Object3D>();
  const { count } = useSnapshot(state);
  const { nodes, materials } = useGLTF("/pingpong.glb");
  const contactForce = useCallback((payload) => {
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
    // if (state.pointer.y > 0.6)
    //   api.current?.setNextKinematicTranslation({ x: x, y: 0.6, z: 0 });
    // else api.current?.setNextKinematicTranslation({ x: vec.x, y: vec.y, z: 0 });
    api.current?.setNextKinematicRotation({
      x: 0,
      y: 0,
      z: (state.pointer.x * Math.PI) / 10,
      w: 1,
    });
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
          position={[0, 1, 0]}
          fontSize={10}
          children={count}
        />
        <group rotation={[0, -0.04, 0]} scale={141.94}>
          <mesh
            castShadow
            receiveShadow
            material={materials.wood}
            geometry={nodes.mesh.geometry}
          />
          <mesh
            castShadow
            receiveShadow
            material={materials.side}
            geometry={nodes.mesh_1.geometry}
          />
          <mesh
            castShadow
            receiveShadow
            material={materials.foam}
            geometry={nodes.mesh_2.geometry}
          />
          <mesh
            castShadow
            receiveShadow
            material={materials.lower}
            geometry={nodes.mesh_3.geometry}
          />
          <mesh
            castShadow
            receiveShadow
            material={materials.upper}
            geometry={nodes.mesh_4.geometry}
          />
        </group>
      </group>
    </RigidBody>
  );
}

function Ball(props) {
  const api = useRef<THREE.Object3D>();
  const map = useTexture(logo);
  const { viewport } = useThree();

  const onCollisionEnter = useCallback(() => {
    state.api.reset();
    if (!api.current) {
      return;
    }
    api.current.setTranslation({ x: 0, y: 5, z: 0 });
    api.current.setLinvel({ x: 0, y: 5, z: 0 });
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

const BouncingRigidBody = () => {
  const [ref, api] = useBox(() => ({ mass: 1, position: [0, 0, 0] }));

  // Function to handle collisions
  const onCollide = (e) => {
    console.log("Collision occurred:", e);
  };

  // Plane on which the rigid body bounces
  usePlane(() => ({
    onCollide,
    position: [0, 0, 0],
    rotation: [-Math.PI / 2, 0, 0],
  }));

  return (
    <mesh ref={ref} onClick={() => api.applyImpulse([0, 2, 0], [0, 0, 0])}>
      <boxBufferGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="blue" />
    </mesh>
  );
};

function Bg() {
  const texture = useTexture(bg);
  return (
    <mesh rotation={[0, Math.PI / 1.25, 0]} scale={100}>
      <sphereGeometry />
      <meshBasicMaterial map={texture} side={THREE.BackSide} />
    </mesh>
  );
}
interface EnemyProps {
  position: THREE.Vector3;
  color: string;
  inText: string;
  boxId: number;
  posScale: number;
}
function Enemy({ position, color, inText, boxId, posScale }: EnemyProps) {
  const api = useRef<THREE.Object3D>();

  // const modelEnemy1 = useRef();
  // const modelEnemy2 = useRef();

  // const contactForceEnemy1 = useCallback((payload) => {
  //   state.api.enemy1(payload.totalForceMagnitude / 100);
  //   modelEnemy1.current.position.y = -payload.totalForceMagnitude / 10000;
  // }, []);
  // const contactForceEnemy2 = useCallback((payload) => {
  //   state.api.contactForceEnemy2(payload.totalForceMagnitude / 100);
  //   modelEnemy2.current.position.y = -payload.totalForceMagnitude / 10000;
  // }, []);

  // useFrame(({ clock }) => {
  //   const newPosition = Math.sin(clock.elapsedTime) * posScale;
  //   rigidBodyRef.current.position.x = newPosition;
  // });

  const contactForce = useCallback(() => {
    console.log(boxId);
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
      type="fixed"
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

      {/* <CylinderCollider args={[0.15, 0.75]} /> */}

      {/* <group ref={modelEnemy1} position={[0, 2, 0]} scale={0.15}>
        <mesh ref={rigidBodyRef}>
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
      </group>
      <group ref={modelEnemy2} position={[0, 2, 0]} scale={0.15}>
        <mesh ref={rigidBodyRef}>
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
      </group> */}
    </RigidBody>
  );
}
