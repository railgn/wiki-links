import { type NextPage } from "next";
import Head from "next/head";
import Test from "../components/test";

import { api } from "../utils/api";
import { useState } from "react";

const Home: NextPage = () => {
   return (
      <>
         <Head>
            <title>Wiki-Links</title>
            <meta name="" content="" />
            <link rel="" href="" />
         </Head>
         <main>
            <Test />
         </main>
      </>
   );
};

export default Home;
