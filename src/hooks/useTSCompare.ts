import { useCallback, useRef, useState } from "react";
import type { TableData } from "../types/Dataset";
import { TableDataComparator} from "../utils/adapter/TSComparatorAdapter";
import type { AdaptedResult } from "../utils/adapter/Adapter.types";
import * as Comlink from 'comlink';
import type { ComparatorWorkerFactory } from "../utils/workers/factory/WorkerFactory";
import { EuclideanComparatorFactory } from "../utils/workers/factory/EuclideanComparatorFactory";
import { ManhattanComparatorFactory } from "../utils/workers/factory/ManhattanComparatorFactory";
import { KarlPearsonComparatorFactory } from "../utils/workers/factory/KarlPearsonComparatorFactory";

type StrategyOption = {
    name : string,
    factory : () => ComparatorWorkerFactory;
}

const comparators : Array<StrategyOption> = [
    {
        name: "Euclidean",
        factory: () => new EuclideanComparatorFactory()
    },
    {
        name: "Manhattan",
        factory: () => new ManhattanComparatorFactory()
    },
    {
        name: "Karl-Pearson",
        factory: () => new KarlPearsonComparatorFactory()
    }
];

export default function useTSCompare(){

    const availableComparators = useRef<Array<string>>(comparators.map((comparator) => (comparator.name)));
    const workerFactories = useRef<Map<number, ComparatorWorkerFactory>>(new Map());
    const currentWorker = useRef<Worker | null>(null);

    const [selectedStrategy, setSelectedStrategy] = useState<number>(0);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const [referenceDateColumn, setReferenceDateColumn] = useState<number>(-1);
    const [targetDateColumn, setTargetDateColumn] = useState<number>(-1);

    const [result, setResult] = useState<AdaptedResult | null>(null);

    const handleSelectStrategy = useCallback((index : number) => {
        setSelectedStrategy(index);
    }, []);

    const blankError = useCallback(() => {
        setError(null);
    }, [error]);

    const compare = useCallback(async (reference : TableData, target : TableData) => {
        setIsLoading(true);
        if(!workerFactories.current.get(selectedStrategy)){            
            workerFactories.current.set(selectedStrategy, comparators[selectedStrategy].factory());
        } else{
            console.log("Factory was cached! ", comparators[selectedStrategy].name);
        }
        const factory = workerFactories.current.get(selectedStrategy)!;
        const worker = factory.create();
        currentWorker.current = worker;
        const proxy = Comlink.wrap<TableDataComparator>(worker);

        try {
            proxy.setReferenceTimestampColumn(referenceDateColumn);
            proxy.setTargetTimestampColumn(targetDateColumn);
            const result = await proxy.compare(reference, target);
            setResult(result);
        } catch (error) {
            error instanceof Error ? setError(error.message) : setError("An error has been encountered while running the comparison");
            console.log("Comparison Runner hook error: ", error);
        } finally {
            setIsLoading(false);
            currentWorker.current.terminate();
            currentWorker.current = null;
            console.log("Worker terminated x.x", comparators[selectedStrategy].name);
        }
    }, [isLoading, error, result, referenceDateColumn, targetDateColumn, selectedStrategy]);

    //return { availableStrategies, handleSelectStrategy, setReferenceDateColumn, setTargetDateColumn, result, compare, error };
    return {
        compare,
        result,
        isLoading,
        error,
        blankError,
        handleSelectStrategy,
        setReferenceDateColumn,
        setTargetDateColumn,
        availableComparators
    };
}