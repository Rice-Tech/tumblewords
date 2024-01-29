import { WordInput } from "./StoryEngine";
import { Fragment } from "react";
interface Props {
  template: string;
  words: WordInput[];
  revealIndex: number;
}

const StoryTemplate = ({ template, words, revealIndex }: Props) => {
  const splitTemplate = template.split(/\{(\w+)\}/g);
  return (
    <div className="storyTemplate">
      {splitTemplate.map((part, i) => {
        const wordIndex = Math.floor(i / 2);
        if (!(i % 2)) {
          return <Fragment key={i}>{part}</Fragment>;
        } else {
          if (wordIndex < words.length) {
            let retWord = "";
            const retWords = words.filter((word) => {
              return word.index == wordIndex;
            });

            if (!retWords[0]) {
              retWord = "something just to fill in";
            } else {
              retWord = retWords[0].word;
            }
            if (retWord==="") {
              retWord = "no words submitted";
            }
            return (
              <span
                key={`filledWord-${i}`}
                className={
                  revealIndex > wordIndex
                    ? "filledWord revealedWord"
                    : "filledWord hiddenWord"
                }
              >
                {retWord}{" "}
                <div className="posTooltip" hidden>
                  {part}
                </div>
              </span>
            );
          }
        }
      })}
    </div>
  );
};

export default StoryTemplate;
