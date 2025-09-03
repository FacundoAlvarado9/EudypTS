import { useCallback } from "react";
import { exampleScales } from "../colorscales";
import ScalePicker from "../ScalePicker";
import type { HeatmapConfig } from "./Heatmap.types";
import './Heatmaps.css';

type HeatmapOptionsProps = {
    toggled : Boolean;
    headers : String[];
    hmapConfig : HeatmapConfig[];
    setHmapConfig : React.Dispatch<React.SetStateAction<HeatmapConfig[]>>;
}

export default function HeatmapOptions({toggled, headers, hmapConfig, setHmapConfig} : HeatmapOptionsProps) {

    const updateHmapConfigValue = useCallback(
        <TKey extends keyof HeatmapConfig, TValue extends HeatmapConfig[TKey]>(hmapId: number,property: string,newValue: TValue) => {
        const newConfig = hmapConfig.map(config =>
            (config.id === hmapId)
                ? { ...config, [property]: newValue }
                : config
        );
        setHmapConfig(newConfig);
    }, [hmapConfig]);

    const onSelectScale = (hmapId : number, scaleID : number) => {
        updateHmapConfigValue(hmapId, 'scale', exampleScales[scaleID]);
    }

    const getParsedFloatOrDefault = useCallback((input : string, defaultValue : number) => {
        return (input == "") ? defaultValue : parseFloat(input);
    }, []);

    return (<>
    {toggled && headers.map((header, index) => (
        <div className="heatmapControl" key={header+index.toString()+"div"}>
            <p className="heatmapName">{header}</p>
            <p>Min: </p>
            <input type="number" name="" id="" onChange={(e) => updateHmapConfigValue(index, 'min', getParsedFloatOrDefault(e.target.value, hmapConfig[index].defaultMin))}/>
            <ScalePicker key={header+index.toString()} selectId={header+"ScaleSelector"} scales={exampleScales} onChange={(scaleId) => onSelectScale(index, parseInt(scaleId))} />
            <p>Max: </p>
            <input type="number" name="" id="" onChange={(e) => updateHmapConfigValue(index, 'max', getParsedFloatOrDefault(e.target.value, hmapConfig[index].defaultMax))}/>                
        </div>  
            
    ))}
    </>)
}