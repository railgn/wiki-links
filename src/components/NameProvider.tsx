import { ReactNode, useState } from "react";
import { NameContext } from "../context/NameContext";

export const NameProvider = ({ children }: { children: ReactNode }) => {
    const [name, setName] = useState("");

    return (
        <NameContext.Provider value={{ name, setName }}>
            {children}
        </NameContext.Provider>
    );
};
