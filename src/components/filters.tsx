import React from "react";
import { Filter, Category } from "../functions/filter";
import Checkbox from "./checkbox";

type Props = {
    setFilter: (state: Filter) => void;
    filter: Filter;
    isLeader: boolean;
};

export default function Filters({ setFilter, filter, isLeader }: Props) {
    const renderFilters = (filter: Filter) => {
        const result = [];
        let key = 1;
        for (const category in filter) {
            result.push(
                <Checkbox
                    isLeader={isLeader}
                    setFilter={setFilter}
                    filter={filter}
                    category={category as Category}
                    mykey={key}
                />
            );
            key++;
        }

        return <>{result}</>;
    };

    return <div>{renderFilters(filter)}</div>;
}
