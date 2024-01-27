import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  setDoc,
  doc,
  query,
  collection,
  where,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../contexts/AuthContext";
import { WordInput } from "../components/StoryEngine";
import WordInputs from "../components/WordInputs";

const PlayGame = () => {
  const params = useParams();
  const { currentUser } = useAuth();
  const [wordAssignments, setWordAssignments] = useState<WordInput[]>([]);
  useEffect(() => {
    if (!currentUser) {
      console.log(
        "You must be logged in to play a game or at least have a valid session."
      );
      return;
    }
    const uid = currentUser.uid;
    const joinRoom = async () => {
      const ref = `rooms/${params.gameId}/users/${uid}`;
      console.log(ref);
      await setDoc(doc(db, ref), {
        uid: uid,
        timeJoined: new Date().getTime(),
        status: "active",
      });
    };
    const watchWords = () => {
      const ref = `rooms/${params.gameId}/words`;
      const q = query(collection(db, ref), where("user", "==", uid));
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const wordSnaps: WordInput[] = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          wordSnaps.push({ word: data.word, partOfSpeech: data.partOfSpeech });
        });
        setWordAssignments(wordSnaps);
      });

      return unsubscribe;
    };

    joinRoom();
    const unsubscribe = watchWords();
    return unsubscribe;
  }, [currentUser]);
  return (
    <div>
      PlayGame {params.gameId}
      <WordInputs
        wordsList={wordAssignments}
        onChange={(event) => console.log(event.target.value)}
      />
    </div>
  );
};

export default PlayGame;
