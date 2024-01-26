// src/WordList.js
import { useState, useEffect } from "react";

type dataMuseResponse = [{ word: string; score: number; tags: string[] }] | [];

const RelatedWords = () => {
  const [words, setWords] = useState<dataMuseResponse>([]);
  const [topicWord, setTopicWord] = useState("");
  useEffect(() => {
    if (!topicWord) {
      return;
    }
    const fetchData = async () => {
      const response = await fetch(
        `https://api.datamuse.com/words?ml=${topicWord}&sp=b*&max=10`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
      const data = await response.json();
      setWords(data);
    };

    fetchData();
  }, [topicWord]);

  return (
    <div>
      <h2>
        Words related to{" "}
        <input
          type="text"
          placeholder="Topic Word"
          onChange={(event) => setTopicWord(event.target.value)}
        />{" "}
        along with their parts of speech:
      </h2>
      <ul>
        {words.length > 0 &&
          words.map((word, index) => (
            <li key={index}>
              {word.word} ({" "}
              {word.tags.length > 0 &&
                word.tags.map((tag) => <span key={tag}>{tag} </span>)}
              )
            </li>
          ))}
      </ul>
    </div>
  );
};

export default RelatedWords;
