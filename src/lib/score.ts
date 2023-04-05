import type { Link } from "./link";
import { type Filter, generateCategory } from "./filter";

export interface Score {
    score: number;
    round: number;
    submission: string;
    correct_answer: boolean;
    round_over: boolean;
    streak: number;
}

export const defaultScore: Score = {
    score: 0,
    round: 0,
    submission: "",
    correct_answer: false,
    round_over: false,
    streak: 0,
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
        streak: score.streak,
    });

    setLink({
        ...link,
        category: generateCategory(filter),
        fetch: !link.fetch,
    });
}
