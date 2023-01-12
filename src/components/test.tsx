import React, { useEffect } from "react";
import { api } from "../utils/api";
import { useState } from "react";
import getAnchors from "../functions/get_anchors";
import {
    default_filters,
    Filter,
    generate_category,
    Category,
} from "../functions/filter";
import Filters from "./filters";
import { default_score, Score } from "../functions/score";
import nextRound from "../functions/score";
import check_answer from "../functions/check_answer";
import Form from "./form";
import { defaultLink } from "../functions/link";
import Timer from "./timer";

export default function Test() {
    const [filter, setFilter] = useState(default_filters);
    const [link, setLink] = useState(defaultLink);
    const [score, setScore] = useState(default_score);

    //change link state to trigger useQuery
    useEffect(() => {
        setLink({
            ...link,
            category: generate_category(filter),
        });
    }, [link.fetch]);

    //useQuery to get new link
    const linkTest = api.example.getLink.useQuery(
        { fetch: link.fetch, category: link.category },
        {
            refetchOnWindowFocus: false,
            onSuccess(data: string) {
                setLink({ ...link, html: data });
            },
        }
    );

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
            });
        }
    }, [score.submission]);

    return (
        <>
            <div>
                <Filters setFilter={setFilter} filter={filter} />
            </div>
            {/* clear form field on new round, get rid of auto fill */}
            <div>
                <Form setScore={setScore} score={score} />
            </div>
            <div>Score: {score.score}</div>
            <div>Round: {score.round}</div>
            <button onClick={() => nextRound(score, setScore, link, setLink)}>
                New Round
            </button>

            <div>
                <Timer round={score.round} score={score} setScore={setScore} />
            </div>
            <div>Category: {link.category}</div>
            <div>Wiki Article: {anchors.title}</div>
            <div>Linked Pages: {anchors.anchors.join(", ")}</div>
        </>
    );
}
