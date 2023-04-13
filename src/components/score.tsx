import type { HighScore } from "@lib/highscore";
import styles from "../styles/score.module.css";

interface Props {
    highscore?: HighScore;
    name: string;
    score: number;
    categories: string;
    mykey: number;
}

export default function Score({
    highscore,
    name,
    score,
    categories,
    mykey,
}: Props) {
    let thisIsYourScore = false;

    if (
        highscore?.score === score &&
        highscore?.name === name &&
        highscore?.categories === categories
    ) {
        thisIsYourScore = true;
    }

    const date = highscore?.date;

    const dateFormat = (date: Date) => {
        const mm = date.getMonth() + 1;
        const dd = date.getDate();

        return [mm, dd, date.getFullYear()].join("-");
    };

    let dateDisplay = "";
    if (date != null) {
        dateDisplay = dateFormat(date);
    }

    let rowStyle = styles.normal;

    if (thisIsYourScore) {
        rowStyle = styles.you;
    }

    return (
        // make this a table row instead of a div
        <tr key={mykey} className={rowStyle}>
            <td>{mykey}</td>
            <td>{highscore?.name}</td>
            <td>{highscore?.categories}</td>
            <td>{highscore?.rounds}</td>
            <td>{highscore?.score}</td>
            <td>{dateDisplay}</td>

            {/* {thisIsYourScore && <span>Congrats on the highscore!</span>} */}
        </tr>
    );
}
