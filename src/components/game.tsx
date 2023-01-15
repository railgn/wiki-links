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

export default function Game() {
    const [game, setGame] = useState(default_game);
    const [filter, setFilter] = useState(default_filters);
    const [link, setLink] = useState(defaultLink);
    const [score, setScore] = useState(default_score);

    //useQuery to get new link
    const linkTest = api.example.getLink.useQuery(
        { fetch: link.fetch, category: link.category },
        {
            refetchOnWindowFocus: false,

            onSuccess(data) {
                setLink({ ...link, html: data });
            },
        }
    );

    //remove when you have a seperate state for category filter and
    useEffect(() => {
        nextRound(score, setScore, link, setLink, filter);
    }, []);

    //scrape generated link for anchors
    const anchors = getAnchors(link.html);

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

    const possible_answers = pickRandomAnchors(anchors.anchors, 3).join(", ");

    return (
        <>
            {/* category filters */}
            {/* appear on filter select */}
            <div>
                <Filters setFilter={setFilter} filter={filter} />
            </div>

            {/* submission input */}
            {/* make appear on no filter select */}
            <div>
                <Form setScore={setScore} score={score} />
            </div>

            {/* make appear when no filter select */}
            <div>Score: {score.score}</div>
            <div>Round: {score.round}</div>

            {/* manual next round (generate new link, reset timer, etc.) */}
            {/* make appear only when round is over */}
            <button
                onClick={() =>
                    nextRound(score, setScore, link, setLink, filter)
                }
            >
                New Round
            </button>

            {/* make appear when no filter select */}
            <div>
                <Timer round={score.round} score={score} setScore={setScore} />
            </div>

            {/* make appear only when round is over */}
            {score.round_over && !score.correct_answer && (
                <>
                    <div>Possible Answers: {possible_answers}</div>
                </>
            )}

            <div>Category: {link.category}</div>
            <div>Wiki Article: {anchors.title}</div>
            <div>Linked Pages: {anchors.anchors.join(", ")}</div>
        </>
    );
}
