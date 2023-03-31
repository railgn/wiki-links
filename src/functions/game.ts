import { Score } from "./score";
import { Link } from "./link";
import { Filter } from "./filter";
import { generate_category } from "./filter";
import { default_score } from "./score";

export type Game = {
    filter_select: boolean;
    game_over: boolean;
};

export const default_game: Game = {
    filter_select: true,
    game_over: false,
};

export function startGame(
    score: Score,
    setScore: (score: Score) => void,
    link: Link,
    setLink: (link: Link) => void,
    filter: Filter,
    game: Game,
    setGame: (game: Game) => void
) {
    setScore({
        score: 0,
        correct_answer: false,
        round: 1,
        submission: "waiting",
        round_over: false,
        streak: 0,
    });

    setLink({
        ...link,
        category: generate_category(filter),
        fetch: !link.fetch,
    });

    setGame({
        game_over: false,
        filter_select: false,
    });
}

export function startGame_nonLeader(
    score: Score,
    setScore: (score: Score) => void
) {
    setScore({
        score: 0,
        correct_answer: false,
        round: 1,
        submission: "waiting",
        round_over: false,
        streak: 0,
    });
}

export function categorySelect(
    setScore: (score: Score) => void,
    game: Game,
    setGame: (game: Game) => void
) {
    setScore(default_score);
    setGame({
        game_over: false,
        filter_select: true,
    });
}

export function gameOver(setGame: (game: Game) => void) {
    setGame({
        game_over: true,
        filter_select: false,
    });
}
