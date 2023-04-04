import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import createURL from "../functions/createURL";
import { nicknames } from "../functions/nicknames";
import { useContext, useEffect, useState } from "react";

import { NameContext } from "../context/NameContext";

const Home: NextPage = () => {
    const [joinState, setJoinState] = useState("0000");
    const { name, setName } = useContext(NameContext);
    useEffect(() => {
        const nickname =
            nicknames[Math.floor(nicknames.length * Math.random())];

        setName(`Anonymous ${nickname}`);
    }, []);

    return (
        <>
            <Head>
                <title>Wiki-Links</title>
                <meta name="" content="" />
                <link rel="" href="" />
            </Head>
            <main>
                <h1>Wiki-links</h1>
                <h2>
                    <div>
                        Name:&nbsp;
                        <input
                            type="text"
                            id="name-input"
                            placeholder="Enter your name"
                            value={name}
                            onChange={(a) => {
                                setName(a.target.value);
                            }}
                        />
                    </div>
                    <div>
                        <Link href={createURL()}>Create Lobby</Link>
                    </div>
                    <div>
                        <Link href={`/game/${joinState}`}>Join Lobby</Link>
                        <input
                            type="text"
                            id="join-code"
                            placeholder="Enter Code Here"
                            onChange={(a) => {
                                setJoinState(a.target.value);
                            }}
                        />
                    </div>
                </h2>
            </main>
        </>
    );
};

export default Home;
