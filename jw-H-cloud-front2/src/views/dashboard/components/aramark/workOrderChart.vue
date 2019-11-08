<template>
  <el-container>
    <el-main>
      <el-row :gutter="15">
        <el-col :span="12">
          <el-card>
            <el-form
              v-loading="workOrder['loading']"
              ref="workOrder"
              :model="workOrder"
              label-position="right">
              <el-row :gutter="20">
                <el-col :span="2">
                  <el-form-item label="工单状态" label-width="70px"/>
                </el-col>
                <el-col :offset="1" :span="6">
                  <el-form-item
                    label="开始始日期"
                    label-width="90px"
                    prop="startDate">
                    <el-date-picker
                      v-model="workOrder['startDate']"
                      :picker-options="workOrderStartDateOptions"
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
                      v-model="workOrder['endDate']"
                      :picker-options="workOrderEndDateOptions"
                      type="date"
                      clearable
                      style="width:140px"
                      value-format="yyyy-MM-dd"
                      placeholder="结束日期"/>
                  </el-form-item>
                </el-col>
                <el-col :offset="2" :span="2">
                  <el-form-item>
                    <el-button type="primary" @click="display('workOrder')">显示</el-button>
                  </el-form-item>
                </el-col>
                <el-col :offset="1" :span="2">
                  <el-form-item>
                    <el-button @click="cleanUp('workOrder')">清除</el-button>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row style="height:450px">
                <div id="workOrder" style="height:100%;width:100%;margin-left:0px"/>
              </el-row>
            </el-form>
          </el-card>
        </el-col>
        <el-col :span="12">
          <el-card>
            <el-form
              v-loading="repair['loading']"
              ref="repair"
              :model="repair"
              label-position="right">
              <el-row :gutter="15">
                <el-col :span="2">
                  <el-form-item label="维修类型" label-width="70px"/>
                </el-col>
                <el-col :offset="1" :span="6">
                  <el-form-item
                    label="开始日期"
                    label-width="90px"
                    prop="startDate">
                    <el-date-picker
                      v-model="repair['startDate']"
                      :picker-options="repairStartOptions"
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
                      v-model="repair['endDate']"
                      :picker-options="repairEndDateOptions"
                      type="date"
                      clearable
                      style="width:140px"
                      value-format="yyyy-MM-dd"
                      placeholder="结束日期"/>
                  </el-form-item>
                </el-col>
                <el-col :offset="2" :span="2">
                  <el-form-item>
                    <el-button type="primary" @click="display('repair')">显示</el-button>
                  </el-form-item>
                </el-col>
                <el-col :offset="1" :span="2">
                  <el-form-item>
                    <el-button @click="cleanUp('repair')">清除</el-button>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row style="height:450px">
                <div id="repair" style="height:100%;width:100%"/>
              </el-row>
            </el-form>
          </el-card>
        </el-col>
      </el-row>
    </el-main>
    <!-- <detailDialog
      :close-dialog="closeDialog"
      :show-flag="workerDetailDialog"
      :title-name="titleName"
      :chart-type="chartType"
      :start-date="startDate"
      :end-date="endDate"/> -->
  </el-container>
</template>

<script>
import echarts from 'echarts'

// 图表颜色
require('echarts/theme/macarons') // echarts theme

// 图表自适应
import resize from '@/components/Charts/mixins/resize'

// import { default as detailDialog } from './dialog/details'

import {
  wrStaturChart,
  repairTypeChart
} from '@/api/workorder/chart'

export default {
  // 公共组件
  // components: {
  //   detailDialog
  // },
  mixins: [resize],
  data() {
    return {
      // 工单开始日期限制
      workOrderStartDateOptions: {
        disabledDate: (time) => {
          if (!Object.is(this.workOrder['endDate'], '')) {
            return time.getTime() > Date.now() || time.getTime() > new Date(this.workOrder['endDate']).getTime()
          } else {
            return time.getTime() > Date.now()
          }
        }
      },
      // 工单结束如期限制
      workOrderEndDateOptions: {
        disabledDate: (time) => {
          return time.getTime() < new Date(this.workOrder['startDate']).getTime() - 8.64e7 || time.getTime() > Date.now()
        }
      },
      // 维修类型开始日期限制
      repairStartOptions: {
        disabledDate: (time) => {
          if (!Object.is(this.repair['endDate'], '')) {
            return time.getTime() > Date.now() || time.getTime() > new Date(this.repair['endDate']).getTime() - 8.64e7
          } else {
            return time.getTime() > Date.now()
          }
        }
      },
      // 维修类型结束日期限制
      repairEndDateOptions: {
        disabledDate: (time) => {
          return time.getTime() < new Date(this.repair['startDate']).getTime() - 8.64e7 || time.getTime() > Date.now()
        }
      },
      // 工单图表
      firstChart: null,
      // 维修类型图表
      secondChart: null,
      // 详情弹框
      workerDetailDialog: false,
      // 标题
      titleName: '',
      // 父子组件传值开始日期
      startDate: '',
      // 父子组件传值结束日期
      endDate: '',
      // 父子组件传值图表类型
      chartType: '',
      // 工单
      workOrder: {
        // 图表等待
        loading: false,
        // 开始日期
        startDate: '',
        // 结束日期
        endDate: '',
        // 开始日期至结束日期
        startDateToEndDate: [],
        // 图表按钮
        legendData: [],
        // 图表数据
        seriesData: []
      },
      // 维修
      repair: {
        // 图表等待
        loading: false,
        // 开始日期
        startDate: '',
        // 结束日期
        endDate: '',
        // 开始日期至结束日期
        startDateToEndDate: [],
        // 图表按钮
        legendData: [],
        // 图表数据
        seriesData: []
      }
    }
  },
  async mounted() {
    this.workOrderChartData()
    this.repairTypeChartData()
  },
  methods: {
    // 工单状态图表数据
    async workOrderChartData() {
      try {
        const params = {
          startDate: this.workOrder['startDate'],
          endDate: this.workOrder['endDate']
        }
        const r = await wrStaturChart(params)
        this.workOrder['seriesData'] = r['data']
        r['data'].map((item) => {
          this.workOrder['legendData'].push(item.name)
        })
      } catch (e) {
        console.log(e)
      } finally {
        this.workOrderChart()
      }
    },
    // 维修类型图表数据
    async repairTypeChartData() {
      try {
        const params = {
          startDate: this.repair['startDate'],
          endDate: this.repair['endDate']
        }
        const r = await repairTypeChart(params)
        this.repair['seriesData'] = r['data']
        for (const item of r['data']) {
          this.repair['legendData'].push(item.name)
        }
      } catch (e) {
        console.log(e)
      } finally {
        this.repairTypeChart()
      }
    },
    // 工单图表
    workOrderChart() {
      // const that = this
      this.firstChart = echarts.init(document.getElementById('workOrder'), 'macarons')
      this.firstChart.setOption({
        toolbox: {
          feature: {
            dataView: { readOnly: true },
            // magicType: { type: ['line', 'bar'] },
            // restore: {},
            saveAsImage: {
              name: '工单图表',
              title: '下载',
              pixelRatio: 3
            }
          }
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/> {b} : {c} 单({d}%)'
          // 南丁格尔图点击事件
          // formatter: function(e) {
          //   that.workerDetailDialog = true
          //   that.titleName = e.name
          //   that.startDate = that.workOrder['startDate']
          //   that.endDate = that.workOrder['endDate']
          //   that.chartType = 'workOrderStatus'
          //   // console.log(e, that.chartType)
          // },
          // triggerOn: 'click'
        },
        legend: {
          left: 'center',
          bottom: '10',
          data: this.workOrder['legendData']
        },
        calculable: true,
        series: [
          {
            name: '工单图表',
            type: 'pie',
            minAngle: 30, // 最小扇区的角度
            roseType: 'radius',
            selectedMode: 'single',
            radius: ['15%', '70%'], // 数组的第一项是内半径，第二项是外半径。
            center: ['53%', '45%'], // 设置成百分比时第一项是相对于容器宽度，第二项是相对于容器高度。
            avoidLabelOverlap: false,
            // 在饼图中显示数据
            // label: {
            //   position: 'inner', // 可选参数：外部 “outer” 和内部 “inner”
            //   textStyle: {
            //     align: 'center',
            //     baseline: 'middle',
            //     fontSize: '16',
            //     fontWeight: 'bold'
            //   },
            //   formatter: function(data) {
            //     return data.name + ':\n ' + data.value + '(' + data.percent.toFixed(0) + '%)'
            //   }
            // },
            // lableLine: {
            //   show: false // 标签视觉引导线 不显示
            // },
            label: {
              emphasis: {
                show: true,
                textStyle: {
                  fontSize: '20',
                  fontWeight: 'bold'
                }
              }
            },
            itemStyle: {
              normal: {
                label: {
                  show: true,
                  formatter: function(data) {
                    return data.name + ': \n' + data.value + '单(' + data.percent.toFixed(0) + '%)'
                  }
                },
                // 标示线长度
                labelLine: {
                  show: true
                  // length: 30 // 最小30
                }
              }
            },
            data: this.workOrder['seriesData']
          }
        ]
      })
    },
    // 维修类型图表
    repairTypeChart() {
      // const that = this
      this.secondChart = echarts.init(document.getElementById('repair'), 'macarons')
      this.secondChart.setOption({
        toolbox: {
          feature: {
            dataView: { readOnly: true },
            // magicType: { type: ['line', 'bar'] },
            // restore: {},
            saveAsImage: {
              name: '工单图表',
              title: '下载',
              pixelRatio: 3
            }
          }
        },
        tooltip: {
          trigger: 'item',
          formatter: '{b} : {c} 单 ({d}%)'
          // 南丁格尔图点击事件
          // formatter: function(e) {
          //   that.workerDetailDialog = true
          //   that.titleName = e.name
          //   that.startDate = that.repair['startDate']
          //   that.endDate = that.repair['endDate']
          //   that.chartType = 'repairType'
          //   // console.log(e.name)
          // },
          // triggerOn: 'click'
        },
        legend: {
          left: 'center',
          bottom: '10',
          data: this.repair['legendData']
        },
        calculable: true,
        series: [
          {
            name: '维修类型图表',
            type: 'pie',
            minAngle: 30, // 最小扇区的角度
            roseType: 'radius',
            selectedMode: 'single',
            radius: ['15%', '70%'], // 数组的第一项是内半径，第二项是外半径。
            center: ['53%', '48%'], // 设置成百分比时第一项是相对于容器宽度，第二项是相对于容器高度。
            avoidLabelOverlap: false,
            label: {
              emphasis: {
                show: true,
                textStyle: {
                  fontSize: '20',
                  fontWeight: 'bold'
                }
              }
            },
            itemStyle: {
              normal: {
                label: {
                  show: true,
                  formatter: function(data) {
                    return data.name + ': \n' + data.value + '单(' + data.percent.toFixed(0) + '%)'
                  }
                },
                // 标示线长度
                labelLine: {
                  show: true
                  // length: 30 // 最小30
                }
              }
            },
            data: this.repair['seriesData']
          }
        ]
      })
    },
    // 显示
    display(type) {
      if (Object.is(type, 'workOrder')) {
        this.workOrderChartData()
      }
      if (Object.is(type, 'repair')) {
        this.repairTypeChartData()
      }
    },
    // 清除
    cleanUp(formName) {
      this.$refs[formName].resetFields()
      // console.log(formName)
    }
    // 关闭弹框
    // closeDialog() {
    //   this.workerDetailDialog = false
    // }
  }
}
</script>

<style scoped>
/* .el-container{
  padding:30px;
} */
</style>
