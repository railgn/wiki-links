import React, { useEffect } from "react";
import { api } from "../utils/api";
import { useState } from "react";
import getAnchors from "../functions/get_anchors";
import { default_filters } from "../functions/filter";
import Filters from "./filters";
import { default_score } from "../functions/score";
import nextRound from "../functions/score";
import check_answer from "../functions/check_answer";
import Form from "./form";
import { defaultLink } from "../functions/link";
import Timer from "./timer";
import { default_game } from "../functions/game";
import pickRandomAnchors from "../functions/pick_random_anchors";
import startGame from "../functions/game";

export default function Game() {
    const [game, setGame] = useState(default_game);
    const [filter, setFilter] = useState(default_filters);
    const [link, setLink] = useState(defaultLink);
    const [score, setScore] = useState(default_score);
    const [anchors, setAnchors] = useState({ title: "", anchors: [""] });
    const [possible_answers, setPossible_answers] = useState("");

    //get a new link from data
    const linkTest = api.example.getLink.useQuery(
        { fetch: link.fetch, category: link.category },
        {
            refetchOnWindowFocus: false,

            onSuccess(data) {
                setLink({ ...link, html: data });
            },
        }
    );

    //scrape link for anchors
    useEffect(() => {
        setAnchors(getAnchors(link.html));
    }, [link.html]);

    //reset article on new round before http request
    useEffect(() => {
        setAnchors({
            anchors: [""],
            title: "",
        });
    }, [score.round]);

    //handle submissions
    useEffect(() => {
        if (!score.submission || score.correct_answer) {
            return;
        }

        if (check_answer(score.submission, anchors.anchors)) {
            setScore({
                ...score,
                correct_answer: true,
                round_over: true,
            });
        }
    }, [score.submission]);

    //pick example answers for the round
    useEffect(() => {
        setPossible_answers(pickRandomAnchors(anchors.anchors, 3).join(", "));
    }, [anchors.anchors]);

    return (
        <>
            {/* category filters */}
            {game.filter_select && (
                <>
                    <div>
                        <Filters setFilter={setFilter} filter={filter} />
                    </div>
                    <button
                        onClick={() =>
                            startGame(
                                score,
                                setScore,
                                link,
                                setLink,
                                filter,
                                game,
                                setGame
                            )
                        }
                    >
                        Start Game
                    </button>
                </>
            )}

            {/* game rounds */}
            {!game.filter_select && (
                <>
                    <div>Round: {score.round}</div>
                    <div>Score: {score.score}</div>
                    <div>Category: {link.category}</div>
                    <div>Wiki Article: {anchors.title}</div>

                    <div>
                        <Timer
                            round={score.round}
                            score={score}
                            setScore={setScore}
                        />
                    </div>

                    {/* submission input */}
                    <div>
                        <Form setScore={setScore} score={score} />
                    </div>

                    {score.round_over && (
                        <>
                            {!score.correct_answer && (
                                <>
                                    <div>
                                        Possible Answers: {possible_answers}
                                    </div>
                                </>
                            )}

                            {score.correct_answer && (
                                <>
                                    <div>
                                        Other possible answers:{" "}
                                        {possible_answers}
                                    </div>
                                </>
                            )}

                            <button
                                onClick={() =>
                                    nextRound(
                                        score,
                                        setScore,
                                        link,
                                        setLink,
                                        filter
                                    )
                                }
                            >
                                New Round
                            </button>
                        </>
                    )}

                    {/* answers for cheating */}

                    <div>(possible answers): {anchors.anchors.join(", ")}</div>
                </>
            )}
        </>
    );
}
