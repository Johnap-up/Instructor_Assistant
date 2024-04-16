<template>
  <div style="height:100%;display: flex;box-sizing: border-box;padding: 10px;flex-direction: column">
    <div style="height: calc(50vh - 27px - 10px);background-color: var(--el-bg-color);display: flex">
      <div id="chart1" style="width: 50%;height: 100%;background-color: var(--el-bg-color)">
      </div>
      <div id="chart2" style="width: 50%;height: 100%;background-color: var(--el-bg-color)">
      </div>
    </div>
    <div style="height: calc(50vh - 28px - 10px);background-color: var(--el-bg-color);display: flex">
      <div id="chart3" style="width: 50%;height: 100%;background-color: var(--el-bg-color);display: flex;align-items: center;justify-items: center">
      </div>
      <div id="chart4" style="width: 50%;height: 100%;background-color: var(--el-bg-color)">
      </div>
    </div>
  </div>
</template>

<script setup>
import * as echarts from 'echarts';
import {get} from "@/net/index.js"
import {reactive, nextTick} from "vue";
import {useUserInfoStore} from "@/store/index.js";

const store = useUserInfoStore();
const chartData = reactive({
  chart1: [],
  chart2: [],
  chart3: [],
  chart4: [],
})
function getCharts(){
  get("/api/charts/dormitory", data => {
    chartData.chart3 = dealData(data);
    nextTick(() =>{
      let chart3 = echarts.getInstanceByDom(document.getElementById("chart3"));
      if(!!chart3){
        chart3.dispose();
      }
      chart3 = echarts.init(document.getElementById("chart3"));
      const option3 = {
        title: {
          text: '学生宿舍楼分布情况',
              subtext: 'All Students',
              left: 'center'
        },
        tooltip: {
          trigger: 'item'
        },
        legend: {
          orient: 'vertical',
              left: 'left',
              itemWidth :32,
              itemHeight: 16,
              textStyle:{
            fontSize:18
          }
        },
        toolbox: {
          feature: {
            saveAsImage: {}
          }
        },
        series: [
          {
            name: 'Distribution',
            type: 'pie',
            top: 40,
            radius: '90%',
            data: chartData.chart3,
            label: {
              show: true,
              formatter: '{b}\n{c}',
              fontSize: 20
            },
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              },
              label: {
                show: true,
                fontSize: 25,
                fontWeight: 'bold',
                formatter: '{b}\n{c}'
              },
            },
          }
        ]
      };
      chart3.setOption(option3);
    })
  })
  get("/api/charts/gender", data =>{
    chartData.chart4 = data;
    const rawData = getGenderList(data);
    const totalData = getTotalData(rawData);
    const series = ["男生", "女生"].map((name, sid)=>{
      return{
        name,
        type: 'bar',
        stack: 'total',
        barWidth: '60%',
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          },
          label: {
            show: true,
            fontSize: 20,
            fontWeight: 'bold',
          },
        },
        label: {
          show: true,
          formatter: (params) => Math.round(params.value * 1000) / 10 + '%'
        },
        data: rawData[sid].map((d, did) =>
            totalData[did] <= 0 ? 0 : d / totalData[did]
        )
      }
    })
    nextTick(() => {
      const option4 = {
        legend: {
          selectedMode: false,
          orient:'vertical',
          right: 10,
          top: 20,
          bottom: 20
        },
        color: [
          '#c23531',
          '#2f4554',
        ],
        grid:{
          left: 100,
              right: 100,
              top: 50,
              bottom: 50
        },
        yAxis: {
          type: 'value'
        },
        xAxis: {
          type: 'category',
          data: getKeys(data, '班')
        },
        toolbox: {
          feature: {
            saveAsImage: {}
          }
        },
        series
      };
      let chart4 = echarts.getInstanceByDom(document.getElementById("chart4"));
      if(!!chart4){
        chart4.dispose();
      }
      chart4 = echarts.init(document.getElementById("chart4"));
      chart4.setOption(option4);
    })
  });
  get("/api/charts/learning-classroom", data =>{
    chartData.chart1 = data;
    nextTick(() => {
      const option = {
        color: [
          '#701e1b',
          '#2f4554',
        ],
        title: {
          text: '近5次班级平均提交率',
          subtext: 'All Classroom',
          left: 'center'
        },
        xAxis: {
          type: 'category',
          data: getKeys(data, '班')
        },
        yAxis: {
          type: 'value'
        },
        toolbox: {
          feature: {
            saveAsImage: {}
          }
        },
        series: [
          {
            data: getValues(data),
            label: {
              show: true,
              formatter: (params) => Math.round(params.value * 1000) / 10 + '%',
              fontSize: 20
            },
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              },
              label: {
                show: true,
                fontSize: 25,
                fontWeight: 'bold',
                formatter: (params) => Math.round(params.value * 1000) / 10 + '%',
              },
            },
            type: 'bar',
            showBackground: true,
            backgroundStyle: {
              color: 'rgba(180, 180, 180, 0.2)'
            }
          }
        ]
      };
      let chart1 = echarts.getInstanceByDom(document.getElementById("chart1"));
      if(!!chart1){
        chart1.dispose();
      }
      chart1 = echarts.init(document.getElementById("chart1"));
      chart1.setOption(option);
    })
  });
  get("/api/charts/latest-classroom", data => {
    chartData.chart2 = data;
    let length = 0;
    for (let dataKey in data) {
      length = data[dataKey].length;
      break;
    }
    const series = getKeys(data).map((name, sid)=>{
      return{
        name: name + "班",
        type: 'line',
        stack: 'total',
        // barWidth: '60%',
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          },
          label: {
            show: true,
            fontSize: 20,
            fontWeight: 'bold',
          },
        },
        label: {
          show: true,
          formatter: (params) => Math.round(params.value * 1000) / 10 + '%'
        },
        data: data[name]
      }
    })
    nextTick(() => {
      console.log(getKeys(data))
      const option = {
        title: {
          text: `最近${length}次青年大学习班级提交率`,
          subtext: 'All Classroom',
          left: 'center'
        },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: getKeys(data, "班"),
          selectedMode: true,
          // orient:'vertical',
          right: 10,
          top: 20,
          bottom: 20
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        toolbox: {
          feature: {
            saveAsImage: {}
          }
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: () => {let list =[];data.forEach((d, index) => list.push(index + 1)); return list}
        },
        yAxis: {
          type: 'value'
        },
        series
      };
      let chart2 = echarts.getInstanceByDom(document.getElementById("chart2"));
      if(!!chart2){
        chart2.dispose();
      }
      chart2 = echarts.init(document.getElementById("chart2"));
      chart2.setOption(option);
    })
  })
}
function dealData(data){
  let list = [];
  for (let dataKey in data) {
    list.push({value: data[dataKey], name: store.student.dormitoryEnum[dataKey]})
  }
  return list;
}
function getKeys(data, str = ''){
  let list = [];
  for (let dataKey in data)
    list.push(dataKey + str)
  return list;
}
function getValues(data){
  let list = [];
  for (let dataKey in data)
    list.push(data[dataKey])
  return list;
}
function getGenderList(data){
  let list = [];
  let man = [];
  let woman = [];
  for (let dataKey in data) {
    man.push(data[dataKey][0]);
    woman.push(data[dataKey][1]);
  }
  list.push(man, woman);
  return list;
}
function getMapList(data){
  let list = [];
  for (let dataKey in data) {
    list.push(data[dataKey][2]);
  }
  return list;
}
function getTotalData(data){
  let total = [];
  for (let i = 0; i < data[0].length; i++) {
    let sum = 0;
    for (let j = 0; j < data.length; j++) {
      sum += data[j][i];
    }
    total.push(sum);
  }
  return total;
}
getCharts();
</script>

<style scoped>
</style>