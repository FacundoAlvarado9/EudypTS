import { createContext, useContext, type ReactNode } from "react";
import type { Dependencies } from "./Dependencies.types";

const DependenciesContext = createContext<Dependencies | null>(null);

export const useDependencies = () => {
    const context = useContext(DependenciesContext);
    if(!context) {
        throw new Error("Dependencies are not available. Try using this hook inside a DependenciesProvider or setting valid dependencies");
    }
    return context;
}

type DependenciesProviderProps = {
    children : ReactNode,
    dependencies : Dependencies
}

export const DependenciesProvider = ({ children, dependencies } : DependenciesProviderProps)  => {
    return (
        <DependenciesContext.Provider value={dependencies}>
            {children}
        </DependenciesContext.Provider>
    );
}