import { type AppType } from "next/app";

import { api } from "../utils/api";
import { NameProvider } from "../components/NameProvider";

import "../styles/globals.css";

const MyApp: AppType = ({ Component, pageProps }) => {
    return (
        <NameProvider>
            <Component {...pageProps} />
        </NameProvider>
    );
};

export default api.withTRPC(MyApp);
