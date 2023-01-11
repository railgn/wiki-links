import { Score } from "../functions/score";

type Props = {
    setScore: (score: Score) => void;
    score: Score;
};

export default function Form({ setScore, score }: Props) {
    const handleSubmit = (event: any) => {
        event.preventDefault();

        const input: string = event.target.password.value;
        if (
            input !== "" &&
            input !== score.submission &&
            !score.correct_answer
        ) {
            setScore({
                ...score,
                submission: input,
            });
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                id="password"
                name="password"
                placeholder="type your answer"
                defaultValue=""
                required
            />
            <button type="submit">Submit</button>
        </form>
    );
}
