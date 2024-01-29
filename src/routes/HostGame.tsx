import { useState, useEffect } from "react";
import QRCode from "../components/QRCode";
import {
  collection,
  query,
  where,
  onSnapshot,
  setDoc,
  doc,
  addDoc,
} from "firebase/firestore";
import { useParams } from "react-router-dom";
import { db } from "../firebase";
import StoryEngine, {
  WordInput,
  parseTemplate,
} from "../components/StoryEngine";
import madlib from "../assets/madlibs.json";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const HostGame = () => {
  const params = useParams();
  const [users, setUsers] = useState<string[]>([]);
  const [gameStatus, setGameStatus] = useState("join");
  const [wordsList, setWordsList] = useState<WordInput[]>([]);
  const { currentUser } = useAuth();
  useEffect(() => {
    if (!currentUser) {
      return;
    }

    const watchUsers = () => {
      const ref = `rooms/${params.gameId}/users`;
      const q = query(collection(db, ref), where("status", "==", "active"));
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const userSnaps: string[] = [];
        querySnapshot.forEach((doc) => {
          userSnaps.push(doc.data().uid);
        });
        setUsers(userSnaps);
      });
      return unsubscribe;
    };

    const watchWords = () => {
      const ref = `rooms/${params.gameId}/words`;
      const q = query(collection(db, ref));
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
          });
        });
        setWordsList(wordSnaps);
      });
      return unsubscribe;
    };

    const unsubscribeUsers = watchUsers();
    const unsubscribeWords = watchWords();

    return () => {
      unsubscribeUsers();
      unsubscribeWords();
    };
  }, [currentUser]);

  const handleStartGame = async () => {
    const uid = currentUser?.uid;
    if (!uid) {
      console.log(
        "You must be logged in to host a game or at least have a valid session."
      );
      return 2;
    }

    const updateRoomStatus = async (newRoomStatus: string) => {
      const ref = `rooms/${params.gameId}`;
      const roomDoc = await setDoc(
        doc(db, ref),
        {
          status: newRoomStatus,
          storyTemplate: madlib[1].template,
        },
        { merge: true }
      );
      console.log(roomDoc);
    };

    updateRoomStatus("play");
    setGameStatus("play");
    const newWordsList = parseTemplate(madlib[1].template);
    console.table(newWordsList);
    if (!newWordsList.length) {
      return;
    }
    const ref = `rooms/${params.gameId}/words`;
    newWordsList.forEach((wordInput, index) => {
      const assignedUser = users[index % users.length];
      console.log(wordInput.word, index)
      addDoc(collection(db, ref), {
        word: wordInput.word,
        partOfSpeech: wordInput.partOfSpeech,
        timeAdded: new Date().getTime(),
        status: "new",
        user: assignedUser,
        index: wordInput.index,
      });
    });
  };

  return (
    <>
      <div>Hosting Game</div>
      <div className="flex justify-around">
        {gameStatus === "join" && (
          <>
            <Card className=" w-1/2">
              <CardHeader>
                <CardTitle>Join Now!</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="joinGameDiv">
                  <p>Game ID: {params.gameId}</p>
                  <QRCode url={window.location.href + "/" + "play"} />
                </div>
              </CardContent>
            </Card>
            <Card className=" w-1/3">
              <CardHeader>
                <CardTitle>Joined Users</CardTitle>
              </CardHeader>
              <CardContent>
                <h3>Participants</h3>
                <ul>
                  {users.map((user) => (
                    <li key={user}>{user}</li>
                  ))}
                </ul>
                {users.length > 0 && (
                  <Button onClick={handleStartGame}>Start Game</Button>
                )}
              </CardContent>
            </Card>
          </>
        )}

        {gameStatus === "play" && (
          <Card>
            <CardHeader>
              <CardTitle>Story</CardTitle>
              <CardDescription>
                Players Choose Words and then a story is created here!
              </CardDescription>
            </CardHeader>
            <CardContent>
              <StoryEngine
                templateProp={madlib[1].template || "Error Loading Template"}
                wordsList={wordsList}
              />
            </CardContent>
          </Card>
        )}
      </div>
    </>
  );
};

export default HostGame;
