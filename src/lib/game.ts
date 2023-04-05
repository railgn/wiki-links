import type { Score } from "./score";
import type { Link } from "./link";
import type { Filter } from "./filter";
import { generateCategory } from "./filter";
import { defaultScore } from "./score";

export interface Game {
    filter_select: boolean;
    game_over: boolean;
}

export const defaultGame: Game = {
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
        category: generateCategory(filter),
        fetch: !link.fetch,
    });

    setGame({
        game_over: false,
        filter_select: false,
    });
}

export function startGameNonLeader(
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
    setScore(defaultScore);
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
