import { Score } from "../functions/score";
import { useEffect, useState } from "react";

type Props = {
    setScore: (score: Score) => void;
    score: Score;
};

export default function Form({ setScore, score }: Props) {
    const [message, setMessage] = useState("");

    const handleSubmit = (event: any) => {
        event.preventDefault();

        const input: string = event.target.password.value;
        if (
            input !== "" &&
            input !== score.submission &&
            !score.correct_answer
        ) {
            setScore({
                ...score,
                submission: input,
            });
        }
    };

    const handleChange = (event: any) => {
        if (!score.correct_answer) {
            setMessage(event.target.value);
        }
    };

    const handleFocus = (event: any) => {
        if (!score.correct_answer) {
            setMessage("");
        }
    };

    useEffect(() => {
        if (!score.correct_answer) {
            setMessage("");
        }
    }, [score.submission]);

    useEffect(() => {
        if (score.correct_answer) {
            setMessage(score.submission);
        }
    }, [score.correct_answer]);

    useEffect(() => {
        setMessage("");
    }, [score.round]);

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                id="password"
                name="password"
                placeholder="type your answer"
                defaultValue=""
                value={message}
                onChange={handleChange}
                onFocus={handleFocus}
                required
            />
            {/* <button type="submit">Submit</button> */}
        </form>
    );
}
