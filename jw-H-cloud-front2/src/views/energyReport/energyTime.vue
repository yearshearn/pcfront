<template>
  <el-container>
    <el-aside width="400px" >
      <el-row>
        <el-col style="text-align: center;">
          <el-col :span="8">
            <el-radio v-model="checkedEnergy" label="electric" @change="changeData('electric',0)">电能</el-radio>
          </el-col>
          <el-col :span="8">
            <el-radio v-model="checkedEnergy" label="water" @change="changeData('water',1)" >水能</el-radio>
          </el-col>
          <el-col :span="8">
            <el-radio v-model="checkedEnergy" :disabled="true" label="gas" @change="changeData('gas',2)">天然气</el-radio>
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
        node-key="name"
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
                      <el-col :offset="1" :span="6">
                        <el-form-item
                          label="开始日期"
                          label-width="90px"
                          prop="startDate">
                          <el-date-picker
                            v-model="charts['statDate']"
                            :picker-options="startDateOptions"
                            type="date"
                            clearable
                            style="width:140px"
                            value-format="yyyy-MM-dd"
                            placeholder="开始日期"/>
                        </el-form-item>
                      </el-col>
                      <el-col :offset="1" :span="6">
                        <el-form-item
                          label="结束日期"
                          label-width="90px"
                          prop="endDate">
                          <el-date-picker
                            v-model="charts['endDate']"
                            :picker-options="EndDateOptions"
                            type="date"
                            clearable
                            style="width:140px"
                            value-format="yyyy-MM-dd"
                            placeholder="结束日期"/>
                        </el-form-item>
                      </el-col>
                      <el-col :offset="2" :span="2">
                        <el-form-item>
                          <el-button type="primary" @click="display('charts')">显示</el-button>
                        </el-form-item>
                      </el-col>
                      <el-col :offset="1" :span="2">
                        <el-form-item>
                          <el-button @click="clear('charts')">清除</el-button>
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
  locTree,
  energyEq// 设备报表

} from '@/api/energy/energy'
export default {
  mixins: [resize],
  data() {
    return {
      // 时间开始测试
      startDateOptions: {
        // console.log(time)
        disabledDate: (time) => {
          if (this.charts.endDate) {
            // return time.getTime() > Date.now(this.charts.endDate) - 8.64e7 // 如果当天可选，就不用减8.64e7
            return time.getTime() > Date.now(this.charts.endDate) - 8.64e7 || time.getTime() > new Date(this.charts.endDate).getTime()
          } else {
            return time.getTime() < new Date(this.charts.endDate).getTime() || time.getTime() > Date.now() || time.getTime() > Date.now(this.charts.endDate) - 8.64e7
          }
        }
      },
      // 时间结束测试
      EndDateOptions: {
        disabledDate: (time) => {
          // return time.getTime() < Date.now(this.charts.statDate) || time.getTime() > Date.now()// 如果当天可选，就不用减8.64e7
          return time.getTime() < new Date(this.charts.statDate).getTime() || time.getTime() > Date.now() || time.getTime() > Date.now(this.charts.statDate) - 8.64e7
        }
      },
      loading: false,
      charts: {
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
      // 模拟数据
      data: [{
        id: 1,
        label: '一级 1',
        children: [{
          id: 4,
          label: '二级 1-1',
          children: [{
            id: 9,
            label: '三级 1-1-1'
          }, {
            id: 10,
            label: '三级 1-1-2'
          }]
        }]
      }, {
        id: 2,
        label: '一级 2',
        children: [{
          id: 5,
          label: '二级 2-1'
        }, {
          id: 6,
          label: '二级 2-2'
        }]
      }, {
        id: 3,
        label: '一级 3',
        children: [{
          id: 7,
          label: '二级 3-1'
        }, {
          id: 8,
          label: '二级 3-2'
        }]
      }],
      // 模拟数据
      // defaultProps: {
      //   children: 'operations',
      //   label: 'name'
      // },
      myChart: null,
      tree: {
        treeData: [],
        defaultProps: {
          children: 'operations',
          label: 'name',
          value: 'eqId'
        }
      },
      checkedEnergy: 'electric',
      temp: [],
      eq: 0,
      eqIds: [],
      dataType: 0
    }
  },
  mounted() {
    // this.energyTimeChart()
    this.getData('electric')
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
      // 电表
      if (params === 'electric') {
        this.eq = 0
        this.treeDatas(0, this.eq)
        // console.log(params)
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
    // 左侧下拉数据点击事件
    handleCheckChange(data, checked, indeterminate) {
      this.temp = this.$refs.tree.getCheckedNodes(true)
    },
    // 时间能耗
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
            name: '',
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
        // option.xAxis[0].data.push(item.createDate)
        // option.series[0].data.push(item.wapp)
      })
      // console.log(option.xAxis[0].data)
      option.xAxis[0].data = x.reverse()
      option.series[0].data = y.reverse()
      this.myChart.setOption(option)
    },
    // 清除
    clear(formName) {
      // console.log(formName)
      console.log(this.charts.statDate)
      console.log(this.charts.endDate)
    },
    // 显示
    display(type) {
      this.EqEnergy()
      // console.log(type)
    },
    // 设备能耗数据处理
    async EqEnergy() {
      const temparr = [{
        blId: '',
        eqIds: []
      }]
      // const flId = []
      // const tempF = []
      this.temp.map((item) => {
        temparr[0].blId = item.blId
        temparr[0].eqIds.push(item.eqId)
      })
      this.eqIds = temparr

      try {
        // eq 0电表1水表2天然气
        const body = {
          eq: this.dataType,
          beginTime: this.charts.statDate,
          endTime: this.charts.endDate,
          eqIds: this.eqIds
        }
        const r = await energyEq(body)
        console.log(r)
        this.energyTimeChart(r.data)
      } catch (e) {
        console.log(e)
      } finally {
        console.log()
      }
    },
    changeData(data, type) {
      this.dataType = type
      this.getData(data)
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

