import { FormEvent } from "react";

import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebase";
import { collection, addDoc, query, where, getDocs } from "firebase/firestore";

const Home = () => {
  const navigate = useNavigate();

  const handleHostGame = async () => {
    const uid = auth.currentUser?.uid;
    if (!uid) {
      console.log(
        "You must be logged in to host a game or at least have a valid session."
      );
      return 2;
    }
    const queryExistingRoom = async () => {
      const q = query(collection(db, "rooms"), where("hostUID", "==", uid));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        console.log(doc.id, " => ", doc.data());
      });
    };

    const createNewRoom = async () => {
      const roomDoc = await addDoc(collection(db, "rooms"), {
        timeCreated: new Date().getTime(),
        status: "join",
        storyTemplate: "",
        hostUID: auth.currentUser?.uid,
      });
      return roomDoc.id;
    };
    queryExistingRoom();
    const gameId = await createNewRoom();
    navigate(`/game/${gameId}`);
  };
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const gameId = (event.target as HTMLFormElement).gameId.value;
    navigate(`/game/${gameId}/play`);
    return;
  };
  return (
    <>
      <h1>Tumblewords</h1>
      <button onClick={handleHostGame}>Host a New Game</button>
      <br />
      <br />
      <br />
      <form onSubmit={handleSubmit}>
        <label htmlFor="gameId">Game Id: </label>
        <input
          name="gameId"
          id="gameId"
          placeholder="Game ID"
          type="text"
          required
        />
        <button type="submit">Join Game</button>
      </form>
    </>
  );
};

export default Home;
