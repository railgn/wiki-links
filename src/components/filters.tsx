import React from "react";
import { Filter, Category } from "../functions/filter";
import Checkbox from "./checkbox";

type Props = {
    setFilter: (state: Filter) => void;
    filter: Filter;
};

export default function Filters({ setFilter, filter }: Props) {
    const renderFilters = (filter: Filter) => {
        const result = [];
        for (const category in filter) {
            result.push(
                <Checkbox
                    setFilter={setFilter}
                    filter={filter}
                    category={category as Category}
                />
            );
        }

        return [<div>{result}</div>];
    };

    return <div>{renderFilters(filter)}</div>;
}
