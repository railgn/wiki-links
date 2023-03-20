import React, { useState, useRef, useEffect } from "react";
import { Score } from "../functions/score";

type Props = {
    round: number;
    score: Score;
    setScore: (score: Score) => void;
};

export default function Timer({ round, score, setScore }: Props) {
    const Ref = useRef(null);

    const [timer, setTimer] = useState("30");

    const [win_time, setWinTime] = useState("00");

    const [end_text, setEndText] = useState("hi");

    const getTimeRemaining = (e: Date) => {
        const total =
            Date.parse(e.toString()) - Date.parse(new Date().toString());
        const seconds = Math.floor((total / 1000) % 60);

        return {
            total,
            seconds,
        };
    };

    const startTimer = (e: Date) => {
        let { total, seconds } = getTimeRemaining(e);

        if (total >= 0) {
            setTimer(seconds.toString());
        }
    };

    const clearTimer = (e: Date) => {
        // If you adjust it you should also need to
        // adjust the Endtime formula we are about
        // to code next
        setTimer("30");

        if (Ref.current) clearInterval(Ref.current);
        const id = setInterval(() => {
            startTimer(e);
        }, 1000);
        Ref.current = id as any;
    };

    //set reset time amount
    const getDeadTime = () => {
        let deadline = new Date();

        //set here too
        deadline.setSeconds(deadline.getSeconds() + 30);
        return deadline;
    };

    //set timer on mount
    useEffect(() => {
        clearTimer(getDeadTime());
    }, [round]);

    useEffect(() => {
        if (score.correct_answer) {
            setScore({
                ...score,
                score: score.score + 100 * parseInt(timer),
            });
            setEndText(`You earned ${parseInt(win_time) * 100} points!`);
        } else {
            setEndText(`Incorrect!`);
        }
    }, [score.correct_answer]);

    useEffect(() => {
        setWinTime(timer);
    }, [score.submission]);

    useEffect(() => {
        if (timer == "0") {
            setScore({
                ...score,
                round_over: true,
            });
        }
    }, [timer]);

    return (
        <div>
            {score.submission === "waiting" && <h2>Time Left: {timer}</h2>}
            {score.submission !== "waiting" && <h2>{end_text}</h2>}
        </div>
    );
}
