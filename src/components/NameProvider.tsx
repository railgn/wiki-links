import { useState } from "react";
import { NameContext } from "../context/NameContext";

export const NameProvider = ({ children }: { children: JSX.Element }) => {
    const [name, setName] = useState("");

    return (
        <NameContext.Provider value={{ name, setName }}>
            {children}
        </NameContext.Provider>
    );
};
