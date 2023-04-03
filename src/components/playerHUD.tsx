type Props = {
    name: string;
    score: number;
    isLeader: boolean;
    roundOver: boolean;
    correct: boolean;
    key: number;
};

export default function PlayerHUD({
    name,
    score,
    key,
    isLeader,
    roundOver,
    correct,
}: Props) {
    return (
        <div key={key}>
            {name}
            {isLeader && <>&#128081;</>} <div /> Score: {score} <div /> Finished
            Round?: {roundOver ? "Yes" : "No"} <div /> Correct:{" "}
            {correct ? <>&#128994;</> : <>&#128308;</>}
        </div>
    );
}
