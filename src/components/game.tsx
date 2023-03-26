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
import { default_game, gameOver } from "../functions/game";
import { startGame, categorySelect } from "../functions/game";
import { default_answerChoices } from "../functions/answer_choices";
import styles from "../styles/game.module.css";
import GameOver from "./game_over";

export default function Game() {
    const [game, setGame] = useState(default_game);
    const [filter, setFilter] = useState(default_filters);
    const [link, setLink] = useState(defaultLink);
    const [score, setScore] = useState(default_score);
    const [answerChoices, setAnswerChoices] = useState(default_answerChoices);

    const numberOfRounds = 10;

    //set game_over
    useEffect(() => {
        if (score.round > numberOfRounds) {
            gameOver(setGame);
        }
    }, [score.round]);

    //get a new link from data
    const linkTest = api.example.getLink.useQuery(
        { fetch: link.fetch, category: link.category },
        {
            refetchOnWindowFocus: false,

            onSuccess(data) {
                setAnswerChoices({
                    mainArticle: data.mainArticle,
                    subArticle: data.subArticle,
                    correct: data.subArticleAnswer,
                    incorrect: data.mainArticleAnswers,
                });
            },
        }
    );

    //reset article on new round before http request
    useEffect(() => {
        setAnswerChoices(default_answerChoices);
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

    return (
        <>
            {/* category filters */}
            {game.filter_select && (
                <>
                    <div>
                        <h3>Category Select</h3>
                    </div>

                    <div>
                        <Filters setFilter={setFilter} filter={filter} />
                    </div>
                    <div className={styles.verticalPadding}></div>
                    <button
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
                        />
                    </div>

                    <div className={styles.verticalPadding}></div>

                    {score.round_over && (
                        <div>
                            <button
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
                    />
                </>
            )}
        </>
    );
}
