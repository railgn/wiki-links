import { type AppType } from "next/app";

import { NameProvider } from "../components/NameProvider";
import { api } from "../utils/api";

import "../styles/globals.css";

// eslint-disable-next-line
const MyApp: AppType = ({ Component, pageProps }) => {
    return (
        <NameProvider>
            <Component {...pageProps} />
        </NameProvider>
    );
};

export default api.withTRPC(MyApp);
