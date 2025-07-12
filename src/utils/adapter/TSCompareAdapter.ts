import type { Row, TableData } from "../../types/Dataset";
import type { ComparisonResult, DistanceStrategy, NDimensionalPoint, TimeSeries, TSComparator } from "../TSCompare";


export interface TargetTSComparator {
    setStrategy(distanceStrategy : DistanceStrategy) : void;
    runComparison(reference : Row[], target : Row[]) : ComparisonResult;    
}

export class TSComparatorAdapter implements TargetTSComparator {

    private adaptee : TSComparator;

    constructor(adaptee : TSComparator){
        this.adaptee = adaptee;
    }

    public setStrategy(distanceStrategy: DistanceStrategy): void {
        this.adaptee.setStrategy(distanceStrategy);
    }

    public runComparison(reference: Row[], target: Row[]): ComparisonResult {
        return this.adaptee.runComparison(this.getTimeSeries(reference), this.getTimeSeries(target))
    }

    private getTimeSeries(rowCollection : Row[]) : TimeSeries {
        const timeSeries : TimeSeries = [];
        for(let i=0; i<rowCollection.length; i++){
            const point : NDimensionalPoint = [];
            for(let j=0; j<rowCollection[i].length; j++){
                point.push(Number(rowCollection[i][j]));
            }
            timeSeries.push(point);
        }
        return timeSeries;
    }

}