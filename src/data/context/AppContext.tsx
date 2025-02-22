import { createContext, ReactNode, useState } from "react";

type Tema = "dark" | "";

interface AppContextProps {
    tema?: Tema;
    alternarTema?: () => void;
}

const AppContext = createContext<AppContextProps>({});

interface AppProviderProps {
    children: ReactNode;
}

export function AppProvider({ children }: AppProviderProps) {
    const [tema, setTema] = useState<Tema>("dark");

    function alternarTema() {
        setTema(tema === "" ? "dark" : "");
    }

    return (
        <AppContext.Provider value={{ tema, alternarTema }}>
            {children}
        </AppContext.Provider>
    );
}

export default AppContext;
export const AppConsumer = AppContext.Consumer;
