import PlayerHUD from "./playerHUD";
import styles from "../styles/playerHUDs.module.css";

type Props = {
    players: {
        [key: string]: {
            name: string;
            score: number;
            isLeader: boolean;
            roundOver: boolean;
            correct: boolean;
        };
    };
};

export default function PlayerHUDs({ players }: Props) {
    const renderHUD = (players: {
        [key: string]: {
            name: string;
            score: number;
            isLeader: boolean;
            roundOver: boolean;
            correct: boolean;
        };
    }) => {
        const result = [];
        let key = 1;
        for (const id in players) {
            result.push(
                <PlayerHUD
                    name={players[id]!.name}
                    score={players[id]!.score}
                    isLeader={players[id]!.isLeader}
                    roundOver={players[id]!.roundOver}
                    correct={players[id]!.correct}
                    key={key}
                />
            );
            key++;
        }

        return <>{result}</>;
    };

    return <div className={styles.HUD}>{renderHUD(players)}</div>;
}
