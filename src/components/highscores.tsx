import type { HighScore } from "@lib/highscore";
import Score from "./score";
import styles from "../styles/highscores.module.css";

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
            <h3 className={styles.highscoreTitle}>Highscores</h3>
            <div className={styles.tableClass}>
                <table>
                    <tr>
                        <th>Rank</th>
                        <th>Name</th>
                        <th>Categories</th>
                        <th>Rounds</th>
                        <th>Score</th>
                        <th>Date</th>
                    </tr>

                    {highscores.length > 1 && (
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
