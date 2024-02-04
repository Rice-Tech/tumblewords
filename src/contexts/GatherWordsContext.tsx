import {
  createContext,
  useState,
  useContext,
  useEffect,
  ReactNode,
} from "react";
import { WordInput } from "@/components/StoryEngine";
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
import { useParams } from "react-router-dom";

// Define the context interface
interface GatherWordsContextType {
  contextWords: WordInput[];
  setContextWords: React.Dispatch<React.SetStateAction<WordInput[]>>;
}

// Create the context
const initialContextValue: GatherWordsContextType = {
  contextWords: [],
  setContextWords: () => {}, // Placeholder function
};
const GatherWordsContext =
  createContext<GatherWordsContextType>(initialContextValue);

interface Props {
  children: ReactNode;
}

// Create a provider component
export const GatherWordsProvider = ({ children }: Props) => {
  const [contextWords, setContextWords] = useState<WordInput[]>([]);
  const { currentUser } = useAuth();
  const params = useParams();
  useEffect(() => {
    if (!currentUser) {
      console.log(
        "You must be logged in to play a game or at least have a valid session."
      );
      return;
    }
    const uid = currentUser.uid;
    const joinRoom = () => {
      const ref = `rooms/${params.gameId}/users/${uid}`;

      setDoc(doc(db, ref), {
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

        setContextWords(wordSnaps);
      });

      return unsubscribe;
    };

    joinRoom();
    const unsubscribe = watchWords();
    return unsubscribe;
  }, [currentUser]);
  const value = {
    contextWords: contextWords,
    setContextWords: setContextWords,
  };
  return (
    <GatherWordsContext.Provider value={value}>
      {children}
    </GatherWordsContext.Provider>
  );
};

// Custom hook to use the context
export const useGatherWords = () => {
  const context = useContext(GatherWordsContext);
  if (!context) {
    throw new Error("useGatherWords must be used within a GatherWordsProvider");
  }
  return context;
};
export default GatherWordsContext;
