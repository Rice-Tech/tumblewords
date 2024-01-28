import { WordInput } from "./StoryEngine";
import { Input } from "./ui/input";

interface Props {
  wordsList: WordInput[];
  onChange: (e: React.ChangeEvent<HTMLInputElement>, index: number) => void;
}
const WordInputs = ({ wordsList, onChange }: Props) => {
  return (
    <div className="wordInputs">
      {wordsList
        .sort((a, b) => a.index - b.index)
        .map((input, index) => (
          <label key={index}>
            {input.partOfSpeech}:
            <Input
              id={"word" + index}
              type="text"
              value={input.word}
              onChange={(e) => onChange(e, index)}
            />
          </label>
        ))}
    </div>
  );
};

export default WordInputs;
