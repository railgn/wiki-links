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
import check_answer from "../functions/check_answer";
import Form from "./form";

export default function Test() {
    const [filter, setFilter] = useState(default_filters);
    const [link, setLink] = useState({
        fetch: false,
        category: "Natural sciences" as Category,
        html: "hi",
    });
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
                score: score.score + score.timer,
            });
        }
    }, [score.submission]);

    return (
        <>
            <div>
                <Filters setFilter={setFilter} filter={filter} />
            </div>
            <button
                onClick={() => {
                    setLink({
                        ...link,
                        category: generate_category(filter),
                    });
                }}
            >
                New link
            </button>
            <div>
                <Form setScore={setScore} score={score} />
            </div>
            <div>Score: {score.score}</div>

            {/* add a new round button */}

            {/* add a timer. once timer gets to 0, start next round automatically */}

            <div>Category: {link.category}</div>
            <div>Wiki Article: {anchors.title}</div>
            <div>Linked Pages: {anchors.anchors.join(", ")}</div>
        </>
    );
}
