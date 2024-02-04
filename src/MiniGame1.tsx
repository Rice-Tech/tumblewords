import { Plane, useTexture } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { EffectComposer, N8AO, ToneMapping } from "@react-three/postprocessing";
import { Physics, RigidBody } from "@react-three/rapier";
import { useRef, useState } from "react";
import * as THREE from "three";
import { proxy } from "valtio";
import officeLoop from "./resources/office game loop 1.mp3";
import pingSound from "./resources/ping.mp3";
import whoo1Sound from "./resources/whoo.mp3";
import whoo2Sound from "./resources/whoo2.mp3";

// import { OfficeScene } from "./components/OfficeScene";
import { OfficeSceneWithPeople } from "./components/OfficeSceneWithPeople";
import bg from "./resources/bg.jpg";
import { Ball } from "./components/Ball";
import { WordItem } from "./components/WordItem";
import { Paddle } from "./components/Paddle";

const officeBackground = new Audio(officeLoop);
const whoo1 = new Audio(whoo1Sound);
const whoo2 = new Audio(whoo2Sound);
const ping = new Audio(pingSound);

export function clamp(value: number, min: number, max: number) {
  if (value > max) {
    return max;
  }
  if (value < min) {
    return min;
  }
  return value;
}

export const state = proxy({
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
export default function MiniGame1({ ready }: Props) {
  const [musicStarted, setMusicStarted] = useState(false);
  const canvasRef = useRef<HTMLDivElement>(null);
  const startAudio = async () => {
    try {
      if (!musicStarted) {
        officeBackground.loop = true;
        await officeBackground.play();
        setMusicStarted(true);
      }
    } catch {}
  };

  startAudio();

  // useEffect(() => {
  //   if (!canvasRef.current) {
  //     console.log("No Div to make fullscreen");
  //     return;
  //   }

  //   try {
  //     canvasRef.current.requestFullscreen();
  //   } catch {
  //     const element = canvasRef.current as any;
  //     if (element.webkitRequestFullscreen) element.webkitRequestFullscreen();
  //   }
  // }, [canvasRef]);
  return (
    <>
      <div ref={canvasRef}>
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
            {/* <OfficeScene scale={[6, 6, 6]} position={[5, -5, 20]} /> */}
            <OfficeSceneWithPeople scale={[6, 6, 6]} position={[5, -5, 20]} />
            <WordItem
              color="orange"
              position={new THREE.Vector3(2.75, 1.5, 0)}
              words={words}
              boxId={1}
              posScale={5}
            />
            <WordItem
              color="hotpink"
              position={new THREE.Vector3(-2.75, 3.5, 0)}
              words={words}
              boxId={2}
              posScale={-2}
            />
            <Paddle />
            <RigidBody type="fixed">
              <Plane
                position={[0, -5.1, 0]}
                scale={100}
                rotation={[-Math.PI / 2, 0, 0]}
              />
            </RigidBody>
            <RigidBody type="fixed">
              <Plane
                position={[0, 10, 0]}
                scale={100}
                rotation={[Math.PI / 2, 0, 0]}
              />
            </RigidBody>
          </Physics>
          <EffectComposer disableNormalPass>
            <N8AO aoRadius={0.5} intensity={2} />
            {/* <TiltShift2 blur={0.2} /> */}
            <ToneMapping />
          </EffectComposer>
          <Bg />
        </Canvas>
      </div>
    </>
  );
}

function Bg() {
  const texture = useTexture(bg);
  return (
    <mesh rotation={[0, Math.PI / 1.25, 0]} scale={100}>
      <sphereGeometry />
      <meshBasicMaterial map={texture} side={THREE.BackSide} />
    </mesh>
  );
}
