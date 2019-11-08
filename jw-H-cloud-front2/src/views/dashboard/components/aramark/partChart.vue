<template>
  <el-container>
    <el-main>
      <el-row :gutter="15">
        <el-col :span="12">
          <el-card
            v-loading="part['stockLoading']"
            ref="part"
            :model="part">
            <el-form label-width="110px">
              <el-row :gutter="15">
                <el-col :span="4">
                  <el-form-item label="备件库存图表"/>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="仓库名称:">
                    <el-select
                      v-model="part['wareHouseName']"
                      multiple
                      collapse-tags
                      placeholder="请选择仓库">
                      <el-option
                        v-for="item in part['wareHouseNameData']"
                        :key="item['ptStoreLocId']"
                        :label="item['ptStoreLocName']"
                        :value="item['ptStoreLocId']"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :offset="1" :span="2">
                  <el-form-item label-width="0">
                    <el-button type="primary" @click="display('库存')">显示</el-button>
                  </el-form-item>
                </el-col>
                <el-col :offset="1" :span="2">
                  <el-form-item label-width="10px">
                    <el-button @click="cleanUp('part')">清除</el-button>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row style="height:500px">
                <div id="partStock" style="height:100%;width:100%"/>
              </el-row>
            </el-form>
          </el-card>
        </el-col>
        <el-col :span="12">
          <el-card v-loading="transferPart['transferLoading']">
            <el-form
              ref="transferPart"
              :model="transferPart">
              <el-row :gutter="15">
                <el-col :span="2">
                  <el-form-item label="备件转移图表" label-width="100px"/>
                </el-col>
                <el-col :offset="1" :span="6">
                  <el-form-item
                    label="开始日期"
                    label-width="90px"
                    prop="startDate">
                    <el-date-picker
                      v-model="transferPart['startDate']"
                      :picker-options="partStartDateOptions"
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
                      v-model="transferPart['endDate']"
                      :picker-options="partEndDateOptions"
                      type="date"
                      clearable
                      style="width:140px"
                      value-format="yyyy-MM-dd"
                      placeholder="结束日期"/>
                  </el-form-item>
                </el-col>
                <el-col :offset="2" :span="2">
                  <el-form-item>
                    <el-button type="primary" @click="transferChartData">显示</el-button>
                  </el-form-item>
                </el-col>
                <el-col :offset="1" :span="2">
                  <el-form-item>
                    <el-button @click="cleanUp('transferPart')">清除</el-button>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row style="height:500px">
                <div id="partTransfer" style="height:100%;width:100%"/>
              </el-row>
            </el-form>
          </el-card>
        </el-col>
      </el-row>
    </el-main>
    <!-- <detailDialog
      :close-dialog="closeDialog"
      :show-flag="partDetailDialog"
      :state="part['state']"
      :title-name="part['titleName']"
      :title-id="part['titleId']"
      :ware-house-name="part['wareHouseName']"
      :start-date="part['startDate']"
      :end-date="part['endDate']"/> -->
  </el-container>
</template>

<script>
import {
  allPartWarehouse,
  partInventoryChart,
  partTransRecordChart
} from '@/api/part/chart'

// import { default as detailDialog } from './dialog/details'

import echarts from 'echarts'

// 图表颜色
require('echarts/theme/macarons') // echarts theme

// 图表自适应
import resize from '@/components/Charts/mixins/resize'

export default {
  // components: {
  //   detailDialog
  // },
  filters: {
  },
  mixins: [resize],
  data() {
    return {
      // 备件转移开始日期限制
      partStartDateOptions: {
        disabledDate: (time) => {
          if (!Object.is(this.transferPart['endDate'], '')) {
            return time.getTime() > Date.now() || time.getTime() > new Date(this.transferPart['endDate']).getTime()
          } else {
            return time.getTime() > Date.now()
          }
        }
      },
      // 备件转移结束如期限制
      partEndDateOptions: {
        disabledDate: (time) => {
          return time.getTime() < new Date(this.transferPart['startDate']).getTime() - 8.64e7 || time.getTime() > Date.now()
        }
      },
      // 组件传值
      startDate: '',
      endDate: '',
      partDetailDialog: false,
      // 备件
      part: {
        // 库存等待
        stockLoading: false,
        // 状态
        state: '',
        // 标题名称
        titleName: '',
        // 标题id
        titleId: '',
        // 仓库名称
        wareHouseName: [],
        // 仓库名称下拉框
        wareHouseNameData: [],
        // 备件库存X轴数组
        partInventoryXAxisData: [],
        // 备件库存数据
        partInventorySeriesData: [],
        // 备件总data
        partInventorysetOptionData: []
      },
      transferPart: {
        // 转移等待
        transferLoading: false,
        // 备件转移开始日期
        startDate: '',
        // 备件转移结束日期
        endDate: '',
        // 备件出入库legend数组
        transferLegendData: [],
        // 备件出入库series数组
        transferSeriesData: []
      },
      // 库存图表
      firstChart: null,
      // 转移图表
      secondChart: null
    }
  },
  computed: {},
  created() {},
  async mounted() {
    this.allPartWarehouse()
    this.partInventoryChartData()
    this.transferChartData()
  },
  methods: {
    // 所有仓库名称
    async allPartWarehouse() {
      try {
        const r = await allPartWarehouse()
        this.part['wareHouseNameData'] = r['data']
      } catch (e) {
        console.log(e)
      }
    },
    // 备件库存金额
    async partInventoryChartData() {
      this.part['partInventoryXAxisData'] = []
      this.part['partInventorySeriesData'] = []
      try {
        const data = {
          ptStoreLocIds: this.part['wareHouseName']
        }
        const r = await partInventoryChart(data)
        r['data'].map((item) => {
          this.part['partInventoryXAxisData'].push(item['ptType'])
          this.part['partInventorySeriesData'].push(item['costTotal'])
        })
        this.part['partInventorysetOptionData'] = r['data']
        // console.log(r['data'])
      } catch (e) {
        console.log(e)
      } finally {
        this.stockChart()
      }
    },
    // 转移图表数据
    async transferChartData() {
      try {
        const params = {
          startDate: this.transferPart['startDate'],
          endDate: this.transferPart['endDate']
        }
        const r = await partTransRecordChart(params)
        this.transferPart['transferSeriesData'] = r['data']
        for (const item of this.transferPart['transferSeriesData']) {
          this.transferPart['transferLegendData'].push(item['name'])
        }
        // console.log(r['data'])
      } catch (e) {
        console.log(e)
      } finally {
        this.transferChart()
      }
    },
    // 库存图表
    stockChart() {
      // const that = this
      this.firstChart = echarts.init(document.getElementById('partStock'), 'macarons')
      this.firstChart.setOption({
        toolbox: {
          feature: {
            dataView: { readOnly: true },
            magicType: { type: ['line', 'bar'] },
            restore: {},
            saveAsImage: {
              name: '工单图表',
              title: '下载',
              pixelRatio: 3
            }
          }
        },
        title: {
          text: '爱玛客物业备件报表',
          textStyle: {
            color: '#1B2331',
            fontSize: '18'
          }
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow', // 默认为直线，可选为：'line' | 'shadow'
            textStyle: {
              color: '#fff'
            }
          },
          formatter: '{b} : {c}元'
          // formatter: function(e) {
          //   that.part['state'] = '库存'
          //   that.partDetailDialog = true
          //   that.part['titleName'] = e[0]['name']
          //   that.part['titleId'] = that.part['partInventorysetOptionData'][e[0]['dataIndex']]['categoryId']
          //   // console.log(e[0]['dataIndex'], that.part['titleId'])
          // },
          // triggerOn: 'click'
        },
        grid: {
          left: '5%',
          right: '5%',
          borderWidth: 0,
          top: 150,
          bottom: 95
        },
        legend: {
          top: 80,
          textStyle: {
            color: '#90979c'
          },
          data: ['金额']
        },
        color: [
          new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: '#12D0FF' },
            { offset: 1, color: '#3953DE' }
          ])
        ],
        calculable: true,
        xAxis: [
          {
            type: 'category',
            boundaryGap: true,
            axisLine: {
              lineStyle: {
                color: '#90979c'
              }
            },
            splitLine: {
              show: false
            },
            data: this.part['partInventoryXAxisData']
          }
        ],
        yAxis: [
          {
            type: 'value',
            name: '元',
            splitLine: {
              show: false
            },
            axisLine: {
              lineStyle: {
                color: '#90979c'
              }
            },
            splitArea: {
              show: false
            }
          }
        ],
        dataZoom: [
          {
            show: true,
            height: 20,
            xAxisIndex: [0],
            bottom: 30,
            start: 0,
            end: 100,
            handleIcon:
              'path://M306.1,413c0,2.2-1.8,4-4,4h-59.8c-2.2,0-4-1.8-4-4V200.8c0-2.2,1.8-4,4-4h59.8c2.2,0,4,1.8,4,4V413z',
            handleSize: '110%',
            handleStyle: {
              color: '#d3dee5'
            },
            borderColor: '#90979c'
          },
          {
            type: 'inside',
            show: true,
            height: 15,
            start: 1,
            end: 35
          }
        ],
        series: [
          {
            name: '金额',
            type: 'bar',
            stack: 'total',
            barMaxWidth: 55,
            barGap: '10%',
            itemStyle: {
              normal: {
                label: {
                  show: true,
                  position: 'top',
                  textStyle: {
                    color: '#90979c'
                  }
                }
              }
            },
            data: this.part['partInventorySeriesData']
          }
        ]
      })
    },
    // 转移图表
    transferChart() {
      // const that = this
      this.secondChart = echarts.init(document.getElementById('partTransfer'), 'macarons')
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
        title: {
          text: '备件出入库比例图',
          textStyle: {
            color: '#1B2331',
            fontSize: '18'
          }
        },
        tooltip: {
          trigger: 'item',
          formatter: '{b} : {c} ({d}%)'
          // 南丁格尔图点击事件
          // formatter: function(e) {
          //   that.part['state'] = '转移'
          //   that.partDetailDialog = true
          //   that.part['titleName'] = e.name
          //   that.part['titleId'] = e['data']['id']
          //   // console.log(e['data']['id'])
          // },
          // triggerOn: 'click'
        },
        legend: {
          left: 'center',
          bottom: '10',
          data: this.transferPart['transferLegendData']
        },
        calculable: true,
        series: [
          {
            name: '备件转移图表',
            type: 'pie',
            minAngle: 30, // 最小扇区的角度
            selectedMode: 'single',
            roseType: 'radius',
            radius: ['15%', '70%'], // 数组的第一项是内半径，第二项是外半径。
            center: ['53%', '53%'], // 设置成百分比时第一项是相对于容器宽度，第二项是相对于容器高度。
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
                    return data.name + ': \n' + data.value + '元(' + data.percent.toFixed(0) + '%)'
                  }
                },
                // 标示线长度
                labelLine: {
                  show: true
                  // length: 30 // 最小30
                }
              }
            },
            data: this.transferPart['transferSeriesData']
          }
        ]
      })
    },
    // 显示
    display(type) {
      if (Object.is(type, '库存')) {
        this.partInventoryChartData()
        // console.log(this.part['wareHouseName'])
      }
      if (Object.is(type, '转移')) {
        this.transferChartData()
        // console.log(this.part['startDate'], this.part['endDate'])
      }
    },
    // 清除
    cleanUp(formName) {
      if (Object.is(formName, 'transferPart')) {
        this.$refs[formName].resetFields()
      }
      if (Object.is(formName, 'part')) {
        this.part['wareHouseName'] = []
      }
    }
    // 关闭弹框
    // closeDialog() {
    //   this.partDetailDialog = false
    // }
  }
}
</script>

<style scoped>
/* .el-container{
  padding:30px;
} */
</style>
