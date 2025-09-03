import { useCallback, useEffect, useMemo, useState } from "react";
import HeatmapOptions from "./HeatmapOptions";
import type { TableData } from "../../../types/Dataset";
import { exampleScales } from "../colorscales";
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
                    scale: exampleScales[0]} as HeatmapConfig);
        });
}

export default function HeatmapParallelCoord({reference, target, source} : HeatmapParallelProps) {
    const [refHmapConfig, setRefHmapConfig] = useState<HeatmapConfig[]>([]);
    const [targetHmapConfig, setTargetHmapConfig] = useState<HeatmapConfig[]>([]);
    const [wapingPairs, setWarpingPairs] = useState<Array<WarpingPair>>([]);

    const [toggledRefOps, setToggledRefOps] = useState<Boolean>(false);
    const [toggledTargetOps, setToggledTargetOps] = useState<Boolean>(false);

    useEffect(() => {
        setRefHmapConfig(initializeRefHeatmap)
    }, [reference]);

    useEffect(() => {
        setTargetHmapConfig(initializeTargetHeatmap);
    }, [target]);

    useEffect(() => {    
        setWarpingPairs(computeWarpingPairs);
    }, [source]);

    const initializeRefHeatmap = useMemo(() => initializeHeatmap(reference), [reference]);
    const initializeTargetHeatmap = useMemo(() => initializeHeatmap(target), [target]);

    const computeWarpingPairs = useMemo(() => {
        return source.map((entry, index) => 
            ({n: index, f_n: entry.warping, d_o_g: entry.degree_of_misalignment} as WarpingPair)
        );
    }, [source]);

    const toggleRefOps = useCallback(() => {
        setToggledRefOps(prev => !prev);
    }, []);

    const toggleTargetOps = useCallback(() =>{
        setToggledTargetOps(prev => !prev);
    }, []);

    return (<>
        <HeatmapOptions toggled={toggledRefOps} headers={reference.headers} hmapConfig={refHmapConfig} setHmapConfig={setRefHmapConfig}/>
        <button className="toggleHeatmapOptions" onClick={toggleRefOps}>Ref. heatmap options</button>        
        <EHeatmapParallelCoord refHmapConfig={refHmapConfig} targetHmapConfig={targetHmapConfig} warpingPairs={wapingPairs} />
        <button className="toggleHeatmapOptions" onClick={toggleTargetOps}>Target heatmap options</button>
        <HeatmapOptions toggled={toggledTargetOps} headers={target.headers} hmapConfig={targetHmapConfig} setHmapConfig={setTargetHmapConfig}/>
    </>)
}