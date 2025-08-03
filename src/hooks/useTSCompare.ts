import { useEffect, useRef, useState } from "react";
import { UnweightedEuclidean, Manhattan, TSComparator } from "../utils/TSCompare";
import type { TableData } from "../types/Dataset";
import { TableDataComparator } from "../utils/adapter/TSComparatorAdapter";
import type { AdaptedResult } from "../utils/adapter/Adapter.types";

export default function useTSCompare(){

    const adaptee = useRef<TSComparator | null>(null);
    const adapter = useRef<TableDataComparator | null>(null);

    const availableStrategies = ['euclidean', 'karl-pearson', 'manhattan'];
    const [selectedStrategy, setSelectedStrategy] = useState<number>(0);

    const [referenceDateColumn, setReferenceDateColumn] = useState<number>(-1);
    const [targetDateColumn, setTargetDateColumn] = useState<number>(-1);

    const [result, setResult] = useState<AdaptedResult | null>(null);

    useEffect(()  => {
        adaptee.current = new TSComparator();
        adapter.current = new TableDataComparator(adaptee.current);
    }, []);

    useEffect(()  => {
        adapter.current?.setReferenceTimestampColumn(referenceDateColumn);
    }, [referenceDateColumn]);

    useEffect(()  => {
        adapter.current?.setTargetTimestampColumn(targetDateColumn);
    }, [targetDateColumn]);

    const handleSelectStrategy = (index : number) => {
        setSelectedStrategy(index);
    }

    const runComparison = (reference : TableData, target : TableData) => {
        switch ( availableStrategies[selectedStrategy] ) {
            case 'euclidean':
                adapter.current?.setStrategy(new UnweightedEuclidean());
                break;
            case 'manhattan':
                adapter.current?.setStrategy(new Manhattan());
                break;
            default:
                throw new Error("Invalid distance strategy selected.");
                break;
        }
        setResult(adapter.current?.runComparison(reference, target) as AdaptedResult);      
    }

    return { availableStrategies, handleSelectStrategy, setReferenceDateColumn, setTargetDateColumn, runComparison, result };
}