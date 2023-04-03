import React, { useEffect } from "react";
import { api } from "../utils/api";
import { useState } from "react";
import { default_filters } from "../functions/filter";
import Filters from "./filters";
import { default_score } from "../functions/score";
import nextRound from "../functions/score";
import FormMC from "./form-mc";
import { defaultLink } from "../functions/link";
import Timer from "./timer";
import { default_game, gameOver, startGame_nonLeader } from "../functions/game";
import { startGame, categorySelect } from "../functions/game";
import { default_answerChoices } from "../functions/answer_choices";
import styles from "../styles/game.module.css";
import GameOver from "./game_over";
import { useRouter } from "next/router";
import io from "socket.io-client";
import { Socket } from "socket.io";
import { DefaultEventsMap } from "@socket.io/component-emitter";
import PlayerHUDs from "./playerHUDs";
import { nicknames } from "../functions/nicknames";
//@ts-ignore
let socket: Socket<DefaultEventsMap, DefaultEventsMap>;

export default function Game() {
    const [isLeader, setIsLeader] = useState(false);
    const [isSpectator, setIsSpectator] = useState(true);

    const [game, setGame] = useState(default_game);
    const [filter, setFilter] = useState(default_filters);
    const [link, setLink] = useState(defaultLink);
    const [score, setScore] = useState(default_score);
    const [answerChoices, setAnswerChoices] = useState(default_answerChoices);
    const [socketConnect, setSocketConnect] = useState(true);

    const [numberOfRounds, setNumberOfRounds] = useState(10);
    const [roundTime, setRoundTime] = useState(20);
    const [name, setName] = useState("");
    const [HUDinfo, setHUDinfo] = useState({
        test: {
            name: "test",
            score: 0,
            isLeader: false,
            roundOver: false,
            correct: false,
        },
    } as {
        [key: string]: {
            name: string;
            score: number;
            isLeader: boolean;
            roundOver: boolean;
            correct: boolean;
        };
    });

    const router = useRouter();
    const { pid } = router.query;

    //socket event listeners
    useEffect(() => {
        setSocketConnect((newestSocketConnectValue) => {
            if (!newestSocketConnectValue) return false;

            const nickname =
                nicknames[Math.floor(nicknames.length * Math.random())];

            setName(`Anonymous ${nickname}`);

            console.log("socket running");
            fetch("/api/socket").finally(() => {
                //@ts-ignore
                socket = io();

                let localLeader = false;
                let localSpectator = true;

                socket.on("connect", () => {
                    console.log(`connect on ${pid}`);
                    socket.emit("pid", pid);
                });

                socket.on("become leader", () => {
                    console.log("become leader");
                    setIsLeader(true);
                    setIsSpectator(false);
                    localLeader = true;
                });

                socket.on("become player", () => {
                    console.log("become player");
                    setIsSpectator(false);
                    localSpectator = false;
                });

                socket.on("a user has joined this room", () => {
                    console.log("a user has joined this room");
                });

                socket.on("pull filter", (filter) => {
                    if (!localLeader) {
                        console.log("filter pulled");
                        setFilter(filter);
                    }
                });

                socket.on("pull answer choices", (answerChoices, category) => {
                    if (!localLeader) {
                        console.log("answer choices pulled");
                        setAnswerChoices(answerChoices);
                        setLink({
                            ...link,
                            category,
                        });
                    }
                });

                socket.on("pull game state", (game_server) => {
                    if (!localLeader) {
                        console.log("game state pulled");
                        setGame(game_server);

                        if (!game_server.game_over) {
                            startGame_nonLeader(score, setScore);
                        }
                    }
                });

                socket.on("pull number of rounds", (numberOfRounds_server) => {
                    if (!localLeader) {
                        console.log("number of rounds pulled");
                        setNumberOfRounds(numberOfRounds_server);
                    }
                });

                socket.on("pull round time", (roundTime_server) => {
                    if (!localLeader) {
                        console.log("round time pulled");
                        setRoundTime(roundTime_server);
                    }
                });

                socket.on("become player handshake", () => {
                    setIsSpectator(false);
                    localSpectator = false;
                });

                socket.on("become spectator handshake", () => {
                    console.log("become spectator handshake");
                    setIsSpectator(true);
                    localSpectator = true;
                    setIsLeader(false);
                    localLeader = false;
                });

                socket.on("pull player info", (all_players_Obj) => {
                    console.log("pulled player info");
                    setHUDinfo(all_players_Obj);
                });
            });

            return false;
        });
    }, []);

    //filter change event
    useEffect(() => {
        if (isLeader) {
            console.log("post filter");
            socket.emit("post filter", pid, filter);
        }
    }, [filter]);

    //game state event
    useEffect(() => {
        if (isLeader) {
            console.log("post game state");
            socket.emit("post game state", pid, game);
        }
    }, [game]);

    //set game_over event
    useEffect(() => {
        if (isLeader) {
            if (score.round > numberOfRounds) {
                gameOver(setGame);
            }
            socket.emit("post round", pid, score.round);
        }
    }, [score.round]);

    //post info to server for HUD
    useEffect(() => {
        if (socket) {
            console.log("post player info");
            socket.emit(
                "post player info",
                pid,
                name,
                score.score,
                isLeader,
                score.round_over,
                score.correct_answer
            );
        }
    }, [
        score.score,
        isLeader,
        name,
        isSpectator,
        score.round_over,
        score.correct_answer,
    ]);

    //round number event
    useEffect(() => {
        if (socket) {
            socket.on("pull round", (round_server) => {
                if (!isLeader) {
                    console.log("round pulled");
                    setScore((newestScoreValue) => {
                        return {
                            ...newestScoreValue,
                            round: round_server,
                        };
                    });
                }
            });
        }
    }, [score, game]);

    //get a new link from data
    const linkTest = api.example.getLink.useQuery(
        { fetch: link.fetch, category: link.category },
        {
            refetchOnWindowFocus: false,

            onSuccess(data) {
                if (isLeader) {
                    setAnswerChoices({
                        mainArticle: data.mainArticle,
                        subArticle: data.subArticle,
                        correct: data.subArticleAnswer,
                        incorrect: data.mainArticleAnswers,
                    });

                    console.log("post answer choices");
                    socket.emit(
                        "post answer choices",
                        pid,
                        {
                            mainArticle: data.mainArticle,
                            subArticle: data.subArticle,
                            correct: data.subArticleAnswer,
                            incorrect: data.mainArticleAnswers,
                        },
                        link.category
                    );
                }
            },
        }
    );

    //reset article on new round before http request
    useEffect(() => {
        if (isLeader) {
            setAnswerChoices(default_answerChoices);
        } else {
            setScore({
                score: score.score,
                correct_answer: false,
                round: score.round,
                submission: "waiting",
                round_over: false,
                streak: score.streak,
            });
        }
    }, [score.round]);

    //handle submissions
    useEffect(() => {
        if (score.submission !== "waiting") {
            const correctness = score.submission == "correct" ? true : false;

            setScore({
                ...score,
                correct_answer: correctness,
                round_over: true,
            });
        }
    }, [score.submission]);

    //radio button handler for number of rounds
    const handleNumberOfRounds = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        if (isLeader) {
            setNumberOfRounds(parseInt(event.target.value));
            socket.emit(
                "post number of rounds",
                pid,
                parseInt(event.target.value)
            );
        }
    };

    //radio button handler for round time
    const handleRoundTime = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (isLeader) {
            setRoundTime(parseInt(event.target.value));
            socket.emit("post round time", pid, parseInt(event.target.value));
        }
    };

    const becomePlayer = () => {
        socket.emit("become player", pid);
    };

    const becomeSpectator = () => {
        socket.emit("become spectator", pid);
    };

    const spectator_indicator = isSpectator
        ? "SPECTATOR"
        : isLeader
        ? "LEADER"
        : "PLAYER";

    return (
        <>
            <div>
                <h1>{spectator_indicator}</h1>
            </div>

            <div className={styles.verticalPadding}></div>

            {/* category filters */}
            {game.filter_select && (
                <>
                    <div>
                        <h3>Category Select</h3>
                    </div>

                    <div>
                        <Filters
                            setFilter={setFilter}
                            filter={filter}
                            isLeader={isLeader}
                        />
                    </div>

                    <div className={styles.verticalPadding}></div>
                    {isSpectator && (
                        <button onClick={() => becomePlayer()}>
                            Become a Player
                        </button>
                    )}
                    {!isSpectator && (
                        <>
                            <button onClick={() => becomeSpectator()}>
                                Become a Spectator
                            </button>
                        </>
                    )}

                    <div className={styles.verticalPadding}></div>

                    {/* game options */}
                    {isLeader && (
                        <>
                            <div>
                                Number of Rounds
                                <label>
                                    <input
                                        type="radio"
                                        name="5-numberOfRounds"
                                        value="5"
                                        checked={numberOfRounds === 5}
                                        onChange={handleNumberOfRounds}
                                    />
                                    5
                                </label>
                                <label>
                                    <input
                                        type="radio"
                                        name="10-numberOfRounds"
                                        value="10"
                                        checked={numberOfRounds === 10}
                                        onChange={handleNumberOfRounds}
                                    />
                                    10
                                </label>
                                <label>
                                    <input
                                        type="radio"
                                        name="15-numberOfRounds"
                                        value="15"
                                        checked={numberOfRounds === 15}
                                        onChange={handleNumberOfRounds}
                                    />
                                    15
                                </label>
                            </div>
                            <div>
                                Seconds per Round
                                <label>
                                    <input
                                        type="radio"
                                        name="10-roundTime"
                                        value="10"
                                        checked={roundTime === 10}
                                        onChange={handleRoundTime}
                                    />
                                    10
                                </label>
                                <label>
                                    <input
                                        type="radio"
                                        name="20-roundTime"
                                        value="20"
                                        checked={roundTime === 20}
                                        onChange={handleRoundTime}
                                    />
                                    20
                                </label>
                                <label>
                                    <input
                                        type="radio"
                                        name="30-roundTime"
                                        value="30"
                                        checked={roundTime === 30}
                                        onChange={handleRoundTime}
                                    />
                                    30
                                </label>
                            </div>

                            <div className={styles.verticalPadding}></div>

                            <button
                                disabled={!isLeader}
                                onClick={() =>
                                    startGame(
                                        score,
                                        setScore,
                                        link,
                                        setLink,
                                        filter,
                                        game,
                                        setGame
                                    )
                                }
                            >
                                Start Game
                            </button>
                        </>
                    )}
                </>
            )}
            {/* game rounds */}
            {!game.filter_select && !game.game_over && (
                <>
                    <div>
                        <h3>Choose the link NOT found in the Wiki article</h3>
                    </div>
                    <div>Round: {score.round}</div>
                    <div>Score: {score.score}</div>
                    <div>Current Streak: {score.streak}</div>

                    <div className={styles.verticalPadding}></div>

                    <div>
                        Category:{" "}
                        {answerChoices.mainArticle != ""
                            ? link.category
                            : link.category}
                    </div>
                    <div>Wiki Article: {answerChoices.mainArticle}</div>

                    <div>
                        <Timer
                            round={score.round}
                            score={score}
                            setScore={setScore}
                            socket={socket}
                            isLeader={isLeader}
                            pid={pid as string}
                            roundTime={roundTime}
                        />
                    </div>

                    {/* submission input */}
                    <div>
                        <FormMC
                            setScore={setScore}
                            score={score}
                            correct_anchors={answerChoices.incorrect}
                            incorrect_anchor={answerChoices.correct}
                            mainArticle={answerChoices.mainArticle}
                            subArticle={answerChoices.subArticle}
                            isSpectator={isSpectator}
                        />
                    </div>

                    <div className={styles.verticalPadding}></div>

                    {score.round_over && isLeader && (
                        <div>
                            <button
                                disabled={!isLeader}
                                onClick={() =>
                                    nextRound(
                                        score,
                                        setScore,
                                        link,
                                        setLink,
                                        filter
                                    )
                                }
                            >
                                New Round
                            </button>
                            &nbsp; &nbsp;
                            <button
                                disabled={!isLeader}
                                onClick={() =>
                                    categorySelect(setScore, game, setGame)
                                }
                            >
                                Category Select
                            </button>
                        </div>
                    )}

                    {/* answers for cheating

                    <div>
                        (possible answers): {answerChoices.incorrect.join(", ")}
                    </div> */}
                </>
            )}
            {/* game end */}
            {game.game_over && (
                <>
                    <GameOver
                        score={score}
                        game={game}
                        setGame={setGame}
                        setScore={setScore}
                        link={link}
                        setLink={setLink}
                        filter={filter}
                        name={name}
                    />
                </>
            )}

            {/* add name text input for changing name state */}

            {/* HUD for all players */}
            {socket && <PlayerHUDs players={HUDinfo} />}
        </>
    );
}
