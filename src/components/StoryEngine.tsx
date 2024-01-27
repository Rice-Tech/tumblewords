import { useState, useEffect } from "react";
import StoryTemplate from "./StoryTemplate";

interface Props {
  templateProp: string;
}
export interface WordInput {
  word: string;
  partOfSpeech: string;
}

const StoryEngine = ({ templateProp }: Props) => {
  const [template /*, setTemplate*/] = useState<string>(templateProp);
  const [wordInputs, setWordInputs] = useState<WordInput[]>([]);
  const [revealIndex, setRevealIndex] = useState(0);
  const [showStory, setShowStory] = useState(false);
  const parseTemplate = (template: string): WordInput[] => {
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
      {wordInputs.map((input, index) => (
        <div key={index}>
          <label>
            {input.partOfSpeech}:
            <input
              type="text"
              value={input.word}
              onChange={(e) => handleInputChange(e, index)}
            />
          </label>
          <br />
        </div>
      ))}
      <button id="revealStoryButton" onClick={() => setShowStory(!showStory)}>
        {showStory ? "Hide the Story" : "Reveal the Story"}
      </button>

      {showStory && (
        <>
          <StoryTemplate
            template={template}
            words={wordInputs}
            revealIndex={revealIndex}
          />{" "}
          <br />
          <label htmlFor="revealIndexInput"></label>Reveal the Words
          <input
            id="revealIndexInput"
            type="number"
            value={revealIndex}
            onChange={(event) => setRevealIndex(Number(event.target.value))}
          ></input>
        </>
      )}
    </div>
  );
};

export default StoryEngine;
