import type { ComparatorWorkerFactory } from "../utils/workers";

type StrategyOption = {
    name : string,
    factory : () => ComparatorWorkerFactory;
}

export interface Dependencies {
    parseCSVFile : (file : File) => Promise<any>
    factories : Array<StrategyOption>
}