import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { setDoc, doc } from "firebase/firestore";
import { auth, db } from "../firebase";

const PlayGame = () => {
  const params = useParams();
  useEffect(() => {
    const uid = auth.currentUser?.uid;
    if (!uid) {
      console.log(
        "You must be logged in to play a game or at least have a valid session."
      );
      return;
    }

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
  }, []);
  return <div>PlayGame {params.gameId}</div>;
};

export default PlayGame;
