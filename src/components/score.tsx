import { useState } from "react";
import { HighScoreType } from "../functions/highscore";
import styles from "../styles/score.module.css";

type Props = {
    highscore: HighScoreType;
    name: string;
    score: number;
    categories: string;
    mykey: number;
};

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
        var mm = date.getMonth() + 1;
        var dd = date.getDate();

        return [mm, dd, date.getFullYear()].join("-");
    };

    let dateDisplay = "";
    if (date) {
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
            <td>{highscore?.score}</td>
            <td>{dateDisplay}</td>

            {thisIsYourScore && <td>Congrats on the highscore!</td>}
        </tr>
    );
}
