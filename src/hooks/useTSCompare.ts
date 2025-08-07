import { useRef, useState } from "react";
import type { TableData } from "../types/Dataset";
import { TableDataComparator} from "../utils/adapter/TSComparatorAdapter";
import type { AdaptedResult } from "../utils/adapter/Adapter.types";
import * as Comlink from 'comlink';
import type { ComparatorWorkerFactory } from "../utils/workers/factory/WorkerFactory";
import { EuclideanComparatorFactory } from "../utils/workers/factory/EuclideanComparatorFactory";
import { ManhattanComparatorFactory } from "../utils/workers/factory/ManhattanComparatorFactory";

export default function useTSCompare(){

    const availableStrategies = ['euclidean', 'karl-pearson', 'manhattan'];
    const workerFactory = useRef<ComparatorWorkerFactory | null>(null);

    const [selectedStrategy, setSelectedStrategy] = useState<number>(0);

    const [referenceDateColumn, setReferenceDateColumn] = useState<number>(-1);
    const [targetDateColumn, setTargetDateColumn] = useState<number>(-1);

    const [result, setResult] = useState<AdaptedResult | null>(null);

    const handleSelectStrategy = (index : number) => {
        setSelectedStrategy(index);
    }

    const runComparison = async (reference : TableData, target : TableData) => {
        switch ( availableStrategies[selectedStrategy] ) {
            case 'euclidean':
                workerFactory.current = new EuclideanComparatorFactory();
                break;
            case 'manhattan':
                workerFactory.current = new ManhattanComparatorFactory();
                break;
            default:
                throw new Error("Invalid distance strategy selected.");
                break;
        }
        const worker = workerFactory.current?.create()!;
        const proxy = Comlink.wrap<TableDataComparator>(worker);
        proxy?.setReferenceTimestampColumn(referenceDateColumn);
        proxy?.setTargetTimestampColumn(targetDateColumn);
        proxy?.runComparison(reference,target).then(res => {
            setResult(res);
            worker.terminate();
        });
    }

    return { availableStrategies, handleSelectStrategy, setReferenceDateColumn, setTargetDateColumn, runComparison, result };
}