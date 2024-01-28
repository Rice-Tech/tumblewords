import { FormEvent } from "react";

import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebase";
import { collection, addDoc } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
    // const queryExistingRoom = async () => {
    //   const q = query(collection(db, "rooms"), where("hostUID", "==", uid));
    //   const querySnapshot = await getDocs(q);
    //   querySnapshot.forEach((doc) => {
    //     // doc.data() is never undefined for query doc snapshots
    //     console.log(doc.id, " => ", doc.data());
    //   });
    // };

    const createNewRoom = async () => {
      const roomDoc = await addDoc(collection(db, "rooms"), {
        timeCreated: new Date().getTime(),
        status: "join",
        storyTemplate: "",
        hostUID: auth.currentUser?.uid,
      });
      return roomDoc.id;
    };
    //queryExistingRoom();
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
      <div className="inline-flex items-center justify-around w-full">
        <span className="inline-flex items-center">
        <img src="Logo.svg" alt="Tumblewords logo" className="w-12 h-12 mr-2 " />
        <h1 className="text-4xl font-semibold leading-none tracking-tight">
          Tumblewords
        </h1>
        </span>
      </div>

      <div className=" flex-col w-1/3 aspect-square m-auto justify-around">
        <Card>
          <CardHeader>
            <CardTitle>Host a Game</CardTitle>
          </CardHeader>

          <CardContent>
            <Button onClick={handleHostGame}>Host a New Game</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Join a Game</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className=" flex-col">
              <label htmlFor="gameId">
                Game Id:{" "}
                <Input
                  name="gameId"
                  id="gameId"
                  placeholder="Game ID"
                  type="text"
                  required
                />
              </label>
              <Button type="submit">Join Game</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default Home;
