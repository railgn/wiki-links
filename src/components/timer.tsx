import React, { useState, useRef, useEffect } from "react";
import type { Score } from "@lib/score";
import type { Socket } from "socket.io";
import type { DefaultEventsMap } from "socket.io/dist/typed-events";

interface Props {
    round: number;
    score: Score;
    setScore: (score: Score) => void;
    socket?: Socket<DefaultEventsMap, DefaultEventsMap>;
    isLeader: boolean;
    pid: string;
    roundTime: number;
}

export default function Timer({
    round,
    score,
    setScore,
    socket,
    isLeader,
    pid,
    roundTime,
}: Props) {
    const Ref = useRef<any | null>(null);

    const [timer, setTimer] = useState(roundTime.toString());

    const [winTime, setWinTime] = useState("00");

    const [endText, setEndText] = useState("hi");

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
        const { total, seconds } = getTimeRemaining(e);

        if (total >= 0) {
            setTimer(seconds.toString());
        }
    };

    const clearTimer = (e: Date) => {
        // If you adjust it you should also need to
        // adjust the Endtime formula we are about
        // to code next
        setTimer(roundTime.toString());

        if (Ref.current != null) clearInterval(Ref.current);
        const id = setInterval(() => {
            startTimer(e);
        }, 1000);
        Ref.current = id as any;
    };

    // set reset time amount
    const getDeadTime = () => {
        const deadline = new Date();

        // set here too
        deadline.setSeconds(deadline.getSeconds() + roundTime);
        return deadline;
    };

    if (socket != null && !isLeader) {
        socket.on("pull deadline", (deadline) => {
            clearTimer(deadline);
        });
    }

    // set timer on mount
    useEffect(() => {
        if (isLeader) {
            const deadline = getDeadTime();

            // change round here as well?????
            socket?.emit("post deadline", pid, deadline);

            clearTimer(deadline);
        }
    }, [round]);

    useEffect(() => {
        if (score.correct_answer) {
            setScore({
                ...score,
                score:
                    score.score +
                    Math.round((1000 * parseInt(timer)) / roundTime),
                streak: score.streak + 1,
            });
            setEndText(
                `You earned ${Math.round(
                    (1000 * parseInt(timer)) / roundTime
                )} points!`
            );
        } else {
            setEndText(`Incorrect!`);
        }
    }, [score.correct_answer]);

    useEffect(() => {
        setWinTime(timer);
    }, [score.submission]);

    useEffect(() => {
        if (timer === "0") {
            if (score.submission === "waiting" && !score.correct_answer) {
                setScore({
                    ...score,
                    round_over: true,
                    streak: 0,
                });
            }
        }
    }, [timer]);

    return (
        <div>
            {score.submission === "waiting" && timer !== "0" && (
                <h2>Time Left: {timer}</h2>
            )}
            {score.submission !== "waiting" && <h2>{endText}</h2>}
            {score.submission === "waiting" && timer === "0" && (
                <h2>Time Over!</h2>
            )}
        </div>
    );
}
