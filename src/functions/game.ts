import { Score } from "./score";
import { Link } from "./link";
import { Filter } from "./filter";
import { generate_category } from "./filter";

export type Game = {
    filter_select: boolean;
};

export const default_game: Game = {
    filter_select: true,
};

export default function startGame(
    score: Score,
    setScore: (score: Score) => void,
    link: Link,
    setLink: (link: Link) => void,
    filter: Filter,
    game: Game,
    setGame: (game: Game) => void
) {
    setScore({
        score: score.score,
        correct_answer: false,
        round: score.round + 1,
        submission: "",
        round_over: false,
    });

    setLink({
        ...link,
        category: generate_category(filter),
        fetch: !link.fetch,
    });

    setGame({
        ...game,
        filter_select: false,
    });
}
