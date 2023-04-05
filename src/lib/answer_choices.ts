export interface AnswerChoices {
    mainArticle: string;
    subArticle: string;
    correct: string;
    incorrect: string[];
}

export const defaultAnswerChoices: AnswerChoices = {
    mainArticle: "",
    subArticle: "",
    correct: "",
    incorrect: [""],
};
