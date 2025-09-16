import * as Comlink from 'comlink';
import type { TableData } from "../types/Dataset";
import { useCallback, useMemo, useRef, useState } from "react";
import type { AdaptedResult, TableDataComparator } from "../utils/adapter";
import { type ComparatorWorkerFactory, EuclideanComparatorFactory, KarlPearsonComparatorFactory, ManhattanComparatorFactory } from "../utils/workers";


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

    const [reference, setReference] = useState<TableData | null>(null);
    const [target, setTarget] = useState<TableData | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [result, setResult] = useState<AdaptedResult | null>(null);

    const referenceDateColumn = useRef<number>(-1);
    const targetDateColumn = useRef<number>(-1);

    const availableComparators = useRef<Array<string>>(comparators.map((comparator) => (comparator.name)));
    const selectedComparator = useRef<number>(0);

    const workerFactories = useRef<Map<number, ComparatorWorkerFactory>>(new Map());
    const currentWorker = useRef<Worker | null>(null);

    const handleSelectStrategy = useCallback((index : number) => {
        selectedComparator.current = index;
    }, []);

    const lastComparison = useMemo(() => {
        return { 
            reference: reference,
            target: target,
            selectedComparator: selectedComparator.current,
            refDateCol: referenceDateColumn.current,
            targetDateCol: targetDateColumn.current
        };
    }, [result]);

    const needsReRun = useCallback(() => {
        return (
            (reference !== lastComparison.reference)
            || (target !== lastComparison.target) 
            || (selectedComparator.current !== lastComparison.selectedComparator)
            || (referenceDateColumn.current !== lastComparison.refDateCol)
            || (targetDateColumn.current !== lastComparison.targetDateCol)
        );
    }, [reference, target]);

    const setReferenceDateColumn = useCallback((colIndex : number) => {
        referenceDateColumn.current = colIndex;
    }, []);

    const setTargetDateColumn = useCallback((colIndex : number) => {
        targetDateColumn.current = colIndex;
    }, []);

    const compare = useCallback(async () => {
        if(needsReRun()){
            setIsLoading(true);
            if(!workerFactories.current.get(selectedComparator.current)){            
                workerFactories.current.set(selectedComparator.current, comparators[selectedComparator.current].factory());
            }
            const factory = workerFactories.current.get(selectedComparator.current)!;
            const worker = factory.create();
            currentWorker.current = worker;
            const proxy = Comlink.wrap<TableDataComparator>(worker);
            try {
                proxy.setReferenceTimestampColumnIndex(referenceDateColumn.current);
                proxy.setTargetTimestampColumnIndex(targetDateColumn.current);
                setResult(await proxy.compare(reference!, target!));
            } catch (error) {
                setResult({ status: "Error", errorMessage: (error instanceof Error ? error.message : "An error has been encountered while running the comparison")} as AdaptedResult)            
            } finally {            
                currentWorker.current.terminate();
                currentWorker.current = null;
                setIsLoading(false);
            }                
        }
    }, [reference, target, result, referenceDateColumn, targetDateColumn]);    

    return {
        reference,
        setReference,
        target,
        setTarget,
        compare,
        result,
        isLoading,
        handleSelectStrategy,
        setReferenceDateColumn,
        setTargetDateColumn,
        availableComparators
    };
}