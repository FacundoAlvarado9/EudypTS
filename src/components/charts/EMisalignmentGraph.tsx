import ReactECharts from 'echarts-for-react';
import type { ComparisonResult } from '../../utils/TSCompare';
type MisalignmentGraph = {
  dimensions : Array<string>;
  source : ComparisonResult;
}

export default function EMisalignmentGraph({ dimensions, source } : MisalignmentGraph){

  const option = {
    legend: {},
    tooltip: {
      trigger: 'axis',
    },
    dataset: {
      dimensions: dimensions,
      source: source
    },
    xAxis: {
      type:'category',
      name: 'Time from reference',
      nameGap: 25,
      nameLocation: 'middle',
      nameTextStyle: {
        fontSize: 18
      },
    },
    yAxis: {
      name: 'Misalignment',
      nameGap: 25,
      nameLocation: 'middle',
      nameTextStyle: {
        fontSize: 18
      },
    },
    series: [
      {
        name: 'Misalignment',
        type: 'line',
        encode: {
          x: 'index',
          y: 'misalignment'
        },
        color: "rgb(0,0,0)",
        animation: false,
        smooth: true,
        showSymbol: false
      }
    ]
  };

    return (<>
    <div style={{width: '100%', height: '100%'}} >
      <ReactECharts option={option} opts={{renderer: 'svg'}}/>
    </div>    
    </>);
}