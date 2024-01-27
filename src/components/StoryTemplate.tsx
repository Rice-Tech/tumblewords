import { useState, useEffect, Fragment } from "react";

interface Props {
  templateProp: string;
}
interface WordInput {
  word: string;
  partOfSpeech: string;
}

const StoryTemplate = ({ templateProp }: Props) => {
  const [completedMadLib, setCompletedMadLib] = useState<JSX.Element>(
    <Fragment></Fragment>
  );
  const [template /*, setTemplate*/] = useState<string>(templateProp);
  const [wordInputs, setWordInputs] = useState<WordInput[]>([]);
  const [revealIndex, setRevealIndex] = useState(0);
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

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const completedMadLib = fillInTemplate(template, wordInputs);
    setCompletedMadLib(completedMadLib);
  };

  const fillInTemplate = (
    template: string,
    words: WordInput[]
  ): JSX.Element => {
    const parts: JSX.Element[] = [];
    console.log(template);
    console.table(template.split(/\{(\w+)\}/g));
    template.split(/\{(\w+)\}/g).forEach((part, i) => {
      const wordIndex = Math.floor(i / 2);
      if (!(i % 2)) {
        parts.push(<Fragment key={i}>{part}</Fragment>);
      } else {
        if (wordIndex < words.length) {
          parts.push(
            <span
              key={`filledWord-${i}`}
              className={
                `filledWord visible filledWord${i}`
              }
            >
              {words[wordIndex].word}{" "}
              <div className="posTooltip" hidden>
                {part}
              </div>
            </span>
          );
        }
      }
    });

    return <Fragment>{parts}</Fragment>;
  };

  useEffect(() => {
    setWordInputs(parseTemplate(template));
  }, [template]);

  return (
    <div>
      <form onSubmit={handleSubmit}>
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
        <button type="submit">Generate Mad Lib</button>
      </form>
      <p className="storyTemplate">{completedMadLib}</p>
      <input
        type="number"
        onChange={(event) => setRevealIndex(Number(event.target.value))}
      ></input>
      <p>{revealIndex}</p>
    </div>
  );
};

export default StoryTemplate;
