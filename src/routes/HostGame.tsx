import { useState, useEffect } from "react";
import QRCode from "../components/QRCode";
import {
  collection,
  query,
  where,
  onSnapshot,
  setDoc,
  doc,
} from "firebase/firestore";
import { useParams } from "react-router-dom";
import { db } from "../firebase";
import StoryEngine from "../components/StoryEngine";
import madlib from "../assets/madlibs.json";
import { useAuth } from "../contexts/AuthContext";

const HostGame = () => {
  const params = useParams();
  const [users, setUsers] = useState<string[]>([]);
  const [gameStatus, setGameStatus] = useState("join");
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

    const unsubscribe = watchUsers();
    return unsubscribe;
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
          storyTemplate: madlib[0].template,
        },
        { merge: true }
      );
      console.log(roomDoc);
    };

    updateRoomStatus("play");
    setGameStatus("play");
  };
  return (
    <>
      <div>HostGame</div>
      {gameStatus === "join" && (
        <div className="joinGameDiv">
          <p>Game ID: {params.gameId}</p>
          <QRCode url={window.location.href + "/" + "play"} />
          <h3>Participants</h3>
          <ul>
            {users.map((user) => (
              <li key={user}>{user}</li>
            ))}
          </ul>
          {users.length > 0 && (
            <button onClick={handleStartGame}>Start Game</button>
          )}
        </div>
      )}

      {gameStatus === "play" && (
        <StoryEngine
          templateProp={madlib[1].template || "Error Loading Template"}
        />
      )}
    </>
  );
};

export default HostGame;
