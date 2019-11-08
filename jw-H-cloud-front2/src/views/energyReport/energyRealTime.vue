<template>
  <el-container>
    <el-aside width="400px" >
      <el-row>
        <el-col style="text-align: center;">
          <el-col :span="8">
            <el-radio v-model="checkedEnergy" :disabled="Bool" label="electric" @change="changeData('electric')">电能</el-radio>
          </el-col>
          <el-col :span="8">
            <el-radio v-model="checkedEnergy" :disabled="Bool" label="water" @change="changeData('water')" >水能</el-radio>
          </el-col>
          <el-col :span="8">
            <el-radio v-model="checkedEnergy" :disabled="true" label="gas" @change="changeData('gas')">天然气</el-radio>
          </el-col>
        </el-col>
      </el-row>
      <el-tree
        v-loading="loading"
        ref="tree"
        :data="tree.treeData"
        :props="tree.defaultProps"
        empty-text="暂无数据"
        show-checkbox
        @check-change="handleCheckChange"
      />
    </el-aside>
    <el-main>
      <el-row>
        <el-col>
          <el-card>
            <el-form>
              <el-row>
                <el-col>
                  <el-form-item
                    v-loading="charts.loading"
                    ref="charts"
                    :model="charts"
                    label-position="right"
                  >
                    <el-row>
                      <el-col :span="4">
                        <el-radio v-model="checkDate" :disabled="Bool" label="hourDate" @change="changeDate('hourDate')" >12小时</el-radio>
                      </el-col>
                      <el-col :span="4">
                        <el-radio v-model="checkDate" :disabled="Bool" label="hourDay" @change="changeDate('hourDay')">24小时</el-radio>
                      </el-col>
                      <el-col :span="4">
                        <el-radio v-model="checkDate" :disabled="Bool" label="hourWeek" @change="changeDate('hourWeek')">7天</el-radio>
                      </el-col>
                      <el-col :offset="2" :span="2">
                        <el-form-item>
                          <el-button
                            v-if="showMonitor"
                            type="primary"
                            @click="Monitor('charts')">
                            开始监控
                          </el-button>
                          <el-button
                            v-if="!showMonitor"
                            type="danger"
                            @click="StopMonitor('charts')">
                            停止监控
                          </el-button>
                        </el-form-item>
                      </el-col>
                      <el-col :offset="1" :span="2">
                        <el-form-item>
                          <el-button icon="el-icon-refresh" @click="refresh">刷新</el-button>
                        </el-form-item>
                      </el-col>
                      <el-col :offset="1" :span="2">
                        <el-form-item >
                          <template>
                            <div>
                              单位:{{ checkedEnergy==='electric'?'kwh':(checkedEnergy==='gas'?'T':'L') }}
                            </div>
                          </template>
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <el-row style="height:700px">
                      <div id="repair" style="height:100%;width:100%"/>
                    </el-row>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </el-card>
        </el-col>
      </el-row>
    </el-main>
  </el-container>
</template>
<script>
import echarts from 'echarts'
// 图表颜色
require('echarts/theme/macarons') // echarts theme
// 图表自适应
import resize from '@/components/Charts/mixins/resize'
import {
  // locAmTreeTime, // 地点电表数据
  // locWmTreeTime, // 地点水表数据
  // locGasTreeTime, // 地点天然气数据
  locTree,
  energyReal // 实时电表数据
  // energyWmReal, // 实时水表数据
  // energyWmWeek // 最近7天实时用水
  // energyAmWeek// 最近7天实时用电
} from '@/api/energy/energy'
export default {
  mixins: [resize],
  data() {
    return {
      loading: false,
      Bool: false,
      charts: {
        isOperating: false,
        loading: false,
        // 开始日期
        statDate: '',
        // 结束日期
        endDate: '',
        // 开始日期至结束日期
        timeEnd: '',
        // 图表按钮
        legendData: [],
        // 图表数据
        seriesData: []
      },
      myChart: null,
      tree: {
        treeData: [],
        defaultProps: {
          children: 'operations',
          label: 'name',
          value: 'eqId',
          disabled: this.disabledFn
        }
      },
      checkedEnergy: 'electric',
      showMonitor: true,
      checkDate: 'hourWeek',
      chartsData: [],
      xAxis: [],
      series: [],
      eqIdArr: [],
      hours: 168,
      temp: [],
      clearId: '',
      eq: 0,
      type: 1

    }
  },
  mounted() {
    // this.energyTimeChart()
    this.getData('electric')
    // this.realTimeData()
  },
  methods: {

    // 地点树
    async treeDatas(type, eq) {
      try {
        this.loading = true
        const data = {
          type: type,
          eq: eq
        }
        const r = await locTree(data)
        // console.log(r)
        this.tree.treeData = r.data
        // console.log(this.tree)
      } catch (e) {
        console.log(e)
      } finally {
        this.loading = false
      }
    },
    // 获取数据
    async getData(params) {
      if (params === 'electric') {
        this.treeDatas(0, this.eq)
      }
      // 水表
      if (params === 'water') {
        this.eq = 1
        this.treeDatas(0, this.eq)
      }
      // 天然气
      if (params === 'gas') {
        this.eq = 2
        this.treeDatas(0, this.eq)
      }
      // console.log(this.charts.statDate)
      // console.log(this.charts.endDate)
    },
    // 实时数据电表
    async realTimeData(hours, eq, type) {
      // eq 0电表 1水表 2天然气

      // type 0按小时 1按天

      // hours 小时数

      // eqIds 设备id

      // 实时数据电表
      try {
        const body = {
          'hours': hours,
          'eqIds': this.eqIdArr,
          eq: eq,
          type: type
        }
        const r = await energyReal(body)
        this.chartsData = r.data
      } catch (e) {
        console.log(e)
      } finally {
        this.loading = false
        console.log()
      }
      this.energyTimeChart(this.chartsData)
    },
    // 实时数据水表
    // 左侧下拉数据点击事件
    handleCheckChange(data, checked, indeterminate) {
      this.temp = this.$refs.tree.getCheckedNodes(true)
      // console.log(temp)
      const temparr = []
      this.temp.map((item) => {
        temparr.push(item.eqId)
      })
      this.eqIdArr = temparr
      // const _this = this
      // if (checked) {
      //   _this.selectedUerList.push(data)
      // }
    },
    handleNodeClick(data) {
      const temps = this.$refs.tree.getCheckedNodes(true)
      console.log(temps)
    },
    // 实时能耗
    energyTimeChart(data) {
      // const that = this
      this.myChart = echarts.init(document.getElementById('repair'), 'macarons')
      // 绘制图表
      const option = {
        color: ['#f44'],
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        dataZoom: [{
          type: 'slider',
          filterMode: 'weakFilter',
          showDataShadow: false,
          top: 600,
          height: 10,
          borderColor: 'transparent',
          backgroundColor: '#e2e2e2',
          handleIcon: 'M10.7,11.9H9.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4h1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7v-1.2h6.6z M13.3,22H6.7v-1.2h6.6z M13.3,19.6H6.7v-1.2h6.6z', // jshint ignore:line
          handleSize: 20,
          handleStyle: {
            shadowBlur: 6,
            shadowOffsetX: 1,
            shadowOffsetY: 2,
            shadowColor: '#aaa'
          },
          labelFormatter: ''
        }, {
          type: 'inside',
          filterMode: 'weakFilter'
        }],
        grid: {
          height: 400
        },
        xAxis: [
          {
            type: 'category',
            data: [],
            // axisTick: {
            //   alignWithLabel: true
            // }
            axisLabel: {// 坐标轴刻度标签的相关设置。
              interval: 0,
              rotate: '45'
            }
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ],
        series: [
          {
            name: '实时耗电',
            type: 'line',
            // barWidth: '60%',
            // data: [995, 666, 444, 858, 654, 236, 645, 546, 846, 225, 547, 356]
            data: []
          }
        ]
      }
      option.xAxis.data = []
      const x = []
      const y = []
      data.map((item) => {
        x.push(item.createDate)
        y.push(item.data)
      })
      // console.log(option.xAxis[0].data)
      option.xAxis[0].data = x.reverse()
      option.series[0].data = y.reverse()
      this.myChart.setOption(option)
    },
    // 刷新
    refresh() {
      if (this.checkedEnergy === 'electric') {
        this.eq = 0
        this.realTimeData(this.hours, this.eq, this.type)
      }
      if (this.checkedEnergy === 'water') {
        this.eq = 1
        this.realTimeData(this.hours, this.eq, this.type)
      }
    },
    // 监控
    Monitor(type) {
      var date = new Date()// 现在时刻
      var dateIntegralPoint = new Date()// 用户登录时刻的下一个整点，也可以设置成某一个固定时刻
      dateIntegralPoint.setHours(date.getHours() + 1)// 小时数增加1
      dateIntegralPoint.setMinutes(0)
      dateIntegralPoint.setSeconds(0)
      // console.log(dateIntegralPoint - date + 60 * 1000)
      // console.log(dateIntegralPoint)
      // return
      if (this.eqIdArr.length) {
        this.showMonitor = !this.showMonitor
        this.Bool = !this.Bool
        if (this.checkedEnergy === 'electric') {
          this.eq = 0
          this.realTimeData(this.hours, this.eq, this.type)
          this.clearId = setInterval(() => {
            this.realTimeData(this.hours, this.eq, this.type)
          }, dateIntegralPoint - date + 60 * 1000)
        }
        if (this.checkedEnergy === 'water') {
          this.eq = 1
          this.realTimeData(this.hours, this.eq, this.type)
          this.clearId = setInterval(() => {
            this.realTimeData(this.hours, this.eq, this.type)
          }, dateIntegralPoint - date + 60 * 1000)
        }
      } else {
        this.$confirm('请先选择设备', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          console.log()
        }).catch(() => {
          // this.$message({
          // })
        })
      }
      // console.log(this.showMonitor)
    },
    // 停止监控
    StopMonitor() {
      this.showMonitor = !this.showMonitor
      this.Bool = !this.Bool
      clearInterval(this.clearId)
      // console.log(this.showMonitor)
    },
    async  changeData(params) {
      this.getData(params)
    },
    changeDate(params) {
      this.hours = (params === 'hourDate' ? 12 : (params === 'hourDay' ? 24 : 168))
      this.type = (params === 'hourDate' ? 0 : (params === 'hourDay' ? 0 : 1))
    }
  }
}
</script>
<style scoped>
.el-container{
    padding:30px;
  }
.el-aside {
  background: rgba(253, 253, 253, 1);
  box-shadow: 0px 0px 2px 0px rgba(0, 0, 0, 0.5);
  border-radius: 4px;
  height: 800px;
  margin-top: 20px;
}
/* .el-tree {
  height: 100%;
} */
</style>

