import { useState, useEffect } from "react";
import StoryTemplate from "./StoryTemplate";
import WordInputs from "./WordInputs";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

interface Props {
  templateProp: string;
  wordsList:WordInput[]
}

export interface WordInput {
  word: string;
  partOfSpeech: string;
  refPath?:string
}

export const parseTemplate = (template: string): WordInput[] => {
  const regex = /\{(\w+)\}/g;
  const matches = template.match(regex);
  if (matches) {
    return matches.map((match, index) => {
      const partOfSpeech = match.substring(1, match.length - 1); // Remove curly braces
      return { word: "", partOfSpeech: partOfSpeech, index: index };
    });
  }
  return [];
};

const StoryEngine = ({ templateProp, wordsList }: Props) => {
  const [template /*, setTemplate*/] = useState<string>(templateProp);
  const [wordInputs, setWordInputs] = useState<WordInput[]>(wordsList);
  const [revealIndex, setRevealIndex] = useState(0);
  const [showStory, setShowStory] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const newWordInputs = [...wordInputs];
    newWordInputs[index].word = e.target.value;
    setWordInputs(newWordInputs);
  };

  useEffect(() => {
    setWordInputs(parseTemplate(template));
  }, [template]);

  return (
    <div>
      <WordInputs wordsList={wordsList} onChange={handleInputChange}/>
      <Button id="revealStoryButton" onClick={() => setShowStory(!showStory)}>
        {showStory ? "Hide the Story" : "Reveal the Story"}
      </Button>

      {showStory && (
        <>
          <StoryTemplate
            template={template}
            words={wordsList}
            revealIndex={revealIndex}
          />{" "}
          <br />
          <label htmlFor="revealIndexInput"></label>Reveal the Words
          <Input
            id="revealIndexInput"
            type="number"
            value={revealIndex}
            onChange={(event) => setRevealIndex(Number(event.target.value))}
          ></Input>
        </>
      )}
    </div>
  );
};

export default StoryEngine;
