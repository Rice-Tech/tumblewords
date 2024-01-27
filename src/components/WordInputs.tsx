import { WordInput } from "./StoryEngine"
import { Input } from "./ui/input";

interface Props{
    wordsList:WordInput[];
    onChange: (e:React.ChangeEvent<HTMLInputElement>, index:number)=>void;
}
const WordInputs = ({wordsList, onChange}:Props) => {
  return (
    <div className="wordInputs">
    {wordsList.map((input, index) => (
        <div key={index}>
          <label>
            {input.partOfSpeech}:
            <Input
              type="text"
              value={input.word}
              onChange={(e) => onChange(e, index)}
            />
          </label>
          <br />
        </div>
      ))}
  </div>
  )
}

export default WordInputs