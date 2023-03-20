import { Link } from "./link";
import { generate_category } from "./filter";
import { Filter } from "./filter";

export type Score = {
    score: number;
    round: number;
    submission: string;
    correct_answer: boolean;
    round_over: boolean;
};

export const default_score: Score = {
    score: 0,
    round: 0,
    submission: "",
    correct_answer: false,
    round_over: false,
};

export default function nextRound(
    score: Score,
    setScore: (score: Score) => void,
    link: Link,
    setLink: (link: Link) => void,
    filter: Filter
) {
    setScore({
        score: score.score,
        correct_answer: false,
        round: score.round + 1,
        submission: "waiting",
        round_over: false,
    });

    setLink({
        ...link,
        category: generate_category(filter),
        fetch: !link.fetch,
    });
}

//when they press enter, change submission to what they entered
//use Effect on submission that checks answer, if answer is correct, updated score state
//if score.correct_answer == true, lock the input field from changes
//also include an early return in the useEffect

//when round changes, set submission = "" and correct_answer = false

//make submission field flash when you submit any answer
//change it to green when you have a correct answer
