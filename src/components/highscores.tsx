import type { HighScore } from "@lib/highscore";
import Score from "./score";

interface Props {
    highscores: HighScore[];
    name: string;
    score: number;
    categories: string;
}

export default function HighScores({
    highscores,
    name,
    score,
    categories,
}: Props) {
    const renderHighScores = (
        highscores: HighScore[],
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
            <h3>Highscores:</h3>
            <div>
                <table>
                    <tr>
                        <th>Rank</th>
                        <th>Name</th>
                        <th>Categories</th>
                        <th>Rounds</th>
                        <th>Score</th>
                        <th>Date</th>
                    </tr>

                    {highscores.length > 2 && (
                        <>
                            {renderHighScores(
                                highscores,
                                name,
                                score,
                                categories
                            )}
                        </>
                    )}
                </table>
            </div>
        </div>
    );
}
