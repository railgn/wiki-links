import type { Category } from "./filter";

export interface Link {
    fetch: boolean;
    category: Category;
    html: string;
}

export const defaultLink: Link = {
    fetch: false,
    category: "Natural sciences" as Category,
    html: "hi",
};
