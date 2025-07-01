import type { TimeSeries } from "./TSCompare";

function hasConsistentDimensionality(ts : TimeSeries){
    let hasConsistentDimensions = true;
    const expectedPointDimension = ts[0].length;

    for(let i=0; i<ts.length && hasConsistentDimensions; i++){
        const currentPoint = ts[i];
        if(currentPoint.length != expectedPointDimension){
            hasConsistentDimensions = false;
        }
    }

    return hasConsistentDimensions;
}

function sameDimensionality(ts_1 : TimeSeries, ts_2 : TimeSeries){
    return (ts_1[0].length === ts_2[0].length);
}

function isNumber(str : string) {
  return !isNaN(Number(str)) && !isNaN(parseFloat(str));
}

function containsOnlyNumeric(ts : Array<Array<any>>){
    let hasOnlyNumbers = true;
    for(let i=0; i<ts.length && hasOnlyNumbers; i++){
        for(let j=0; j<ts[0].length && hasOnlyNumbers; j++){
            hasOnlyNumbers = isNumber(ts[i][j]);
        }
    }
    return hasOnlyNumbers;
}

export default function checkTimeSeries(reference : TimeSeries, target : TimeSeries){
    //each is not empty
    if(reference.length === 0 || target.length === 0){
        throw new Error("Time-series must not be empty");        
    }

    //each has consistent dimensionality
    if(!hasConsistentDimensionality(reference) || !hasConsistentDimensionality(target)){
        throw new Error("Dimensionality should be consistent across all points in the time-series");        
    }

    //same dimensions
    if(!sameDimensionality(reference,target)){
        throw new Error("Reference and Target time-series must have the same dimensionality");        
    }

    //contains valid numeric values
    if(!containsOnlyNumeric(reference) || !containsOnlyNumeric(target)){
        throw new Error("Time-series must contain only numeric values");        
    }
}