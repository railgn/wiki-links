import { Score } from "../functions/score";
import { useEffect, useState } from "react";
import Button from "./button";

type Props = {
    setScore: (score: Score) => void;
    score: Score;
    correct_anchors: string[];
    incorrect_anchor: string;
    mainArticle: string;
    subArticle: string;
};

export type ButtonReturn = "correct" | "incorrect" | "waiting";

export default function FormMC({
    setScore,
    score,
    correct_anchors,
    incorrect_anchor,
    mainArticle,
    subArticle,
}: Props) {
    const [buttonReturn, setButtonReturn] = useState("waiting" as ButtonReturn);
    const [buttonOrder, setButtonOrder] = useState([0, 1, 2, 3]);

    useEffect(() => {
        const buttonLength = 4;
        const result: number[] = [];
        const indexArr = new Array(buttonLength).fill(0).map((elem, i) => i);

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
        correct_anchors: string[],
        incorrect_anchor: string
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
                display: incorrect_anchor,
                answer: "correct",
                article: subArticle,
                color: "green",
            },
        ];

        for (const anchor of correct_anchors) {
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
            result.push(
                <div>
                    <Button
                        setButtonReturn={setButtonReturn}
                        // @ts-ignore
                        buttonReturn={buttonInfo[buttonOrder[i]].answer}
                        // @ts-ignore
                        display={buttonInfo[buttonOrder[i]].display}
                        // @ts-ignore
                        article={buttonInfo[buttonOrder[i]].article}
                        // @ts-ignore
                        color={buttonInfo[buttonOrder[i]].color}
                        roundOver={score.round_over}
                        mykey={key}
                    />
                </div>
            );
            key++;
        }

        return <>{result}</>;
    };

    //set score state on change
    useEffect(() => {
        if (!score.round_over && !score.correct_answer) {
            console.log(buttonReturn);

            setScore({
                ...score,
                submission: buttonReturn,
                streak: buttonReturn === "incorrect" ? 0 : score.streak,
            });
        }
    }, [buttonReturn]);

    //reset buttonReturn
    useEffect(() => {
        setButtonReturn("waiting");
    }, [score.round]);

    const empty = () => {
        return correct_anchors.filter((elem) => elem == "").length > 0;
    };

    return (
        <>
            {!empty() && (
                <>
                    <div>
                        {renderButtons(correct_anchors, incorrect_anchor)}
                    </div>
                </>
            )}
        </>
    );
}
