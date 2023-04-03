import { Server, Socket } from "socket.io";
import { Category, Filter, default_filters } from "../../functions/filter";
import {
    AnswerChoices,
    default_answerChoices,
} from "../../functions/answer_choices";
import { Game, default_game } from "../../functions/game";

type SocketHash = {
    [pid: string]: {
        leader: { [key: string]: Socket };
        all_sockets: { [key: string]: Socket };
        all_players: { [key: string]: Socket };
        filter: Filter;
        answerChoices: AnswerChoices;
        category: Category;
        game: Game;
        deadline: Date;
        round: number;
        numberOfRounds: number;
        roundTime: number;
    };
};

//@ts-ignore
const ioHandler = (req, res) => {
    if (!res.socket.server.io) {
        console.log("*First use, starting socket.io");

        const io = new Server(res.socket.server);
        const socketObj: SocketHash = {};

        io.on("connection", (socket) => {
            socket.on("pid", (pid) => {
                const id = socket.id;

                if (socketObj[pid]) {
                    socketObj[pid]!.all_sockets[id] = socket;
                    if (socketObj[pid]!.game.filter_select) {
                        socketObj[pid]!.all_players[id] = socket;
                        socket.emit("become player");
                    }
                } else {
                    socketObj[pid] = {
                        leader: { [id]: socket },
                        all_sockets: { [id]: socket },
                        all_players: { [id]: socket },
                        filter: default_filters,
                        answerChoices: default_answerChoices,
                        category: "Natural sciences" as Category,
                        game: default_game,
                        deadline: new Date(),
                        round: 0,
                        numberOfRounds: 10,
                        roundTime: 20,
                    };
                    socket.emit("become leader");
                }

                socket.emit("pull game state", socketObj[pid]!.game);

                socket.emit("pull filter", socketObj[pid]!.filter);

                socket.emit(
                    "pull answer choices",
                    socketObj[pid]!.answerChoices,
                    socketObj[pid]!.category
                );

                for (const id in socketObj[pid]!.all_sockets) {
                    socketObj[pid]!.all_sockets[id]!.emit(
                        "a user has joined this room"
                    );
                }
                console.log(`user connected on ${pid}`);
                console.log(socketObj[pid]);
            });

            socket.on("post filter", (pid, filter) => {
                console.log("filter recieved");
                socketObj[pid]!.filter = filter;
                for (const id in socketObj[pid]!.all_sockets) {
                    socketObj[pid]!.all_sockets[id]!.emit(
                        "pull filter",
                        filter
                    );
                }
            });

            socket.on("post answer choices", (pid, answerChoices, category) => {
                console.log("answer choices recieved");
                console.log("category recieved");

                socketObj[pid]!.answerChoices = answerChoices;
                socketObj[pid]!.category = category;

                for (const id in socketObj[pid]!.all_sockets) {
                    socketObj[pid]!.all_sockets[id]!.emit(
                        "pull answer choices",
                        answerChoices,
                        category
                    );
                }
            });

            socket.on("post game state", (pid, game) => {
                console.log("game state recieved");

                socketObj[pid]!.game = game;
                for (const id in socketObj[pid]!.all_sockets) {
                    socketObj[pid]!.all_sockets[id]!.emit(
                        "pull game state",
                        game
                    );
                }
            });

            socket.on("post deadline", (pid, deadline) => {
                console.log("deadline recieved", deadline);

                socketObj[pid]!.deadline = deadline;

                for (const id in socketObj[pid]!.all_sockets) {
                    socketObj[pid]!.all_sockets[id]!.emit(
                        "pull deadline",
                        deadline
                    );
                }
            });

            socket.on("post round", (pid, round) => {
                console.log("round recieved", round);

                socketObj[pid]!.round = round;

                for (const id in socketObj[pid]!.all_sockets) {
                    socketObj[pid]!.all_sockets[id]!.emit("pull round", round);
                }
            });

            socket.on("post number of rounds", (pid, number_of_rounds) => {
                console.log("number of rounds recieved", number_of_rounds);

                socketObj[pid]!.numberOfRounds = number_of_rounds;

                for (const id in socketObj[pid]!.all_sockets) {
                    socketObj[pid]!.all_sockets[id]!.emit(
                        "pull number of rounds",
                        number_of_rounds
                    );
                }
            });

            socket.on("post round time", (pid, roundTime) => {
                console.log("round time recieved", roundTime);

                socketObj[pid]!.roundTime = roundTime;

                for (const id in socketObj[pid]!.all_sockets) {
                    socketObj[pid]!.all_sockets[id]!.emit(
                        "pull round time",
                        roundTime
                    );
                }
            });

            socket.on("disconnect", () => {
                let pid = "pid";

                for (const lobby in socketObj) {
                    if (socketObj[lobby]?.all_sockets[socket.id]) {
                        pid = lobby;
                    }
                }

                delete socketObj[pid]?.all_players[socket.id];

                delete socketObj[pid]?.all_sockets[socket.id];

                if (Object.keys(socketObj[pid]!.all_sockets).length === 0) {
                    delete socketObj[pid];
                } else {
                    if (socketObj[pid]?.leader[socket.id]) {
                        //assign leader to first player
                        const newLeader_ID = Object.keys(
                            socketObj[pid]!.all_players
                        )[0] as string;
                        const newLeader_socket = socketObj[pid]!.all_players[
                            newLeader_ID
                        ] as Socket;

                        delete socketObj[pid]!.leader[socket.id];

                        socketObj[pid]!.leader[newLeader_ID] = newLeader_socket;

                        io.to(newLeader_ID).emit("become leader");
                    }
                }
            });

            socket.on("become player", (pid) => {
                console.log("spectator => player");
                socketObj[pid]!.all_players[socket.id] = socket;
                socket.emit("become player handshake");
                if (Object.keys(socketObj[pid]!.leader).length === 0) {
                    socketObj[pid]!.leader[socket.id] = socket;
                    socket.emit("become leader");
                }
            });

            socket.on("become spectator", (pid) => {
                console.log("player => spectator");
                delete socketObj[pid]?.all_players[socket.id];

                if (socketObj[pid]?.leader[socket.id]) {
                    delete socketObj[pid]!.leader[socket.id];
                    if (Object.keys(socketObj[pid]!.all_players).length > 0) {
                        const newLeader_ID = Object.keys(
                            socketObj[pid]!.all_players
                        )[0] as string;
                        const newLeader_socket = socketObj[pid]!.all_players[
                            newLeader_ID
                        ] as Socket;

                        socketObj[pid]!.leader[newLeader_ID] = newLeader_socket;

                        io.to(newLeader_ID).emit("become leader");
                    }
                }

                socket.emit("become spectator handshake");
            });
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
