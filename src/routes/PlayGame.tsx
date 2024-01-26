import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { setDoc, doc } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../contexts/AuthContext";

const PlayGame = () => {
  const params = useParams();
  const { currentUser } = useAuth();
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

    joinRoom();
  }, [currentUser]);
  return <div>PlayGame {params.gameId}</div>;
};

export default PlayGame;
