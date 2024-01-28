import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { setDoc, doc } from "firebase/firestore";
import { db } from "../firebase";
import WordInputs from "../components/WordInputs";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  useGatherWords,
} from "@/contexts/GatherWordsContext";

const PlayGame = () => {
  const params = useParams();
  const [status, setStatus] = useState("collectwords");
  const { contextWords, setContextWords } = useGatherWords();
  useEffect(()=>{
    console.log("contextWords changed")
    console.table(contextWords)
  },[contextWords])

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const newWordInputs = [...contextWords];
    newWordInputs.filter((item) => {
      return item.index == index;
    })[0].word = e.target.value;
    setContextWords(newWordInputs);
  };
  const handleSubmitWords = async () => {
    contextWords.forEach((assignedWord) => {
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
                wordsList={contextWords}
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
