import { useEffect, useState } from "react";

import type { Category, Filter } from "@lib/filter";
import { type Game, categorySelect, startGame } from "@lib/game";
import type { HighScore } from "@lib/highscore";
import type { Link } from "@lib/link";
import type { Score } from "@lib/score";

import { api } from "../utils/api";

import HighScores from "./highscores";
import styles from "../styles/gameOver.module.css";

interface Props {
    score: Score;
    game: Game;
    setGame: (game: Game) => void;
    setScore: (score: Score) => void;
    link: Link;
    setLink: (link: Link) => void;
    filter: Filter;
    name: string;
    isLeader: boolean;
    isSpectator: boolean;
    numberOfRounds: number;
}

export default function GameOver({
    score,
    game,
    setGame,
    setScore,
    link,
    setLink,
    filter,
    name,
    isLeader,
    isSpectator,
    numberOfRounds,
}: Props) {
    const [postScore, setPostScore] = useState(false);
    const [highScores, setHighScores] = useState<HighScore[]>([]);
    const [categoryState, setCategoryState] = useState("");
    const [fetchScores, setFetchScores] = useState(false);

    // post score to database

    const { mutate } = api.example.postScore.useMutation({
        retry: false,
        onSuccess(_data) {
            setFetchScores(true);
        },
    });

    // TODO: check if isSpectator should be in deps array
    useEffect(() => {
        if (isSpectator) {
            setFetchScores(true);
        }
    }, []);

    useEffect(() => {
        setPostScore((newestPostScoreValue) => {
            if (!(game.game_over && !newestPostScoreValue) || isSpectator) {
                return false;
            }

            const categories: string[] = [];

            for (const category of Object.keys(filter) as Category[]) {
                if (filter[category]) {
                    categories.push(category);
                }
            }

            if (categories.length === 0) {
                categories.push("All");
            }

            setCategoryState(categories.join(", "));

            console.log("posting score to DB");

            mutate({
                categories,
                name,
                score: score.score,
                rounds: numberOfRounds,
            });
            return true;
        });
    }, [game.game_over]);

    // retrieve top 10 scores from database

    const getScores = api.example.getScores.useQuery(
        {
            fetch: fetchScores,
            rounds: numberOfRounds,
        },
        {
            refetchOnWindowFocus: false,

            onSuccess(data) {
                setHighScores(data);
            },
        }
    );

    return (
        <div className={styles.gameOverContainer}>
            {/* <div>Name: {name}</div>
            <div>Score: {score.score}</div>
            <div>Categories: {categoryState}</div>

            <div className={styles.verticalPadding} /> */}

            {/* display top 10 scores */}

            <HighScores
                highscores={highScores}
                name={name}
                score={score.score}
                categories={categoryState}
            />

            {isLeader && (
                <div>
                    <button
                        onClick={() =>
                            startGame(
                                score,
                                setScore,
                                link,
                                setLink,
                                filter,
                                game,
                                setGame
                            )
                        }
                    >
                        Play Again
                    </button>
                    &nbsp; &nbsp;
                    <button
                        onClick={() => categorySelect(setScore, game, setGame)}
                    >
                        Lobby Options
                    </button>
                </div>
            )}
        </div>
    );
}
