import React, { useEffect } from "react";
import { api } from "../utils/api";
import { useState } from "react";
import getAnchors from "../functions/game_start";
import {
    default_filters,
    Filter,
    generate_category,
    Category,
} from "../functions/filter";
import Filters from "./filters";

export default function Test() {
    const [filter, setFilter] = useState(default_filters);
    const [link, setLink] = useState({
        fetch: false,
        category: "Natural sciences" as Category,
        html: "hi",
    });

    useEffect(() => {
        setLink({
            ...link,
            category: generate_category(filter),
        });
    }, [link.fetch]);

    const linkTest = api.example.getLink.useQuery(
        { fetch: link.fetch, category: link.category },
        {
            refetchOnWindowFocus: false,
            onSuccess(data: string) {
                setLink({ ...link, html: data });
            },
        }
    );

    const anchors = getAnchors(link.html);

    if (anchors.fetch) {
        setLink({ ...link, fetch: !link.fetch });
    }

    return (
        <>
            <div>
                <div>
                    <Filters setFilter={setFilter} filter={filter} />
                </div>
            </div>
            <button
                onClick={() => {
                    setLink({
                        ...link,
                        fetch: !link.fetch,
                    });
                }}
            >
                New link
            </button>

            <div>Category: {link.category}</div>
            <div>Wiki Article: {anchors.title}</div>
            <div>Linked Pages: {anchors.anchors.join(", ")}</div>
        </>
    );
}
