import type { Game } from "@lib/game";
import styles from "../styles/playerHUD.module.css";

interface Props {
    name: string;
    score: number;
    isLeader: boolean;
    roundOver: boolean;
    correct: boolean;
    key: number;
    game: Game;
    place: number;
}

export default function PlayerHUD({
    name,
    score,
    key,
    isLeader,
    roundOver,
    correct,
    game,
    place,
}: Props) {
    let medal = <></>;

    if (place === 1) {
        medal = <>&nbsp;&#129351;</>;
    } else if (place === 2) {
        medal = <>&nbsp;&#129352;</>;
    } else if (place === 3) {
        medal = <>&nbsp;&#129353;</>;
    }

    return (
        <div key={key} className={styles.container}>
            <div>
                {isLeader && <>&#128081;</>}&nbsp;
                {name}&nbsp; |&nbsp; Score: {score}
                {!game.filter_select &&
                    !game.game_over &&
                    (roundOver ? (
                        correct ? (
                            <>&nbsp;&#128994;</>
                        ) : (
                            <>&nbsp;&#128308;</>
                        )
                    ) : (
                        <></>
                    ))}
                {game.game_over && !game.filter_select && medal}
            </div>
        </div>
    );
}
