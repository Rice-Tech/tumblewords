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
            return (
              <span
                key={`filledWord-${i}`}
                className={
                  revealIndex > wordIndex
                    ? "filledWord revealedWord"
                    : "filledWord hiddenWord"
                }
              >
                {
                  words.filter((word) => {
                    return word.index == wordIndex;
                  })[0].word
                }{" "}
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
