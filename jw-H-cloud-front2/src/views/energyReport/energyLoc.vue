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
                            v-model="charts.statDate"
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
                            v-model="charts.endDate"
                            :picker-options="EndDateOptions"
                            type="date"
                            clearable
                            style="width:140px"
                            value-format="yyyy-MM-dd"
                            placeholder="结束日期"/>
                        </el-form-item>
                      </el-col>
                      <!-- <el-col :offset="1" :span="6">
                        <el-date-picker
                          v-model="charts['statDate']"
                          type="daterange"
                          range-separator="至"
                          start-placeholder="开始日期"
                          end-placeholder="结束日期"/>
                      </el-col> -->
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
  locTree, // 地点电表数据
  // locWmTree, // 地点水表数据
  // locGasTree, // 地点天然气数据
  locEy// 电表水表报表
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
            return time.getTime() > Date.now(this.charts.endDate) - 8.64e7 ||
             time.getTime() > new Date(this.charts.endDate).getTime()
            // return time.getTime() < new Date(this.charts.endDate).getTime() || time.getTime() > Date.now(this.charts.endDate) - 8.64e7
          } else {
            // return time.getTime() > Date.now(this.charts.endDate) - 8.64e7
            return time.getTime() < new Date(this.charts.endDate).getTime() || time.getTime() > Date.now() || time.getTime() > Date.now(this.charts.endDate) - 8.64e7
          }
        }
      },
      // 时间结束测试
      EndDateOptions: {
        disabledDate: (time) => {
          return time.getTime() < new Date(this.charts.statDate).getTime() || time.getTime() > Date.now() || time.getTime() > Date.now(this.charts.statDate) - 8.64e7
          // return time.getTime() < Date.now(this.charts.statDate) || time.getTime() > Date.now()// 如果当天可选，就不用减8.64e7
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
      dataType: 0,
      floors: [],
      temp: [],
      eq: 0
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
      //       type 0到设备 1到楼层
      // eq 0电表 1水表 2天然气
      if (params === 'electric') {
        this.treeDatas(1, this.eq)
      }
      // 水表
      if (params === 'water') {
        this.eq = 1
        this.treeDatas(1, this.eq)
      }
      // 天然气
      if (params === 'gas') {
        this.eq = 2
        this.treeDatas(1, this.eq)
      }
      // console.log(this.charts.statDate)
      // console.log(this.charts.endDate)
    },
    // 左侧下拉数据点击事件
    handleCheckChange(data, checked, indeterminate) {
      // console.log(this.$refs.tree.getCheckedNodes())
      this.temp = this.$refs.tree.getCheckedNodes(true)
      // console.log(this.temp)
    },
    // 地点能耗报表
    energyTimeChart(data) {
      // console.log(data)
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
            type: 'bar',
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
    // 地点能耗数据处理
    async  locEneryData() {
      const temparr = [{
        blId: '',
        floors: []
      }]
      // const flId = []
      // const tempF = []
      this.temp.map((item) => {
        temparr[0].blId = item.blId
        temparr[0].floors.push(item.flId)
      })
      // temparr.floors =flId
      // console.log(temparr)
      this.floors = temparr
      // console.log(this.floors)
      // return
      if (!this.temp.length) {
        this.$confirm('请先选择楼层', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          console.log()
        }).catch(() => {
          // this.$message({
          // })
        })
      } else if (!this.charts.statDate) {
        this.$confirm('请先选择开始时间', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          console.log()
        }).catch(() => {
          // this.$message({
          // })
        })
      } else {
        try {
          this.loading = true
          const body = {
            type: this.dataType,
            beginTime: this.charts.statDate,
            endTime: this.charts.endDate,
            floors: this.floors
          }
          const r = await locEy(body)
          this.energyTimeChart(r.data)
        } catch (e) {
          console.log(e)
        } finally {
          this.loading = false
        }
      }
    },
    // 清除
    clear(formName) {
      // console.log(formName)
      this.charts.statDate = ''
      this.charts.endDate = ''
      this.$refs.tree.setCheckedKeys([])
    },
    // 显示
    display(type) {
      // console.log(this.charts.statDate)
      // console.log(this.charts.endDate)
      // console.log(type)
      this.locEneryData()
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

