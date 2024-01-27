import { useState, useEffect } from "react";

interface Props {
  templateProp: string;
}
interface WordInput {
  word: string;
  partOfSpeech: string;
}

const StoryTemplate = ({ templateProp }: Props) => {
  const [template /*, setTemplate*/] = useState<string>(templateProp);
  const [wordInputs, setWordInputs] = useState<WordInput[]>([]);
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

  const fillInTemplate = (template: string, words: WordInput[]): string => {
    //let index = 0; // Initialize index for multiple occurrences
    let index = 0;
    return template.replace(/\{(\w+)\}/g, (match, key) => {
      //const word = words[key];
      console.log(key, index);
      if (words[index]) {
        // Replace the placeholder with the word from the dictionary
        const filledWord = `<span class="filled-word-${index++}">${
          words[index - 1].word
        }</span>`;
        return filledWord;
      } else {
        // If word not found, keep the placeholder unchanged
        return match;
      }
    });
  };

  const [completedMadLib, setCompletedMadLib] = useState<string>("");

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
      <p
        className="storyTemplate"
        dangerouslySetInnerHTML={{ __html: completedMadLib }}
      ></p>
    </div>
  );
};

export default StoryTemplate;
