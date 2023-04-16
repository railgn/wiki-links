import { defaultAnswerChoices, type AnswerChoices } from "@lib/answer_choices";
import { defaultFilters, type Category, type Filter } from "@lib/filter";
import { defaultGame, type Game } from "@lib/game";
import { Server, type Socket } from "socket.io";

interface Lobby {
    leader: Record<string, Socket>;
    all_sockets: Record<string, Socket>;
    all_players: Record<string, Player>;
    filter: Filter;
    answerChoices: AnswerChoices;
    category: Category;
    game: Game;
    deadline: Date;
    round: number;
    numberOfRounds: number;
    roundTime: number;
}

type Lobbies = Record<string, Lobby>;
interface Player {
    socket: Socket;
    name: string;
    score: number;
    isLeader: boolean;
    roundOver: boolean;
    correct: boolean;
}

// @ts-expect-error
const ioHandler = (req, res) => {
    if (!res.socket.server.io) {
        console.log("*First use, starting socket.io");

        const io = new Server(res.socket.server);
        const lobbies: Lobbies = {};

        io.on("connection", (socket) => {
            socket.on("pid", (pid: string) => {
                const id = socket.id;
                let lobby = lobbies[pid];

                if (lobby) {
                    lobby.all_sockets[id] = socket;
                    if (lobby.game.filter_select) {
                        const isLeader = Object.keys(lobby.leader).length === 0;

                        lobby.all_players[id] = {
                            socket,
                            name: "",
                            score: 0,
                            isLeader,
                            roundOver: false,
                            correct: false,
                        };
                        socket.emit("become player");
                        if (isLeader) {
                            lobby.leader = { [id]: socket };
                            socket.emit("become leader");
                        }

                        const leaderID = Object.keys(lobby.leader)[0] as string;
                        const leader = lobby.leader[leaderID];

                        if (!leader) {
                            // eslint-disable-next-line
                            delete lobby.leader[leaderID];
                            lobby.leader[socket.id] = socket;
                            socket.emit("become leader");
                        }
                    }
                } else {
                    lobbies[pid] = {
                        leader: { [id]: socket },
                        all_sockets: { [id]: socket },
                        all_players: {
                            [id]: {
                                socket,
                                name: "",
                                score: 0,
                                isLeader: true,
                                roundOver: false,
                                correct: false,
                            },
                        },
                        filter: defaultFilters,
                        answerChoices: defaultAnswerChoices,
                        category: "Natural sciences" as Category,
                        game: defaultGame,
                        deadline: new Date(),
                        round: 0,
                        numberOfRounds: 10,
                        roundTime: 20,
                    };
                    lobby = lobbies[pid]!;
                    socket.emit("become leader");
                }

                socket.emit("pull game state", lobby.game);

                socket.emit("pull filter", lobby.filter);

                socket.emit("pull number of rounds", lobby.numberOfRounds);

                socket.emit(
                    "pull answer choices",
                    lobby.answerChoices,
                    lobby.category
                );

                for (const id in lobby.all_sockets) {
                    lobby.all_sockets[id]!.emit("a user has joined this room");
                }
                console.log(`user connected on ${pid}`);
                console.log(lobbies[pid]);

                socket.emit("connect state");
            });

            socket.on("post filter", (pid: string, filter) => {
                const lobby = lobbies[pid];
                if (!lobby) return console.log(`no lobby with pid ${pid}`);

                console.log("filter recieved");
                lobby.filter = filter;
                for (const id in lobby.all_sockets) {
                    lobby.all_sockets[id]!.emit("pull filter", filter);
                }
            });

            socket.on(
                "post answer choices",
                (pid: string, answerChoices, category) => {
                    console.log("answer choices recieved");
                    console.log("category recieved");
                    const lobby = lobbies[pid];
                    if (!lobby) return console.log(`no lobby with pid ${pid}`);

                    lobby.answerChoices = answerChoices;

                    lobby.category = category;

                    for (const id in lobby.all_sockets) {
                        lobby.all_sockets[id]!.emit(
                            "pull answer choices",
                            answerChoices,
                            category
                        );
                    }
                }
            );

            socket.on("post game state", (pid: string, game) => {
                console.log("game state recieved");
                const lobby = lobbies[pid];
                if (!lobby) return console.log(`no lobby with pid ${pid}`);

                lobby.game = game;
                for (const id in lobby.all_sockets) {
                    lobby.all_sockets[id]!.emit("pull game state", game);
                }
            });

            socket.on("post deadline", (pid: string, deadline) => {
                console.log("deadline recieved", deadline);
                const lobby = lobbies[pid];
                if (!lobby) return console.log(`no lobby with pid ${pid}`);

                lobby.deadline = deadline;

                for (const id in lobby.all_sockets) {
                    lobby.all_sockets[id]!.emit("pull deadline", deadline);
                }
            });

            socket.on("post round", (pid: string, round) => {
                console.log("round recieved", round);
                const lobby = lobbies[pid];
                if (!lobby) return console.log(`no lobby with pid ${pid}`);

                lobby.round = round;

                for (const id in lobby.all_sockets) {
                    lobby.all_sockets[id]!.emit("pull round", round);
                }
            });

            socket.on("post number of rounds", (pid: string, numRounds) => {
                console.log("number of rounds recieved", numRounds);
                const lobby = lobbies[pid];
                if (!lobby) return console.log(`no lobby with pid ${pid}`);

                lobby.numberOfRounds = numRounds;

                for (const id in lobby.all_sockets) {
                    lobby.all_sockets[id]!.emit(
                        "pull number of rounds",
                        numRounds
                    );
                }
            });

            socket.on("post round time", (pid: string, roundTime) => {
                console.log("round time recieved", roundTime);
                const lobby = lobbies[pid];
                if (!lobby) return console.log(`no lobby with pid ${pid}`);

                lobby.roundTime = roundTime;

                for (const id in lobby.all_sockets) {
                    lobby.all_sockets[id]!.emit("pull round time", roundTime);
                }
            });

            socket.on("disconnect", () => {
                let pid = "pid";

                for (const lobbyID in lobbies) {
                    if (lobbies[lobbyID]?.all_sockets[socket.id]) {
                        pid = lobbyID;
                    }
                }

                delete lobbies[pid]?.all_players[socket.id];
                delete lobbies[pid]?.all_sockets[socket.id];

                if (Object.keys(lobbies[pid]!.all_sockets).length === 0) {
                    // eslint-disable-next-line
                    delete lobbies[pid];
                } else {
                    if (lobbies[pid]?.leader[socket.id]) {
                        // assign leader to first player
                        const newLeaderID = Object.keys(
                            lobbies[pid]!.all_players
                        )[0] as string;
                        const newLeaderSocket = lobbies[pid]!.all_players[
                            newLeaderID
                        ]?.socket as Socket;

                        // eslint-disable-next-line
                        delete lobbies[pid]!.leader[socket.id];

                        lobbies[pid]!.leader[newLeaderID] = newLeaderSocket;

                        io.to(newLeaderID).emit("become leader");
                    }
                }

                for (const id in lobbies[pid]!.all_sockets) {
                    lobbies[pid]!.all_sockets[id]!.emit(
                        "pull player info",
                        lobbies[pid]!.all_players
                    );
                }
            });

            socket.on("become player", (pid) => {
                console.log("spectator => player");
                lobbies[pid]!.all_players[socket.id] = {
                    socket,
                    name: "",
                    score: 0,
                    isLeader: false,
                    roundOver: false,
                    correct: false,
                };
                socket.emit("become player handshake");
                if (Object.keys(lobbies[pid]!.leader).length === 0) {
                    lobbies[pid]!.leader[socket.id] = socket;
                    socket.emit("become leader");
                }

                const leaderID = Object.keys(lobbies[pid]!.leader)[0] as string;
                if (!lobbies[pid]!.leader[leaderID]) {
                    // eslint-disable-next-line
                    delete lobbies[pid]!.leader[leaderID];
                    lobbies[pid]!.leader[socket.id] = socket;
                    socket.emit("become leader");
                }
            });

            socket.on("become spectator", (pid) => {
                console.log("player => spectator");
                delete lobbies[pid]?.all_players[socket.id];

                if (lobbies[pid]?.leader[socket.id]) {
                    // eslint-disable-next-line
                    delete lobbies[pid]!.leader[socket.id];
                    if (Object.keys(lobbies[pid]!.all_players).length > 0) {
                        const newLeaderID = Object.keys(
                            lobbies[pid]!.all_players
                        )[0] as string;
                        const newLeaderSocket = lobbies[pid]!.all_players[
                            newLeaderID
                        ]?.socket as Socket;

                        lobbies[pid]!.leader[newLeaderID] = newLeaderSocket;

                        io.to(newLeaderID).emit("become leader");
                    }
                }

                socket.emit("become spectator handshake");
            });

            socket.on(
                "post player info",
                (pid, name, score, isLeader, roundOver, correct) => {
                    console.log("player info recieved");

                    if (lobbies[pid]?.all_players[socket.id]) {
                        lobbies[pid]!.all_players[socket.id] = {
                            socket,
                            name,
                            score,
                            isLeader,
                            roundOver,
                            correct,
                        };
                    }

                    const allPlayersWithoutSockets = lobbies[pid]!.all_players;

                    for (const id in allPlayersWithoutSockets) {
                        // @ts-expect-error
                        delete allPlayersWithoutSockets[id].socket;
                    }

                    console.log(allPlayersWithoutSockets);

                    for (const id in lobbies[pid]!.all_sockets) {
                        lobbies[pid]!.all_sockets[id]!.emit(
                            "pull player info",
                            allPlayersWithoutSockets
                        );
                    }
                }
            );
        });

        res.socket.server.io = io;
    } else {
        console.log("socket.io already running");
    }
    res.end();
};

export const config = {
    api: {
        bodyParser: false,
    },
};

export default ioHandler;
