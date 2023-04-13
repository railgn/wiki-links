import type { Players } from "src/components/playerHUDs";

export default function getPlace(localScore: number, players: Players) {
    const scores: number[] = [];

    for (const id in players) {
        scores.push(players[id]!.score);
    }

    const sortedScores = scores.sort((a, b) => b - a);

    return sortedScores.indexOf(localScore) + 1;
}
