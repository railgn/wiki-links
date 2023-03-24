import { Filter } from "../functions/filter";
import { Game, categorySelect, startGame } from "../functions/game";
import { Link } from "../functions/link";
import { Score } from "../functions/score";

type Props = {
    score: Score;
    game: Game;
    setGame: (game: Game) => void;
    setScore: (score: Score) => void;
    link: Link;
    setLink: (link: Link) => void;
    filter: Filter;
};

export default function GameOver({
    score,
    game,
    setGame,
    setScore,
    link,
    setLink,
    filter,
}: Props) {
    //post score to database

    //retrieve top 10 scores from database

    return (
        <>
            <div>Your score: {score.score}</div>

            {/* display top 10 scores */}

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
