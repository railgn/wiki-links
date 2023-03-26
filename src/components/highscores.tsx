import { HighScoreType } from "../functions/highscore";
import Score from "./score";

type Props = {
    highscores: HighScoreType[];
    name: string;
    score: number;
    categories: string;
};

export default function HighScores({
    highscores,
    name,
    score,
    categories,
}: Props) {
    const renderHighScores = (
        highscores: HighScoreType[],
        name: string,
        score: number,
        categories: string
    ) => {
        const result = [];
        let key = 1;
        for (const highscore of highscores) {
            result.push(
                <Score
                    highscore={highscore}
                    name={name}
                    score={score}
                    categories={categories}
                    mykey={key}
                />
            );
            key++;
        }

        return result;
    };

    return (
        <div>
            <table>
                <tr>
                    <th>Rank</th>
                    <th>Name</th>
                    <th>Categories</th>
                    <th>Score</th>
                    <th>Date</th>
                </tr>

                {highscores.length > 5 && (
                    <>{renderHighScores(highscores, name, score, categories)}</>
                )}
            </table>
        </div>
    );
}
