import App from "./App";
import { appDependencies, DependenciesProvider } from "./context";

export const Root = () => {
    return(
        <DependenciesProvider dependencies={appDependencies}>
            <App/>
        </DependenciesProvider>
    );
}