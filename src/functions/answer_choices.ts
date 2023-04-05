export type AnswerChoices = {
    mainArticle: string;
    subArticle: string;
    correct: string;
    incorrect: string[];
};

export const default_answerChoices: AnswerChoices = {
    mainArticle: "",
    subArticle: "",
    correct: "",
    incorrect: [""],
};
