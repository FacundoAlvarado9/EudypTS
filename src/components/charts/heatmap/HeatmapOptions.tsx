import { useCallback } from "react";
import { exampleScales } from "../colorscales";
import type { HeatmapConfig } from "./Heatmap.types";
import './Heatmaps.css';

type HeatmapOptionsProps = {
    toggled : Boolean;
    hmapConfig : HeatmapConfig[];
    setHmapConfig : React.Dispatch<React.SetStateAction<HeatmapConfig[]>>;
}

export default function HeatmapOptions({toggled, hmapConfig, setHmapConfig} : HeatmapOptionsProps) {

    const updateHmapConfigValue = useCallback(
        <TKey extends keyof HeatmapConfig, TValue extends HeatmapConfig[TKey]>(hmapId: number,property: string,newValue: TValue) => {
        const newConfig = hmapConfig.map(config =>
            (config.id === hmapId)
                ? { ...config, [property]: newValue }
                : config
        );
        setHmapConfig(newConfig);
    }, [hmapConfig]);

    const getParsedFloatOrDefault = useCallback((input : string, defaultValue : number) => {
        return (input == "") ? defaultValue : parseFloat(input);
    }, []);

    return (<>
    {toggled && hmapConfig.map((header, index) => (
        <div className="heatmapControl" key={header+index.toString()+"div"}>
            <p className="heatmapName">{header.name}</p>
            <p>Min: </p>
            <input type="number" onChange={(e) => updateHmapConfigValue(index, 'min', getParsedFloatOrDefault(e.target.value, hmapConfig[index].defaultMin))}/>
            <select id={header+"ScaleSelector"} value={hmapConfig[index].scaleIndex} onChange={(e) => updateHmapConfigValue(index, 'scaleIndex', parseInt(e.target.value))}>
                {exampleScales.map((scale, scaleIndex) => (
                    <option key={scale.name} value={scaleIndex}>{scale.name}</option>
                ))}
            </select>
            <p>Max: </p>
            <input type="number" onChange={(e) => updateHmapConfigValue(index, 'max', getParsedFloatOrDefault(e.target.value, hmapConfig[index].defaultMax))}/>                
        </div>  
            
    ))}
    </>)
}