import { Text } from "@react-three/drei";
import {
  CollisionEnterPayload,
  RapierRigidBody,
  RigidBody,
} from "@react-three/rapier";
import { useCallback, useRef, useState } from "react";
import * as THREE from "three";
import { state } from "@/MiniGame1";
import { useGatherWords } from "@/contexts/GatherWordsContext";

interface WordItemProps {
  position: THREE.Vector3;
  color: string;
  words: string[];
  boxId: number;
  posScale: number;
}
import words from "../assets/words.json";
import { WordInput } from "./StoryEngine";
import { useFrame } from "@react-three/fiber";

export function WordItem({ position, color, boxId }: WordItemProps) {
  const { contextWords, setContextWords } = useGatherWords();
  const rigidBodyRef = useRef<RapierRigidBody>(null);
  const [wordIndex, setWordIndex] = useState(0);
  const contactForce = useCallback(() => {
    if (boxId === 1) {
      state.api.soundEnemy1();
      state.api.changeEnemy1Text();
    } else {
      state.api.soundEnemy2();
      state.api.changeEnemy2Text();
    }
  }, []);

  const handleCollision = (event: CollisionEnterPayload) => {
    if (!event.other.rigidBody) {
      return;
    }
    const userData = event.other.rigidBody.userData as any;
    //const id2 = event.rigidBody?.userData as any;
    const id = userData.id;
    if (id == "ball") {
      let newWord: WordInput = { ...words[wordIndex], index: -1 };
      const matchingPOS = contextWords.filter(
        (item) => item.partOfSpeech == words[wordIndex].partOfSpeech
      );
      if (matchingPOS.length > 0) {
        if (matchingPOS.length == 1) {
          newWord.index = matchingPOS[0].index;
          newWord.refPath = matchingPOS[0].refPath;
          newWord.user = matchingPOS[0].user;
          newWord.status = matchingPOS[0].status;
        } else {
          const noWord = matchingPOS.filter((item) => !item.word);
          if (noWord.length > 0) {
            newWord.index = noWord[0].index;
            newWord.refPath = noWord[0].refPath;
            newWord.user = noWord[0].user;
            newWord.status = noWord[0].status;
          } else {
            const randomIndex = Math.floor(Math.random() * matchingPOS.length);
            newWord.index = matchingPOS[randomIndex].index;
            newWord.refPath = matchingPOS[randomIndex].refPath;
            newWord.user = matchingPOS[randomIndex].user;
            newWord.status = matchingPOS[randomIndex].status;
          }
        }

        setContextWords([
          ...contextWords.filter((item) => item.index != newWord.index),
          newWord,
        ]);
      }
      setWordIndex((wordIndex + 1) % words.length);
      console.log("Ball");
    } else {
      console.log("Something else");
    }
  };

  useFrame((state) => {
    const camera = state.camera;
    state.camera.updateMatrix();
    const frustum = new THREE.Frustum();
    const matrix = new THREE.Matrix4().multiplyMatrices(
      camera.projectionMatrix,
      camera.matrixWorldInverse
    );
    frustum.setFromProjectionMatrix(matrix);
    const wordRB = rigidBodyRef.current;
    if (!wordRB) {
      return;
    }
    const pos = wordRB.translation() as THREE.Vector3;
    if (!frustum.containsPoint(pos)) {
      console.log("Out of view");

      const reset = () => {
        wordRB.setLinvel(new THREE.Vector3(0, 0, 0), true);
        wordRB.setAngvel(new THREE.Vector3(0, 0, 0), true);
        wordRB.setTranslation(position, true);
        wordRB.setRotation(new THREE.Vector4(), true);
      };
      setTimeout(reset, 1000);
    }
  });
  return (
    <RigidBody
      colliders="cuboid"
      type="dynamic"
      gravityScale={0}
      restitution={2.1}
      ccd
      canSleep={false}
      ref={rigidBodyRef}
      onContactForce={contactForce}
      onCollisionEnter={handleCollision}
      position={position}
      mass={50}
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
          {words[wordIndex].word + "\n" + words[wordIndex].partOfSpeech}
        </Text>
        <boxGeometry args={[2.5, 1, 1]} />
        <meshStandardMaterial color={color} />
      </mesh>
    </RigidBody>
  );
}
