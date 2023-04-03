import { useEffect, useState } from "react";
import { Filter } from "../functions/filter";
import { Game, categorySelect, startGame } from "../functions/game";
import { Link } from "../functions/link";
import { Score } from "../functions/score";
import { api } from "../utils/api";
import { nicknames } from "../functions/nicknames";
import HighScores from "./highscores";
import { HighScoreType } from "../functions/highscore";
import styles from "../styles/gameOver.module.css";

type Props = {
    score: Score;
    game: Game;
    setGame: (game: Game) => void;
    setScore: (score: Score) => void;
    link: Link;
    setLink: (link: Link) => void;
    filter: Filter;
    name: string;
};

export default function GameOver({
    score,
    game,
    setGame,
    setScore,
    link,
    setLink,
    filter,
    name,
}: Props) {
    const [postScore, setPostScore] = useState(false);
    const [highScores, setHighScores] = useState([{} as HighScoreType]);
    const [categoryState, setCategoryState] = useState("");
    const [fetchScores, setFetchScores] = useState(false);

    //post score to database

    const { mutate } = api.example.postScore.useMutation({
        retry: false,
        onSuccess(data) {
            setFetchScores(true);
        },
    });

    useEffect(() => {
        setPostScore((newestPostScoreValue) => {
            if (!(game.game_over && !newestPostScoreValue)) return false;

            const categories: string[] = [];

            for (const category in filter) {
                //@ts-ignore
                if (filter[category]) {
                    categories.push(category);
                }
            }

            if (categories.length === 0) {
                categories.push("All");
            }

            setCategoryState(categories.join(", "));

            mutate({
                categories: categories,
                score: score.score,
                name: name,
            });
            return true;
        });
    }, [game.game_over]);

    //retrieve top 10 scores from database

    const getScores = api.example.getScores.useQuery(
        {
            fetch: fetchScores,
        },
        {
            refetchOnWindowFocus: false,

            onSuccess(data) {
                setHighScores(data);
            },
        }
    );

    return (
        <>
            <div>Name: {name}</div>
            <div>Score: {score.score}</div>
            <div>Categories: {categoryState}</div>

            <div className={styles.verticalPadding} />

            {/* display top 10 scores */}

            <HighScores
                highscores={highScores}
                name={name}
                score={score.score}
                categories={categoryState}
            />

            <div>
                <button onClick={() => categorySelect(setScore, game, setGame)}>
                    Category Select
                </button>
                &nbsp; &nbsp;
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
            </div>
        </>
    );
}
