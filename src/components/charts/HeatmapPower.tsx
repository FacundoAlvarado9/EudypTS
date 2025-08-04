import { useEffect, useState } from "react";
import { exampleScales } from "./colorscales";
import EHeatmap from "./EHeatmap";
import ScalePicker from "./ScalePicker";
import './styles/Heatmaps.css';
import type { TableData } from "../../types/Dataset";

type HeatmapPowerProps = {
    tableData : TableData;
}

type Scale = {
    name : string;
    scale : Array<string>;
}

type HeatmapConfig = {
    id : number;
    name : string;
    data : Array<number>;
    min : number;
    max : number;
    defaultMin : number;
    defaultMax : number;
    scale : Scale;
}

export default function HeatmapPower({tableData} : HeatmapPowerProps) {
    const [hmapConfig, setHmapConfig] = useState<HeatmapConfig[]>([]);
    const [toggled, setToggled] = useState<Boolean>(false);
    const availableScales = exampleScales;

    useEffect(() => {
        initializeHeatmaps();
    }, []);

    const initializeHeatmaps = () => {
        const hmapConfig = Array<HeatmapConfig>();
        tableData.headers.forEach((header, index) => {
            const data = tableData.data.map((row) => parseFloat(row[index]));
            const minValue = Math.min(...data);
            const maxValue = Math.max(...data);
            hmapConfig.unshift(
                {
                    id: index,
                    name: header,
                    data: data,
                    min: minValue,
                    max: maxValue,
                    defaultMin: minValue,
                    defaultMax: maxValue,
                    scale: availableScales[0]
                } as HeatmapConfig
            );
        });
        setHmapConfig(hmapConfig);
    }

    const updateHmapConfigValue = <TKey extends keyof HeatmapConfig, TValue extends HeatmapConfig[TKey]>(
        hmapId: number,
        property: string,
        newValue: TValue,
        currentConfig: HeatmapConfig[]
    ) => {
        const newConfig = currentConfig.map(config =>
            (config.id === hmapId)
                ? { ...config, [property]: newValue }
                : config
        );
        setHmapConfig(newConfig);
    };

    const onSelectScale = (hmapId : number, scaleID : number) => {
        updateHmapConfigValue(hmapId, 'scale', availableScales[scaleID], hmapConfig);
    }

    const getParsedFloatOrDefault = (input : string, defaultValue : number) => {
        return (input == "") ? defaultValue : parseFloat(input);
    }    

    const onChangeMin = (hmapId : number, input : string) => {
        let newMin = getParsedFloatOrDefault(input, hmapConfig[hmapId].defaultMin);
        updateHmapConfigValue(hmapId, 'min', newMin, hmapConfig);
    }

    const onChangeMax = (hmapId : number, input : string) => {
        let newMax = getParsedFloatOrDefault(input, hmapConfig[hmapId].defaultMax)
        updateHmapConfigValue(hmapId, 'max', newMax, hmapConfig);
    }

    return (<>
        <EHeatmap heatmapConfig={hmapConfig} />
        <button className="toggleHeatmapOptions" onClick={() => setToggled(!toggled)}>Heatmap options</button>
        {toggled && tableData.headers.map((header, index) => (
            <div className="heatmapControl" key={header+index.toString()+"div"}>
                <p className="heatmapName">{header}</p>
                <p>Min: </p>
                <input type="number" name="" id="" onChange={(e) => onChangeMin(index, e.target.value)}/>
                <ScalePicker key={header+index.toString()} selectId={header+"ScaleSelector"} scales={availableScales} onChange={(scaleId) => onSelectScale(index, parseInt(scaleId))} />
                <p>Max: </p>
                <input type="number" name="" id="" onChange={(e) => onChangeMax(index, e.target.value)}/>                
            </div>  
              
        ))}
    </>);

}