import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import createURL from "../functions/createURL";

import { useState } from "react";

const Home: NextPage = () => {
    const [joinState, setJoinState] = useState("0000");

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
                        <Link href={createURL()}>Create Lobby</Link>

                        <input
                            type="text"
                            id="join-code"
                            placeholder="Enter Code Here"
                            onChange={(a) => {
                                setJoinState(a.target.value);
                            }}
                        />
                        <Link href={`/game/${joinState}`}>Join Lobby</Link>
                    </div>
                </h2>
            </main>
        </>
    );
};

export default Home;
