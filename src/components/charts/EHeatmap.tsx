import ReactECharts from 'echarts-for-react';

type Scale = {
    name : string;
    scale : Array<string>;
}

type HeatmapConfig = {
    name : string;
    data : Array<number>;
    min : number;
    max : number;
    scale : Scale;
}

type HeatmapProps = {
    heatmapConfig : Array<HeatmapConfig>;
}

export default function EHeatmap({heatmapConfig} : HeatmapProps){

    const visMaps : Array<Object> = [];
    const _series : Array<Object> = [];
    const _xAxis : Array<number> = heatmapConfig[0]?.data.map((_, index) => index);

    heatmapConfig.forEach((config, index) => {
        const _data = config.data.map((value, index) => [index, config.name, value]);
        visMaps.push({
            id: config.name,
            type: 'continuous',
            seriesIndex: index,
            min: config.min,
            max: config.max,
            calculable: false,
            realtime: false,
            show: true,
            orient: 'horizontal',
            left: (20*Math.abs((index%5)-4)).toString()+'%',
            bottom: ((10*Math.floor((index)/5))).toString()+'%',
            //bottom: (10*(Math.floor(heatmapConfig.length/5)-(Math.floor(index/5)))).toString()+'%',
            text: ["",config.name],
            inRange: {
            color: config.scale.scale,
            },
            formatter: function (value: string) {
              return value;
            }
        });

        _series.push({
            name: config.name,
            type: 'heatmap',
            data: _data,
            animation: false
            });
    });

    const option = {        
        tooltip: {},
        grid: {
            top: '18%',
            bottom: (15*Math.ceil(heatmapConfig.length/5)).toString()+'%'           
        },
        xAxis: {
            type: 'category',
            data: _xAxis
        },
        yAxis: {
          type: 'category',
        },
        visualMap: visMaps,
        series: _series,
    };



    return (<>
      <div style={{ width: "100%", height: "100%" }}>
        <ReactECharts option={option}  opts={{renderer: 'svg'}}/>
      </div>
    </>);
}

/*<EChart
style={{height: '400px', width: '1300px'}}
          style={{
            height: "400px",
            width: "1200px",
          }}
          tooltip={{}}
          grid={{
                left: '10%',
                right: 150,
                top: '18%',
                bottom: (15*Math.ceil(heatmapConfig.length/5)).toString()+'%'
          }}
          xAxis={{
            type: "category",
            data: _xAxis,
          }}
          yAxis={{
            type: "category",
          }}
        visualMap={visMaps}
          series={_series}
        /> */