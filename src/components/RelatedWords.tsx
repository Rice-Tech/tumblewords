// src/WordList.js
import { useState, useEffect } from "react";
import { en } from "naughty-words";
import badwords from "./badwords.json";

type dataMuseResponse = { word: string; score: number; tags: string[] }[];

const dataMuseOptions = [
  {
    code: "ml",
    desc: "Means like constraint: require that the results have a meaning related to this string value, which can be any word or sequence of words.",
  },
  {
    code: "sl",
    desc: "Sounds like constraint: require that the results are pronounced similarly to this string of characters. (If the string of characters doesn't have a known pronunciation, the system will make its best guess using a text-to-phonemes algorithm.)",
  },
  {
    code: "rel_jja",
    desc: "Popular nouns modified by the given adjective, per Google Books Ngrams",
  },
  {
    code: "rel_jjb",
    desc: "Popular adjectives used to modify the given noun, per Google Books Ngrams",
  },
  {
    code: "rel_syn",
    desc: "Synonyms (words contained within the same WordNet synset)",
  },
  {
    code: "rel_trg",
    desc: '"Triggers" (words that are statistically associated with the query word in the same piece of text.)',
  },
  { code: "rel_ant", desc: "Antonyms (per WordNet)" },
  { code: "rel_spc", desc: '"Kind of" (direct hypernyms, per WordNet)' },
  {
    code: "rel_gen",
    desc: '"More general than" (direct hyponyms, per WordNet)',
  },
  { code: "rel_com", desc: '"Comprises" (direct holonyms, per WordNet)' },
  { code: "rel_par", desc: '"Part of" (direct meronyms, per WordNet)' },
  {
    code: "rel_bga",
    desc: "Frequent followers (w′ such that P(w′|w) ≥ 0.001, per Google Books Ngrams)",
  },
  {
    code: "rel_bgb",
    desc: "Frequent predecessors (w′ such that P(w|w′) ≥ 0.001, per Google Books Ngrams)",
  },
  { code: "rel_hom", desc: "Homophones (sound-alike words)" },
  { code: "rel_cns", desc: "Consonant match" },
];

const RelatedWords = () => {
  const [words, setWords] = useState<dataMuseResponse>([]);
  const [topicWord, setTopicWord] = useState("");
  const [dmOption, setDMOption] = useState("ml");
  const [firstLetters, setFirstLetters] = useState("");
  useEffect(() => {
    if (!topicWord) {
      return;
    }
    const fetchData = async () => {
      const fetchRequest = `https://api.datamuse.com/words?${
        firstLetters ? "sp=" + firstLetters + "*" : ""
      }&${dmOption}=${topicWord}&max=20&md=p`;
      console.log(fetchRequest);
      const response = await fetch(fetchRequest);
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
      const data: dataMuseResponse = await response.json();
      // Filter out obscene words
      const filteredWords = data
        .filter((word) => !en.includes(word.word))
        ?.filter((word) => !badwords.includes(word.word));

      setWords(filteredWords);
    };

    fetchData();
  }, [topicWord, dmOption, firstLetters]);

  return (
    <div>
      <h2>
        Words related to{" "}
        <select onChange={(event) => setDMOption(event.target.value)}>
          {dataMuseOptions.map((option) => (
            <option value={option.code}>{option.desc}</option>
          ))}
        </select>{" "}
        
        <input
          type="text"
          placeholder="Topic Word"
          onChange={(event) => setTopicWord(event.target.value)}
        />{" "}
        along with their parts of speech:
      </h2>
      <input
          type="text"
          placeholder="First letters"
          onChange={(event) => setFirstLetters(event.target.value)}
        />
      <ul>
        {words.length > 0 &&
          words.map((word, index) => (
            <li key={index}>
              {word.word} ({" "}
              {word.tags &&
                word.tags.length > 0 &&
                word.tags.map((tag) => <span key={tag}>{tag} </span>)}
              )
            </li>
          ))}
      </ul>
    </div>
  );
};

export default RelatedWords;
