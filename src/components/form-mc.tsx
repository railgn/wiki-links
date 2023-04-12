import { useEffect, useState } from "react";

import type { Score } from "@lib/score";

import Button, { type ButtonReturn } from "./button";

import styles from "../styles/formMC.module.css";

interface Props {
    setScore: (score: Score) => void;
    score: Score;
    correctAnchors: string[];
    incorrectAnchor: string;
    mainArticle: string;
    subArticle: string;
    isSpectator: boolean;
}

export default function FormMC({
    setScore,
    score,
    correctAnchors,
    incorrectAnchor,
    mainArticle,
    subArticle,
    isSpectator,
}: Props) {
    const [buttonReturn, setButtonReturn] = useState<ButtonReturn>("waiting");
    const [buttonOrder, setButtonOrder] = useState([0, 1, 2, 3]);

    useEffect(() => {
        const buttonLength = 4;
        const result: number[] = [];
        const indexArr = new Array(buttonLength).fill(0).map((_, i) => i);

        for (let i = 0; i < buttonLength; i++) {
            const index = indexArr[
                Math.floor(Math.random() * indexArr.length)
            ] as number;

            result.push(index);

            indexArr.splice(indexArr.indexOf(index), 1);
        }

        setButtonOrder(result);
    }, [score.round]);

    const renderButtons = (
        correctAnchors: string[],
        incorrectAnchor: string
    ) => {
        const buttonInfo: [
            {
                display: string;
                answer: ButtonReturn;
                article: string;
                color: string;
            }
        ] = [
            {
                display: incorrectAnchor,
                answer: "correct",
                article: subArticle,
                color: "green",
            },
        ];

        for (const anchor of correctAnchors) {
            buttonInfo.push({
                display: anchor,
                answer: "incorrect",
                article: mainArticle,
                color: "red",
            });
        }

        const result = [];

        let key = 1;

        for (let i = 0; i < buttonInfo.length; i++) {
            // SAFETY: we are guaranteed this is the same length.
            const info = buttonInfo[buttonOrder[i]!]!;
            result.push(
                <Button
                    setButtonReturn={setButtonReturn}
                    buttonReturn={info.answer}
                    display={info.display}
                    article={info.article}
                    color={info.color}
                    roundOver={score.round_over}
                    mykey={key}
                    isSpectator={isSpectator}
                />
            );
            key++;
        }

        return <div className={styles.inputContainer}>{result}</div>;
    };

    // set score state on change
    useEffect(() => {
        if (!score.round_over && !score.correct_answer) {
            console.log(buttonReturn);

            setScore({
                ...score,
                submission: buttonReturn,
                streak: buttonReturn === "incorrect" ? 0 : score.streak,
            });
        }
        // eslint-disable-next-line
    }, [buttonReturn]);

    // reset buttonReturn
    useEffect(() => {
        setButtonReturn("waiting");
    }, [score.round]);

    const empty = () => {
        return correctAnchors.filter((elem) => elem === "").length > 0;
    };

    return (
        <>
            {!empty() && (
                <div className={styles.FormMC}>
                    {renderButtons(correctAnchors, incorrectAnchor)}
                </div>
            )}
        </>
    );
}
