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
        let key = 1;
        for (const category in filter) {
            result.push(
                //@ts-ignore
                <Checkbox
                    setFilter={setFilter}
                    filter={filter}
                    category={category as Category}
                    key={key}
                />
            );
            key++;
        }

        return <>{result}</>;
    };

    return <div>{renderFilters(filter)}</div>;
}
