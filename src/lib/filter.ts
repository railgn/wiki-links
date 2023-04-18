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
    | "Video games";

export type Filter = Record<Category, boolean>;

export const defaultFilters: Filter = {
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
};

export function generateCategory(filter: Filter) {
    const possible = [];

    for (const category of Object.keys(filter) as Category[]) {
        if (filter[category]) {
            possible.push(category);
        }
    }

    if (possible.length === 0) {
        return Object.keys(filter)[
            Math.floor(Math.random() * Object.keys(filter).length)
        ] as Category;
    }

    return possible[Math.floor(Math.random() * possible.length)] as Category;
}
