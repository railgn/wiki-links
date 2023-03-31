import { Server, Socket } from "socket.io";
import { Filter, default_filters } from "../../functions/filter";

type SocketHash = {
    [pid: string]: {
        leader: { [key: string]: Socket };
        all_sockets: { [key: string]: Socket };
        filters: Filter;
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
                    socketObj[pid].all_sockets[id] = socket;
                } else {
                    socketObj[pid] = {
                        leader: { [id]: socket },
                        all_sockets: { [id]: socket },
                        filters: default_filters,
                    };
                    socket.emit("become leader");
                }

                for (const id in socketObj[pid].all_sockets) {
                    socketObj[pid].all_sockets[id].emit(
                        "a user has joined this room"
                    );
                }
                console.log(`user connected on ${pid}`);
                console.log(socketObj[pid]);
            });

            socket.on("post filter", (data) => {
                console.log("hey filter worked");
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
