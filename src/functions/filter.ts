import { boolean, z } from "zod";

export type Category =
    | "Agriculture, food, and drink"
    | "Art and architecture"
    | "Engineering and technology"
    | "Geography and places"
    | "History"
    | "Language and literature"
    | "Mathematics"
    | "Media and drama"
    | "Music"
    | "Natural sciences"
    | "Philosophy and religion"
    | "Social sciences and society"
    | "Sports and recreation"
    | "Video games"
    | "Warfare";

export type Filter = { [key in Category]: boolean };

export const default_filters: Filter = {
    "Agriculture, food, and drink": false,
    "Art and architecture": false,
    "Engineering and technology": false,
    "Geography and places": false,
    History: false,
    "Language and literature": false,
    Mathematics: false,
    "Media and drama": false,
    Music: false,
    "Natural sciences": false,
    "Philosophy and religion": false,
    "Social sciences and society": false,
    "Sports and recreation": false,
    "Video games": false,
    Warfare: false,
};

export function generate_category(filter: Filter) {
    const possible = [];

    for (const category in filter) {
        if (filter[category]) {
            possible.push(category);
        }
    }

    if (!possible.length) {
        return Object.keys(filter)[
            Math.floor(Math.random() * Object.keys(filter).length)
        ] as Category;
    }

    return possible[Math.floor(Math.random() * possible.length)] as Category;
}
