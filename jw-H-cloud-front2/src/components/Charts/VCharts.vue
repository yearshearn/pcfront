<template>
  <div>
    <a href="https://v-charts.js.org/#/histogram">https://v-charts.js.org/#/histogram</a>
    <a href="https://juejin.im/post/5d006dec6fb9a07eac05cb74">https://juejin.im/post/5d006dec6fb9a07eac05cb74</a>
    <a href="https://blog.csdn.net/weixin_43164644/article/details/86551554">https://blog.csdn.net/weixin_43164644/article/details/86551554</a>
    <ve-histogram :data="chartData" :extend="extend" :setting="chartSettings"/>
  </div>
</template>

<script>
export default {
  data() {
    this.chartSettings = {
      yAxisType: ['K'],
      yAxisName: ['数量(K)']
    }
    this.extend = {
      series: {
        label: { show: true, position: 'top' },
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            {
              offset: 0,
              color: '#14C9FD' // 0% 处的颜色
            },
            {
              offset: 1,
              color: '#3854DE' // 100% 处的颜色
            }
          ],
          globalCoord: false // 缺省为 false
        }
      }
    }
    return {
      dataZoom: [
        {
          type: 'slider',
          show: true,
          yAxisIndex: [0],
          left: '93%',
          start: 30,
          end: 80
        },
        { type: 'inside', show: true, yAxisIndex: [0], start: 30, end: 90 },
        { start: 0, end: 100, height: 20 }
      ],
      chartData: {
        columns: ['备件类型', '数量'],
        rows: [
          { 备件类型: '1/1', 数量: 1393 },
          { 备件类型: '1/2', 数量: 3530 },
          { 备件类型: '1/3', 数量: 2923 },
          { 备件类型: '1/4', 数量: 1723 },
          { 备件类型: '1/5', 数量: 3792 },
          { 备件类型: '1/6', 数量: 4593 },
          { 备件类型: '1/4', 数量: 1723 },
          { 备件类型: '1/5', 数量: 3792 },
          { 备件类型: '1/6', 数量: 4593 }
        ]
      }
    }
  }
}
</script>
<style>
</style>
