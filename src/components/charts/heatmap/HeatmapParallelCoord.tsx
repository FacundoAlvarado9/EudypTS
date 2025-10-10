import { useCallback, useEffect, useState } from "react";
import HeatmapOptions from "./HeatmapOptions";
import type { TableData } from "../../../types/TableData.types";
import type { HeatmapConfig, VisEntry, WarpingPair } from "./Heatmap.types";
import EHeatmapParallelCoord from "./EHeatmapParallelCoord";

type HeatmapParallelProps = {
    reference : TableData;
    target : TableData;
    source : Array<VisEntry>;
}

function initializeHeatmap(table : TableData){
    return table.headers.map((header, index) => {
            const data = table.data.map((row) => parseFloat(row[index]));
            const minValue = Math.min(...data);
            const maxValue = Math.max(...data);
            return ({id: index,
                    name: header,
                    data: data,
                    min: minValue,
                    max: maxValue,
                    defaultMin: minValue,
                    defaultMax: maxValue,
                    scaleIndex: 0} as HeatmapConfig);
        });
}

export default function HeatmapParallelCoord({reference, target, source} : HeatmapParallelProps) {
    const [refHmapConfig, setRefHmapConfig] = useState<HeatmapConfig[]>([]);
    const [targetHmapConfig, setTargetHmapConfig] = useState<HeatmapConfig[]>([]);
    const [wapingPairs, setWarpingPairs] = useState<Array<WarpingPair>>([]);

    const [loading, setLoading] = useState<Boolean>(false);
    const [toggledTargetOps, setToggledTargetOps] = useState<Boolean>(false);
    const [toggledRefOps, setToggledRefOps] = useState<Boolean>(false);

    useEffect(() => {
        setLoading(true);

        setRefHmapConfig(initializeHeatmap(reference));
        setTargetHmapConfig(initializeHeatmap(target));
        setWarpingPairs(() => {
            return source.map((entry, index) => ({n: index, f_n: entry.warping, d_o_g: entry.degree_of_misalignment} as WarpingPair));        
        });        
        setLoading(false);
    }, [source, reference, target]);

    const toggleTargetOps = useCallback(() => {
        setToggledTargetOps(prev => !prev);
    }, []);

    const toggleRefOps = useCallback(() => {
        setToggledRefOps(prev => !prev);
    }, []);

    return (<>
        {!loading && (<>        
        <HeatmapOptions toggled={toggledRefOps} hmapConfig={refHmapConfig} setHmapConfig={setRefHmapConfig}/>
        <button className="toggleHeatmapOptions" onClick={toggleRefOps}>Ref. heatmap options</button>
        <EHeatmapParallelCoord refHmapConfig={refHmapConfig} targetHmapConfig={targetHmapConfig} warpingPairs={wapingPairs} />
        <button className="toggleHeatmapOptions" onClick={toggleTargetOps}>Target heatmap options</button>
        <HeatmapOptions toggled={toggledTargetOps} hmapConfig={targetHmapConfig} setHmapConfig={setTargetHmapConfig}/>
        </>)}
    </>)
}