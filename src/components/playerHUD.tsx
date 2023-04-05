import { Game } from "../functions/game";

type Props = {
    name: string;
    score: number;
    isLeader: boolean;
    roundOver: boolean;
    correct: boolean;
    key: number;
    game: Game;
};

export default function PlayerHUD({
    name,
    score,
    key,
    isLeader,
    roundOver,
    correct,
    game,
}: Props) {
    return (
        <div key={key}>
            <div>
                {name}
                &nbsp;
                {isLeader && <>&#128081;</>}
            </div>
            <div>
                Score: {score} &nbsp;
                {!game.filter_select &&
                    !game.game_over &&
                    (roundOver ? (
                        correct ? (
                            <>&#128994;</>
                        ) : (
                            <>&#128308;</>
                        )
                    ) : (
                        <></>
                    ))}
            </div>
        </div>
    );
}
