import ReactECharts from 'echarts-for-react';
import type { ComparisonResult } from '../../utils/TSCompare';
type DistanceGraphProps = {
  dimensions : Array<string>;
  source : ComparisonResult;
}

export default function EDistanceGraph({ dimensions, source } : DistanceGraphProps){

const option = {
  legend: {},
  tooltip: {
    trigger: 'axis',
    formatter: (params : any[]) => {
      return `
                Time from reference: ${params[0].value.index}: <br />
                Distance: ${params[0].value.distance}<br />
                Degree of misalignment: ${params[1].value.degree_of_misalignment}
                `;
    },
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
    name: 'Distance',
    nameGap: 25,
    nameLocation: 'middle',
    nameTextStyle: {
      fontSize: 18
    },
  },
  visualMap: {
    seriesIndex: 0,
    orient: 'horizontal',
    left: 'right',
    min: -1,
    max: 1,
    text: ['Early','Late'],
    dimension: 4,
    inRange: {
      color: ['rgb(127,165,165)', 'rgb(239,255,168)' ,'rgb(238,157,122)']
    }
  },
  series: [
    {
      type: 'bar',
      encode: {
        x: 'index',
        y: 'distance'
      },
      animation: false,
    },
    {
      name: 'Distance',
      type: 'line',
      encode: {
        x: 'index',
        y: 'distance'
      },
      color: "rgb(0,0,0)",
      animation: false,
      smooth: true,
      showSymbol: false
    }
  ]
};

    return (<>
    <div style={{width: '100%', height: '100%'}}>
      <ReactECharts option={option} opts={{renderer: 'svg'}}/>
    </div>    
    </>);
}