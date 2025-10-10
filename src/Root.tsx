import App from "./App";
import { appDependencies } from "./context/Dependencies";
import { DependenciesProvider } from "./context/DependenciesContext";

export const Root = () => {
    return(
        <DependenciesProvider dependencies={appDependencies}>
            <App/>
        </DependenciesProvider>
    );
}