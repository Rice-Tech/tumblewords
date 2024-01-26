import { useState, useEffect } from "react";
import QRCode from "../components/QRCode";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { useParams } from "react-router-dom";
import { auth, db } from "../firebase";

const HostGame = () => {
  const params = useParams();
  const [users, setUsers] = useState<string[]>([]);
  useEffect(() => {
    if (!auth.currentUser) {
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
  }, []);
  return (
    <>
      <div>HostGame</div>
      <p>Game ID: {params.gameId}</p>
      <QRCode url={window.location.href + "/" + "play"} />
      <h3>Participants</h3>
      <ul>
        {users.map((user) => (
          <li>{user}</li>
        ))}
      </ul>
    </>
  );
};

export default HostGame;
