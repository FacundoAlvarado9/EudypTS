import { useEffect, useRef, useState } from "react";
import { EuclideanDistance, ManhattanDistance, TSComparator, type ComparisonResult, type TimeSeries } from "../utils/TSCompare";

export default function useTSCompare(){

    const comparator = useRef<TSComparator | null>(null);     
    const availableStrategies = ['euclidean', 'karl-pearson', 'manhattan'];
    const [selectedStrategy, setSelectedStrategy] = useState<number>(0);

    const [result, setResult] = useState<ComparisonResult | null>(null);

    useEffect(()  => {
        comparator.current = new TSComparator();
    }, []);

    const handleSelectStrategy = (index : number) => {
        setSelectedStrategy(index);
    }

    const runComparison = (reference : TimeSeries, target : TimeSeries) => {
        switch ( availableStrategies[selectedStrategy] ) {
            case 'euclidean':
                comparator.current?.setStrategy(new EuclideanDistance());
                break;
            case 'manhattan':
                comparator.current?.setStrategy(new ManhattanDistance());
                break;
            default:
                throw new Error("Invalid distance strategy selected.");                
                break;
        }
        const res = comparator.current?.runComparison(reference, target);
        if(res){
            setResult(res);
        }        
    }

    return { availableStrategies, handleSelectStrategy, runComparison, result };
}