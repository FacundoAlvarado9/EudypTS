import type { TableData } from "../../types/Dataset";
import type { ComparisonResult } from "../../utils/TSCompare";
import EDistanceGraph from "./EDistanceGraph";
import EMisalignmentGraph from "./EMisalignmentGraph";
import HeatmapParallelCoord from "./heatmap/HeatmapParallelCoord";

type EDetailedViewProps = {
    result : ComparisonResult;
    referenceTable : TableData;
    targetTable : TableData;
}

export default function EDetailedView({ result, referenceTable, targetTable } : EDetailedViewProps){
    const dimensions = ["index", "warping", "distance", "misalignment", "degree_of_misalignment"];

    return(<>
        <EDistanceGraph dimensions={dimensions} source={result} />
        <EMisalignmentGraph dimensions={dimensions} source={result} />
        <HeatmapParallelCoord reference={referenceTable} target={targetTable} source={result} />
    </>);
}