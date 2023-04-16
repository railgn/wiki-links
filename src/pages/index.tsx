import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import createURL from "@lib/createURL";
import { nicknames } from "@lib/nicknames";
import { useContext, useEffect, useState } from "react";
import styles from "../styles/index.module.css";
import Image from "next/image";

import { NameContext } from "../context/NameContext";

const Home: NextPage = () => {
    const [joinState, setJoinState] = useState("0000");
    const { name, setName } = useContext(NameContext);

    // useEffect(() => {
    //     const nickname = nicknames[
    //         Math.floor(nicknames.length * Math.random())
    //     ] as string;

    //     setName(`${nickname}`);
    // }, []);

    // make font sizes dynamic
    // fix vertical spacing in "Join Lobby" section

    return (
        <>
            <Head>
                <title>Wiki-Links</title>
                <meta name="" content="" />
                <link rel="" href="" />
            </Head>
            <main>
                <div>
                    <div>
                        <div className={styles.header}>
                            {/* <h1 className={styles.title}>Wiki-links</h1> */}
                            <Image
                                className={styles.titleImg}
                                src="/title.png"
                                width="300"
                                height="44"
                                alt="Wiki-Links"
                            />
                        </div>
                        <div className={styles.buffer}></div>
                        <div className={styles.mainContent}>
                            <div className={styles.nameArea}>
                                <div className={styles.name}>
                                    Name:&nbsp;
                                    <input
                                        className={styles.nameInput}
                                        type="text"
                                        id="name-input"
                                        placeholder="Enter your name"
                                        value={name}
                                        onChange={(a) => {
                                            setName(a.target.value);
                                        }}
                                        autoComplete="off"
                                    />
                                </div>
                            </div>
                            <div className={styles.lobbyArea}>
                                <div className={styles.createLobby}>
                                    <Link
                                        href={createURL()}
                                        className={styles.createLink}
                                    >
                                        Create Lobby
                                    </Link>
                                </div>

                                <div className={styles.joinLobby}>
                                    <Link
                                        href={`/game/${joinState}`}
                                        className={styles.joinLink}
                                    >
                                        Join Lobby
                                    </Link>
                                    <div className={styles.joinLink}>
                                        <input
                                            className={styles.joinInput}
                                            type="text"
                                            id="join-code"
                                            placeholder="Enter Lobby ID"
                                            onChange={(a) => {
                                                setJoinState(a.target.value);
                                            }}
                                            autoComplete="off"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className={styles.buffer}></div>
                        <div className={styles.about}>
                            <div className={styles.aboutTitle}>About</div>
                            <p className={styles.aboutParagraph}>
                                <span className={styles.aboutWikilinks}>
                                    Wiki-links
                                </span>
                                &nbsp;is a word association game you can play
                                alone or with friends.
                                <br />
                                <br />
                                Each round, you&apos;ll be prompted with the
                                title of one Wikipedia article and four links to
                                other Wikipedia articles. Three of these links
                                come from the prompt article, while one comes
                                from an unrelated article.
                                <br />
                                <br />
                                Correctly identify the unrelated link as quickly
                                as possible to earn the most points!
                                <br />
                                Have fun!
                            </p>
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
};

export default Home;
