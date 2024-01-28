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
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const PlayGame = () => {
  const params = useParams();
  const { currentUser } = useAuth();
  const [wordAssignments, setWordAssignments] = useState<WordInput[]>([]);
  const [status, setStatus] = useState("collectwords");
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
          wordSnaps.push({
            word: data.word,
            partOfSpeech: data.partOfSpeech,
            refPath: doc.ref.path,
            index: data.index,
            status: data.status,
            user: data.user,
          });
        });
        setWordAssignments(wordSnaps);
      });

      return unsubscribe;
    };

    joinRoom();
    const unsubscribe = watchWords();
    return unsubscribe;
  }, [currentUser]);
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const newWordInputs = [...wordAssignments];
    newWordInputs.filter((item) => {
      console.table(item);
      console.log(index);
      return item.index == index;
    })[0].word = e.target.value;
    setWordAssignments(newWordInputs);
  };
  const handleSubmitWords = async () => {
    wordAssignments.forEach((assignedWord) => {
      if (!assignedWord.refPath) {
        return;
      }
      setDoc(
        doc(db, assignedWord.refPath),
        {
          word: assignedWord.word,
          status: "submitted",
        },
        { merge: true }
      );
    });
    setStatus("submitted");
  };
  return (
    <div>
      <Card className=" m-auto  w-1/2">
        <CardHeader>
          <CardTitle>Play Game</CardTitle>
          <CardDescription>ID: {params.gameId}</CardDescription>
        </CardHeader>
        <CardContent>
          <WordInputs
            wordsList={wordAssignments}
            onChange={handleInputChange}
          />
          <Button onClick={handleSubmitWords}>
            {status == "submitted" ? "Resubmit" : "Submit words"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default PlayGame;
