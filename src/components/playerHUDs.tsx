import { type Game, gameOver } from "@lib/game";

import PlayerHUD from "./playerHUD";
import styles from "../styles/playerHUDs.module.css";

type Players = Record<string, Player>;
interface Player {
    name: string;
    score: number;
    isLeader: boolean;
    roundOver: boolean;
    correct: boolean;
}

interface Props {
    players: Players;
    name: string;
    game: Game;
}

export default function PlayerHUDs({ players, name, game }: Props) {
    const renderHUD = (players: Players, game: Game) => {
        const result = [];
        let key = 1;
        for (const id in players) {
            if (players[id]?.name === name) {
                result.unshift(
                    <PlayerHUD
                        name={players[id]!.name}
                        score={players[id]!.score}
                        isLeader={players[id]!.isLeader}
                        roundOver={players[id]!.roundOver}
                        correct={players[id]!.correct}
                        key={key}
                        game={game}
                    />
                );
            } else {
                result.push(
                    <PlayerHUD
                        name={players[id]!.name}
                        score={players[id]!.score}
                        isLeader={players[id]!.isLeader}
                        roundOver={players[id]!.roundOver}
                        correct={players[id]!.correct}
                        key={key}
                        game={game}
                    />
                );
            }

            key++;
        }

        return <>{result}</>;
    };

    return <div className={styles.HUD}>{renderHUD(players, game)}</div>;
}
