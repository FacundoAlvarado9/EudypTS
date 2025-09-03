import ReactECharts from 'echarts-for-react';
import {useMemo} from 'react';
import type { HeatmapConfig, WarpingPair } from './Heatmap.types';

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

export default function EHeatmapParallelCoord({refHmapConfig, targetHmapConfig, warpingPairs} : auxProps) {

    const refHmap = useMemo(() => {
        console.log("doin it ref hmap")
        return refHmapConfig.map((config) => ({            
                name: config.name,
                type: 'heatmap',
                xAxisIndex: 0,
                yAxisIndex: 0,
                data: config.data.map((value, index) => [index, config.name, value]),
                animation: false,
                tooltip: {
                    trigger: 'item',
                    formatter: function(params : any){
                        console.log(params);
                        return `
                            <b>Time from Reference: ${params.value[0]}</b>
                            <p>${params.value[1]}: <span style="color:${params.color}">█</span> ${params.value[2]}</p>                             
                            `
                    }
                }
                }));
    }, [refHmapConfig]);

    const targetHmap = useMemo(() => {
        console.log("doin it target hmap")
        return targetHmapConfig.map((config) => ({
                name: config.name,
                type: 'heatmap',
                xAxisIndex: 2,
                yAxisIndex: 2,
                data: config.data.map((value, index) => [index, config.name, value]),
                animation: false,
                tooltip: {
                    trigger: 'item',
                    formatter: function(params : any){
                        console.log(params);
                        return `
                            <b>Time from Target: ${params.value[0]}</b>
                            <p>${params.value[1]}: <span style="color:${params.color}">█</span> ${params.value[2]}</p>                             
                            `
                    }
                }
                }));
    }, [targetHmapConfig]);

    const warpingChart = useMemo(() => {
        console.log("doin it warping pairs")
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
            }));
    }, [warpingPairs])

    const visualMaps = useMemo(() => {
        const visMaps : Array<Object> = [];
        refHmapConfig.forEach((config, index) => {
            visMaps.push({
                type: 'continuous',
                seriesIndex: index,
                min: config.min,
                max: config.max,
                calculable: false,
                realtime: false,
                show: true,
                orient: 'horizontal',
                right: (15*Math.abs(((index)%5))+15).toString()+'%',
                top: (10*(Math.floor((index)/5))).toString()+'%',
                text: ["",config.name],
                inRange: {
                color: config.scale.scale,
                },
                formatter: function (value: string) {
                return value;
                }
            });
        });
        targetHmapConfig.forEach((config, index) => {
            visMaps.push({
                type: 'continuous',
                seriesIndex: refHmapConfig.length+index,
                min: config.min,
                max: config.max,
                calculable: false,
                realtime: false,
                show: true,
                orient: 'horizontal',
                left: (15*Math.abs((index%5)-4)+15).toString()+'%',
                bottom: (10*(Math.floor((index)/5))).toString()+'%',
                text: ["",config.name],
                inRange: {
                    color: config.scale.scale,
                },
                formatter: function (value: string) {
                    return value;
                }
            });
        });
        return visMaps;
    }, [refHmapConfig, targetHmapConfig]);

    const eChartsOption = useMemo(() => {
        console.log("doin it option")
        const _refXAxis : Array<number> = refHmapConfig[0]?.data.map((_, index) => index);
        const _targetXAxis : Array<number> = targetHmapConfig[0]?.data.map((_, index) => index);

        return {
            tooltip: {},
            grid: [
                { top: '17%', height: '25%' },
                { top: '36%', height: '25%'},
                { bottom: '20%', height: '25%' }

            ], 
            xAxis: [
                {gridIndex: 0, type: 'category', data: _refXAxis, axisLabel: {show: false}},
                {gridIndex: 1, type: 'value', min: 0, max: warpingChart.length, splitLine:{show:false}},
                {gridIndex: 2, type: 'category', data: _targetXAxis}
            ],
            yAxis: [
                {gridIndex: 0, type: 'category'},
                {gridIndex: 1, type: 'category', data: ['Target', 'Reference']},
                {gridIndex: 2, type: 'category'}
            ],
            visualMap: visualMaps,
            series: [...refHmap, ...targetHmap, ...warpingChart]
        }
    }, [refHmap, targetHmap, warpingChart, refHmapConfig, targetHmapConfig]);

    return (<>
        <div style={{ width: "100%", height: "100%" }}>
            <ReactECharts option={eChartsOption} style={{height: '45em', width: '100%'}} opts={{renderer: 'svg'}}/>
        </div>      
    </>);
}