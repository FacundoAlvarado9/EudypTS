import ReactECharts from 'echarts-for-react';
import { useMemo } from 'react';
import type { HeatmapConfig, WarpingPair } from './Heatmap.types';
import { exampleScales } from '../colorscales';

type auxProps = {
    refHmapConfig : HeatmapConfig[];
    targetHmapConfig : HeatmapConfig[];
    warpingPairs : WarpingPair[];
}

function getColor(value : number){
    let red : number;
    let green : number;
    let blue : number;
    if(value < 0){
        red = Math.max(0, Math.min(255, 112*value+239));
        green = Math.max(0, Math.min(255, 90*value+255));
        blue = Math.max(0, Math.min(255, 100*value+268));
    } else {
        red = Math.max(0, Math.min(255, 239-value));
        green = Math.max(0, Math.min(255, 255-98*value));
        blue = Math.max(0, Math.min(255, 166-46*value));
    }
    return "rgb("+red+","+green+","+blue+")";
}

export default function EHeatmapParallelCoord({refHmapConfig, targetHmapConfig, warpingPairs} : auxProps){

    const getRefHmap = useMemo(() => {
        return refHmapConfig.map((config) => ({            
                        id: "ref"+config.name,
                        type: 'heatmap',
                        xAxisIndex: 0,
                        yAxisIndex: 0,
                        data: config.data.map((value, index) => [index, config.name, value]),
                        animation: false,
                        tooltip: {
                            trigger: 'item',
                            formatter: function(params : any){
                                return `
                                    <b>Time from Reference: ${params.value[0]}</b>
                                    <p>${params.value[1]}: <span style="color:${params.color}">█</span> ${params.value[2]}</p>                             
                                    `
                            }
                        }
                    }));
    }, [refHmapConfig]);

    const getTargetHmap = useMemo(() => {
        return targetHmapConfig.map((config) => ({            
                        id: "target"+config.name,
                        type: 'heatmap',
                        xAxisIndex: 2,
                        yAxisIndex: 2,
                        data: config.data.map((value, index) => [index, config.name, value]),
                        animation: false,
                        tooltip: {
                            trigger: 'item',
                            formatter: function(params : any){
                                return `
                                    <b>Time from Target: ${params.value[0]}</b>
                                    <p>${params.value[1]}: <span style="color:${params.color}">█</span> ${params.value[2]}</p>                             
                                    `
                            }
                        }
                    }));
    }, [targetHmapConfig]);

    const getWarpingChart = useMemo(() => {
        return warpingPairs.map((pair) => ({
                        type: 'line',
                        xAxisIndex: 1,
                        yAxisIndex: 1,
                        data: [
                            [pair.n,1],[pair.f_n,0]
                        ],
                        lineStyle: { width: 1.5 },
                        color: getColor(pair.d_o_g),
                        symbol: 'circle',
                        symbolSize: 2,
                        animation: false
                    }))
    }, [warpingPairs]);

    const getRefVisualMaps = useMemo(() => {
        return refHmapConfig.map((config) => ({
                    id: "VMref"+config.name,
                    type: 'continuous',
                    seriesId: "ref"+config.name,
                    min: config.min,
                    max: config.max,
                    calculable: false,
                    realtime: false,
                    show: true,
                    orient: 'horizontal',
                    right: (15*Math.abs(((config.id)%5))+15).toString()+'%',
                    top: (10*(Math.floor((config.id)/5))).toString()+'%',
                    text: ["",config.name],
                    inRange: {
                    color: exampleScales[config.scaleIndex].scale,
                    },
                    formatter: function (value: string) {
                    return value;
                    }
                }));
    }, [refHmapConfig]);

    const getTargetVisualMaps = useMemo(() => {
        return targetHmapConfig.map((config) => ({
                    id: "VMtarget"+config.name,
                    type: 'continuous',
                    seriesId: "target"+config.name,
                    min: config.min, 
                    max: config.max,
                    calculable: false,
                    realtime: false,
                    show: true,
                    orient: 'horizontal',
                    left: (15*Math.abs((config.id%5)-4)+15).toString()+'%',
                    bottom: (10*(Math.floor((config.id)/5))).toString()+'%',
                    text: ["",config.name],
                    inRange: {
                        color: exampleScales[config.scaleIndex].scale,
                    },
                    formatter: function (value: string) {
                        return value;
                    }
                }))
    }, [targetHmapConfig])

    const getOption = useMemo(() => {
        if(getRefHmap.length > 0 && getTargetHmap.length > 0 && getWarpingChart.length > 0){
            return ({
                tooltip: {},
                grid: [
                    { top: '17%', height: '25%' },
                    { top: '36%', height: '25%'},
                    { bottom: '20%', height: '25%' }

                ], 
                xAxis: [
                    {gridIndex: 0, type: 'category', data: getRefHmap[0]?.data.map((_, index) => index), axisLabel: {show: false}},
                    {gridIndex: 1, type: 'value', min: 0, max: getWarpingChart.length, splitLine:{show:false}, axisLabel: {show: false}},
                    {gridIndex: 2, type: 'category', data: getTargetHmap[0]?.data.map((_, index) => index)}
                ],
                yAxis: [
                    {gridIndex: 0, type: 'category'},
                    {gridIndex: 1, type: 'category', data: ['Target', 'Reference']},
                    {gridIndex: 2, type: 'category'}
                ],
                visualMap: [...getRefVisualMaps, ...getTargetVisualMaps],
                series: [...getRefHmap, ...getTargetHmap, ...getWarpingChart]
            } as Object);
        }
    }, [getRefVisualMaps, getTargetVisualMaps, getRefHmap, getTargetHmap, getWarpingChart]);    

    return (<>
    {getOption && <div style={{ width: "100%", height: "100%" }}>
            <ReactECharts option={getOption} style={{height: '45em', width: '100%'}} notMerge={true} opts={{renderer: 'svg'}}/>
        </div> }             
    </>);
}