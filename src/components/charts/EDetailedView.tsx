import type { TableData } from "../../types/Dataset";
import EDistanceGraph from "./EDistanceGraph";
import EMisalignmentGraph from "./EMisalignmentGraph";
import HeatmapParallelCoord from "./heatmap/HeatmapParallelCoord";
import type { AdaptedResult } from "../../utils/adapter/Adapter.types";
import { useMemo } from "react";

type EDetailedViewProps = {
    result : AdaptedResult;
    referenceTable : TableData;
    targetTable : TableData;
}

export default function EDetailedView({ result, referenceTable, targetTable } : EDetailedViewProps){

    const isResultValid = useMemo(() => {
        return (result && result.status === "Success" && result.result && result.result.length > 0)
    }, [result])

    const getDimensions = useMemo(() => {
        if(isResultValid){
            return Object.keys(result.result![0]);
        }        
    }, [result])

    const tablesAtResult = useMemo(() => {
        if(isResultValid){
            return { referenceTable, targetTable };
        }
    }, [result])

    return(isResultValid && (
        <>
        <EDistanceGraph dimensions={getDimensions!} source={result.result!} />
        <EMisalignmentGraph dimensions={getDimensions!} source={result.result!} />
        <HeatmapParallelCoord reference={tablesAtResult!.referenceTable} target={tablesAtResult!.targetTable} source={result.result!} />
        </>
    ));
}