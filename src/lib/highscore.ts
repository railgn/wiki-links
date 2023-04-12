export interface HighScore {
    score: number;
    name: string | null;
    date: Date;
    categories: string;
    rounds: number | null;
}
