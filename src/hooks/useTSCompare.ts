import { useEffect, useRef, useState } from "react";
import { UnweightedEuclidean, Manhattan, TSComparator, type ComparisonResult } from "../utils/TSCompare";
import { TSComparatorAdapter, type TargetTSComparator } from "../utils/adapter/TSCompareAdapter";
import type { TableData } from "../types/Dataset";

export default function useTSCompare(){

    const adaptee = useRef<TSComparator | null>(null);
    const comparator = useRef<TargetTSComparator | null>(null);    
    const availableStrategies = ['euclidean', 'karl-pearson', 'manhattan'];
    const [selectedStrategy, setSelectedStrategy] = useState<number>(0);

    const [result, setResult] = useState<ComparisonResult | null>(null);

    useEffect(()  => {
        adaptee.current = new TSComparator();
        comparator.current = new TSComparatorAdapter(adaptee.current);
    }, []);

    const handleSelectStrategy = (index : number) => {
        setSelectedStrategy(index);
    }

    const runComparison = (reference : TableData, target : TableData) => {
        switch ( availableStrategies[selectedStrategy] ) {
            case 'euclidean':
                comparator.current?.setStrategy(new UnweightedEuclidean());
                break;
            case 'manhattan':
                comparator.current?.setStrategy(new Manhattan());
                break;
            default:
                throw new Error("Invalid distance strategy selected.");                
                break;
        }
        const res = comparator.current?.runComparison(reference.data, target.data);
        if(res){
            setResult(res);
        }        
    }

    return { availableStrategies, handleSelectStrategy, runComparison, result };
}