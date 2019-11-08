<template>
  <el-container>
    <el-header style="height: 175px;">
      <el-row :gutter="30">
        <el-col :span="3">
          <el-card class="electricMeter" @click.native="EqIDElastic(0)">
            <div style="margin-top: 15px">{{ amErr }}</div>
            <div class="text">个问题电表</div>
          </el-card>
        </el-col >
        <el-col :span="3">
          <el-card class="WaterMeter" @click.native="EqIDElastic(1)">
            <div style="margin-top: 15px">{{ wmErr }}</div>
            <div class="text">问题水表</div>
          </el-card>
        </el-col>
        <el-col :span="3">
          <el-card class="coal">
            <div style="margin-top: 15px">123</div>
            <div class="text">吨标煤总能耗</div>
          </el-card>
        </el-col>
        <el-col :span="3">
          <el-card class="electricEnergy">
            <div style="margin-top: 15px">{{ allAm }}</div>
            <div class="text">kwh/总电耗</div>
          </el-card>
        </el-col>
        <el-col :span="3">
          <el-card class="waterEnergy">
            <div style="margin-top: 15px">{{ allWm }}</div>
            <div class="text">T/总水耗</div>
          </el-card>
        </el-col>
        <el-col :span="3">
          <el-card class="Scfm">
            <div style="margin-top: 15px">立方</div>
            <div class="text">总气耗</div>
          </el-card>
        </el-col>
        <el-col :span="3">
          <el-card class="area">
            <div style="margin-top: 15px">{{ area }}</div>
            <div class="text">平方米建筑面积</div>
          </el-card>
        </el-col>
        <el-col :span="3">
          <el-card class="people">
            <div style="margin-top: 15px">{{ person }}</div>
            <div class="text">个人用电人数</div>
          </el-card>
        </el-col>
      </el-row>
      <el-row>
        <el-card style="background:rgba(234,244,255,1);box-shadow:0px 2px 15px 0px rgba(178,197,255,1);">
          <el-row :gutter="8" style="margin-bottom: 0px;">
            <el-col :span="8" style="border-right: 1px solid #1890FF;border-radius: 0px;text-align: center;">
              <div style="text-align: center;">
                <el-col :span="4">
                  <el-radio v-model="checkedDate" label="checkedDay" @change="changeData(0)">当日</el-radio>
                </el-col>
                <el-col :span="4">
                  <el-radio v-model="checkedDate" label="checkedMonth" @change="changeData(1)">当月</el-radio>
                </el-col>
                <el-col :span="12" style="height: 20px;">
                  <el-select v-model="year" placeholder="请选择年份">
                    <el-option
                      v-for="item in options"
                      :key="item.value"
                      :label="item.label"
                      :value="item.label"
                      @change="changeData()"
                    />
                  </el-select>
                </el-col>
              </div>
            </el-col>
            <el-col :span="8" style="border-right: 1px solid #1890FF;border-radius: 0px;text-align: center;">
              <div style="text-align: center;">
                <el-col :span="6">
                  <el-radio v-model="checkedEnergy" label="electric" @change="changeEnergy('当前能耗')">电能</el-radio>
                </el-col>
                <el-col :span="6">
                  <el-radio v-model="checkedEnergy" label="water" @change="changeEnergy('当前能耗')">水能</el-radio>
                </el-col>
                <el-col :span="6">
                  <el-radio v-model="checkedEnergy" label="gas" @change="changeEnergy('当前能耗')" >天然气</el-radio>
                </el-col>
              </div>
            </el-col>
            <el-col :span="8">
              <div style="text-align: center;">
                <el-col :span="8">
                  <el-radio v-model="checkeddata" label="amount" @change="changeEnergy('消耗量')">消耗量  (KWH)</el-radio>
                </el-col>
                <el-col :span="8">
                  <el-radio v-model="checkeddata" label="cost" @change="changeEnergy('当前成本')">成本 (￥)</el-radio>
                </el-col>
                <el-col :span="8" >
                  <div
                    style="position: relative;top: -11px;">
                    <el-button type="primary" @click="Refresh">刷新</el-button>
                  </div>
                </el-col>
              </div>
            </el-col>
          </el-row>
        </el-card>
      </el-row>
    </el-header>
    <el-main style="padding-top:0;">
      <el-row >
        <el-col :span="24">
          <el-card style="padding-top:0;box-shadow:0px 0px 15px 0px rgba(178,197,255,1);">
            <el-table
              v-loading="loading"
              ref="table"
              :data="list"
              :row-style="tableStripeCallBack"
              :max-height="h"
              :summary-method="getSummaries"
              show-summary
              style="width:100%;transition:all,1s;"
            >
              <el-table-column
                align="center"
                label="序号"
                type="index"
                width="80"/>
              <el-table-column
                align="center"
                label="大厦"
                type=""
                prop="name"
                min-width="50%"/>
              <el-table-column
                align="center"
                type=""
                prop="currentData"
                min-width="50%">
                <template slot="header" slot-scope="currentData">
                  <div v-if="currentData">
                    {{ title }}({{ Company }})
                  </div>
                </template>
              </el-table-column>
              <el-table-column
                align="center"
                label="环比(%)"
                type=""
                prop="yoy"
                min-width="50%">
                <template slot-scope="{row}">
                  <div>
                    {{ row.yoy===null?'--':row.yoy }}
                    <i
                      :class="row.yoy>0?'el-icon-top':(row.yoy===null? '':'el-icon-bottom')"
                      :style="row.yoy>0?'color:#18AB8C;':(row.yoy===null? '':'color:#FF8B8B;')"
                      style="margin-left:5px;"/>
                  </div>
                </template>
              </el-table-column>
              <el-table-column
                align="center"
                label="同比(%)"
                type=""
                prop="chainRatio"
                min-width="50%">
                <template slot-scope="{row}">
                  <div>
                    {{ row.chainRatio===null?'--':row.chainRatio }}
                    <i
                      :class="row.chainRatio>0?'el-icon-top':(row.chainRatio===null?'':'el-icon-bottom')"
                      :style="row.chainRatio>0?'color:#18AB8C;':(row.chainRatio===null?'':'color:#FF8B8B;')"
                      style="margin-left:5px;"/>
                  </div>
                </template>
              </el-table-column>
              <el-table-column
                align="center"
                label="按面积"
                type=""
                prop="byArea"
                min-width="50%"/>
              <el-table-column
                align="center"
                label="按人均"
                type=""
                prop="byPerson"
                min-width="50%"/>
              <el-table-column
                align="right">
                <template slot-scope="scope">
                  <el-button
                    size="mini"
                    @click="handleEdit(scope.$index, scope.row)">查看详情</el-button>
                </template>
              </el-table-column>
            </el-table>
            <div style="text-align:right;margin-top:5px;">
              <el-button type="primary" @click="btnChange">
                <i :class="show3===true?'el-icon-arrow-down':'el-icon-arrow-up'" />
                {{ show3===true?'展开数据':'收起数据' }}
              </el-button>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </el-main>
    <el-footer style="height: 100%;">
      <el-row :gutter="26">
        <el-col :span="8">
          <el-card class="footcard" >
            <el-row>
              <el-col>
                用电能耗 Top 5 (单位：{{ checkeddata==='cost'?'￥':'kwh' }})
              </el-col>
            </el-row>
            <el-table
              v-loading="loading"
              :show-header="false"
              :data="optionsAm"
              :max-height="300"
              style="width:100%;"
            >
              <el-table-column
                align="center"
                label="序号"
                type="index"
                width="80"/>
              <el-table-column
                align="center"
                label="进度图"
                type=""
                min-width="50%">
                <template slot-scope="{row}">
                  <el-progress :show-text="false" :percentage="row.progress" />
                </template>
              </el-table-column>
              <el-table-column
                align="center"
                label="数据"
                type="dataAll"
                prop="dataAll"
                min-width="50%">
                <!-- <template slot-scope="row">
                  <div>{{ row.dataAll }}</div>
                </template> -->
              </el-table-column>
              <el-table-column
                align="center"
                label="地点"
                type="loc"
                prop="loc"
                min-width="50%"/>
            </el-table>
          </el-card>
        </el-col>
        <el-col :span="8">
          <el-card class="footcard">
            <el-row>
              <el-col>
                天然气能耗 Top  5 (单位：T)
              </el-col>
            </el-row>
            <el-table
              v-loading="loading"
              :show-header="false"
              :data="meterData"
              :max-height="300"
              style="width:100%;"
            >
              <el-table-column
                align="center"
                label="序号"
                type="index"
                width="80"/>
              <el-table-column
                align="center"
                label="进度图"
                type=""
                min-width="50%">
                <template slot-scope="{row}">
                  <el-progress :show-text="false" :percentage="row.progress" />
                </template>
              </el-table-column>
              <el-table-column
                align="center"
                label="数据"
                type="dataAll"
                prop="dataAll"
                min-width="50%"/>
              <el-table-column
                align="center"
                label="地点"
                type="loc"
                prop="loc"
                min-width="50%"/>
            </el-table>
          </el-card>
        </el-col>
        <el-col :span="8">
          <el-card class="footcard">
            <el-row>
              <el-col>
                用水能耗 Top 5 (单位：{{ checkeddata==='cost'?'￥':'L' }})
              </el-col>
            </el-row>
            <el-table
              v-loading="loading"
              :show-header="false"
              :data="optionsWm"
              :max-height="300"
              style="width:100%;"
            >
              <el-table-column
                align="center"
                label="序号"
                type="index"
                width="80"/>
              <el-table-column
                align="center"
                label="进度图"
                type=""
                min-width="50%">
                <template slot-scope="{row}">
                  <el-progress :show-text="false" :percentage="row.progress" />
                </template>
              </el-table-column>
              <el-table-column
                align="center"
                label="数据"
                type="dataAll"
                prop="dataAll"
                min-width="50%"/>
              <el-table-column
                align="center"
                label="地点"
                type="loc"
                prop="loc"
                min-width="50%"/>
            </el-table>
          </el-card>
        </el-col>
      </el-row>
    </el-footer>
    <!-- 查看详情弹框 -->
    <el-dialog
      :visible="DetailDialog"
      :before-close="closeDialog"
      :floor-data="floorData"
      :type-date="typeDate"
      :checked-energy="checkedEnergy"
      :checked-date="checkedDate"
      center>
      <el-table
        v-loading="loading"
        ref="table"
        :data="listfloor"
        :row-style="tableStripeCallBack"
        :max-height="hight"
        style="width:100%;transition:all,1s;">
        <el-table-column
          align="center"
          label="序号"
          type="index"
          width="80"/>
        <el-table-column
          align="center"
          label="楼层"
          type=""
          prop="name"
          min-width="50%"/>
        <el-table-column
          align="center"
          type=""
          prop="currentData"
          min-width="50%">
          <template slot="header" slot-scope="currentData">
            <div v-if="currentData">
              {{ title }}({{ Company }})
            </div>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="环比(%)"
          type=""
          prop="yoy"
          min-width="50%">
          <template slot-scope="{row}">
            <div>
              {{ row.yoy===null?'--':row.yoy }}
              <i
                :class="row.yoy>0?'el-icon-top':(row.yoy===null? '':'el-icon-bottom')"
                :style="row.yoy>0?'color:#18AB8C;':(row.yoy===null? '':'color:#FF8B8B;')"
                style="margin-left:5px;"/>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="同比(%)"
          type=""
          prop="chainRatio"
          min-width="50%">
          <template slot-scope="{row}">
            <div>
              {{ row.chainRatio===null?'--':row.chainRatio }}
              <i
                :class="row.chainRatio>0?'el-icon-top':(row.chainRatio===null?'':'el-icon-bottom')"
                :style="row.chainRatio>0?'color:#18AB8C;':(row.chainRatio===null?'':'color:#FF8B8B;')"
                style="margin-left:5px;"/>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="按面积"
          type=""
          prop="byArea"
          min-width="50%"/>
        <el-table-column
          align="center"
          label="按人均"
          type=""
          prop="byPerson"
          min-width="50%"/>
      </el-table>
    </el-dialog>
    <!-- 问题电表弹框 -->
    <el-dialog
      :visible="EqIDDialog"
      :before-close="closeDialog"
      :floor-data="floorData"
      :type-date="typeDate"
      :checked-energy="checkedEnergy"
      :checked-date="checkedDate"
      center
    >
      <el-table
        v-loading="loading"
        ref="refTable"
        :data="eqTableData"
        :max-height="hight"
        :row-key="getRowKeys"
        :expand-row-keys="expands"
        @expand-change="exChange"
      >
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-table
              ref="tableChild"
              :data="dataList"
              align="center"
            >
              <el-table-column
                align="center"
                label="时间"
                prop="recordDate"
              />
              <el-table-column
                label="参数"
                prop="param"
                min-width="50%"/>
              <el-table-column
                label="异常原因"
                prop="reason"
                min-width="50%"/>
              <el-table-column
                align="center"
                label="预计读数"
                prop="predictData"
                min-width="50%"/>
              <el-table-column
                align="center"
                label="实际读数"
                prop="actualData"
                min-width="50%"
              />
              <el-table-column
                align="center"
                label="操作"
              >
                <template slot-scope="scope">
                  <el-button
                    size="mini"
                    @click="handleIgnore(scope.$index, scope.row)">忽略</el-button>
                  <el-button
                    size="mini"
                    type="danger"
                    @click="handleCorrect(scope.$index, scope.row)">修正</el-button>
                </template>
              </el-table-column>
            </el-table>
          </template>
        </el-table-column>
        <el-table-column
          label="设备ID"
          prop="eqId"/>
        <el-table-column
          label="所在大厦"
          prop="blName"/>
        <el-table-column
          label="所在楼层"
          prop="flName"/>

      </el-table>

    </el-dialog>
</el-container></template>

<script>
import { tableStripeCallBack } from '@/utils/style'
// import { default as detailDialog } from './details/details'
import {
  energyAreaPerson, // 卡片建筑面积和用电人数
  energyListData, // 列表数据
  energyErr, // 问题电表
  energySum, // 卡片总电耗
  topData, // 条形电
  locFloorData, // 楼层能耗
  eqCardList// 卡片弹框水表电表设备
} from '@/api/energy/energy'
// import Vue from 'vue'
export default {
  // 公共组件
  // components: {
  //   detailDialog
  // },
  data() {
    return {
      expands: [],
      getRowKeys: (row) => {
        // console.log(row)
        return row.eqId
      },
      // 详情弹框
      DetailDialog: false,
      EqIDDialog: false,
      floorData: '',
      typeDate: '',
      loading: false,
      checkedDate: 'checkedDay',
      checkedEnergy: 'electric',
      checkedUse: 'cost',
      shows: false,
      allAm: '',
      allWm: '',
      optionsWm: [],
      optionsAm: [],
      options: [],
      year: '',
      line: '',
      list: [],
      show3: true,
      h: 300,
      meterData: [],
      area: '',
      person: '',
      statusdate: 0,
      amErr: '',
      wmErr: '',
      showFlag: false,
      listfloor: [],
      tDate: '',
      hight: 600,
      eq: 0,
      use: 0,
      title: '当前能耗',
      checkeddata: 'amount',
      Company: 'kwh',
      eqTableData: [],
      dataList: []
    }
  },
  async mounted() {
    this.getData()
  },
  methods: {
    // 表格隔行颜色
    tableStripeCallBack,
    // 数据
    // 卡片水能，电能
    async SumData(eq) {
      // eq 0电表 1水表 2天然气
      // 卡片总电耗
      try {
        const params = {
          eq: eq
        }
        const r = await energySum(params)
        if (eq === 0) {
          this.allAm = r.data
        } else if (eq === 1) {
          this.allWm = r.data
        }
      } catch (e) {
        console.log(e)
      } finally {
        this.loading = false
      }
    },

    // 卡片问题水表。电表
    async errEnery(eq) {
      // eq 0电表 1水表 2天然气
      try {
        const params = {
          eq: eq
        }
        const r = await energyErr(params)
        if (eq === 0) {
          this.amErr = r.data
        } else if (eq === 1) {
          this.wmErr = r.data
        }
      } catch (e) {
        console.log(e)
      } finally {
        console.log()
      }
    },
    async getData() {
      // 卡片建筑面积，用电人数数据
      try {
        this.loading = true
        const r = await energyAreaPerson()
        this.area = r.data.area
        this.person = r.data.person
      } catch (e) {
        console.log(e)
      } finally {
        this.loading = false
      }
      // 电表列表数据
      if (this.checkedEnergy === 'electric') {
        // 电表列表
        this.eq = 0
        this.EyData(this.statusdate, this.eq, this.use)
      }
      // 水表列表数据
      if (this.checkedEnergy === 'water') {
        // 水表列表
        this.eq = 1
        this.EyData(this.statusdate, this.eq, this.use)
      }
      if (this.checkeddata === 'amount') {
        this.use = 0
        this.EyData(this.statusdate, this.eq, this.use)
      }
      if (this.checkedEnergy === 'cost') {
        this.use = 1
        this.EyData(this.statusdate, this.eq, this.use)
      }
      // 卡片水能。电能
      this.SumData(0)
      this.SumData(1)

      // 卡片问题电表，水表
      this.errEnery(0)
      this.errEnery(1)

      // 条形
      this.topDatas(this.statusdate, 0)
      this.topDatas(this.statusdate, 1)
    },
    // 表格列表
    async EyData() {
      //       type 0当日 1当月
      // eq 0电表 1水表 2天然气
      try {
        this.loading = true
        const params = { type: this.statusdate,
          eq: this.eq,
          use: this.use
        }
        const r = await energyListData(params)
        this.list = r.data
      } catch (e) {
        console.log(e)
      } finally {
        this.loading = false
      }
    },

    // 列表下拉
    btnChange() {
      this.show3 = !this.show3
      if (!this.show3) {
        this.h = 600
        this.$refs.table.bodyWrapper.scrollTop = 0
      } else {
        this.h = 300
        this.$refs.table.bodyWrapper.scrollTop = 0
      }
    },
    // 总计
    getSummaries(param) {
      const { columns, data } = param
      // console.log(data)
      const sums = []
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '汇总'
          return
        }
        if (index === 3) {
          sums[index] = '——'
          return
        }
        if (index === 4) {
          sums[index] = '——'
          return
        }
        const values = data.map(item => Number(item[column.property]))
        // console.log(values)
        if (!values.every(value => isNaN(value))) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr)
            if (!isNaN(value)) {
              return prev + curr
            } else {
              return prev
            }
          }, 0)
          // sums[index] += ' 元'
        } else {
          sums[index] = '——'
          // console.log(sums[index])
        }
      })
      // console.log(sums)
      return sums
    },
    // 年月日
    async changeData(status) {
      // 列表数据
      this.statusdate = status
      // 电表
      if (this.checkedEnergy === 'electric') {
        this.eq = 0
        this.EyData(this.statusdate, this.eq)
      }
      // 水表
      if (this.checkedEnergy === 'water') {
        this.eq = 1
        this.EyData(this.statusdate, this.eq)
      }
      this.topDatas(this.statusdate, 0)
      this.topDatas(this.statusdate, 1)
    },
    // 条形电
    async topDatas(type, eq) {
      //       type 0当日 1当月

      // eq 0电表 1水表 2天然气
      // 条形电
      try {
        const param = {
          type: type,
          eq: eq,
          use: this.use
        }
        const r = await topData(param)
        if (eq === 0) {
          this.optionsAm = r.data
        } else if (eq === 1) {
          this.optionsWm = r.data
        }
      } catch (e) {
        console.log(e)
      } finally {
        this.loading = false
      }
    },
    // 条形水
    // 能耗选取
    changeEnergy(title) {
      // {{ ((checkedEnergy==='electric')&&checkeddata==='amount')?'(kwh)'
      //               :((checkedEnergy==='water'&&checkeddata==='amount')?'(L)'
      //               :((checkedEnergy==='gas'&&checkeddata==='amount')?'(T)'
      //               :(checkeddata==='cost'?'(￥)':"(kwh)"))) }}
      if (this.checkeddata === 'cost') {
        this.Company = '￥'
      } else if (this.checkedEnergy === 'electric') {
        this.Company = 'kwh'
      } else if (this.checkedEnergy === 'water') {
        this.Company = 'L'
      } else if (this.checkedEnergy === 'gas') {
        this.Company = 'T'
      }

      this.title = title
      if (this.checkeddata === 'cost') {
        this.use = 1
      } else {
        this.use = 0
      }
      // console.log(this.checkedDate)
      this.getData()
    },
    // 刷新
    Refresh() {
      this.changeData(this.statusdate)
    },
    // 关闭弹框
    closeDialog() {
      this.DetailDialog = false
      this.EqIDDialog = false
    },
    // 查看详情
    handleEdit(index, row) {
      this.DetailDialog = true
      // console.log(row)
      this.floorData = row.locId
      if (this.checkedDate === 'checkedDay') {
        this.typeDate = '0'
      } else {
        this.typeDate = '1'
      }
      if (this.checkedEnergy === 'electric') {
        this.eq = 0
        this.getEle(this.floorData, this.typeDate, this.eq)
      }
      if (this.checkedEnergy === 'water') {
        this.eq = 1
        this.getEle(this.floorData, this.typeDate, this.eq)
      }
    },
    // 楼层能耗
    async getEle(F, T, eq) {
      //       locId 大厦id
      // type 0当日 1当月
      // eq 0电表 1水表 2天然气
      try {
        this.loading = true
        const parmas = {
          type: T,
          locId: F,
          eq: eq,
          use: this.use
        }
        // const parmas = {
        //   type: 0,
        //   locId: '748PRO'
        // }
        const r = await locFloorData(parmas)
        // console.log(r.data.sort(this.compare('name')))
        this.listfloor = r.data
        // console.log(r)
      } catch (e) {
        console.log(e)
      } finally {
        this.loading = false
      }
    },
    // 忽略
    handleIgnore(index, row) {
      console.log(index, row)
    },
    // 修正
    handleCorrect(index, row) {
      console.log(index, row)
    },

    // 问题卡片弹框
    async EqIDElastic(type) {
      // console.log(123)
      this.EqIDDialog = true
      try {
        this.loading = true
        const body = {
          eq: type
        }
        const r = await eqCardList(body)
        this.eqTableData = r.data
      } catch (e) {
        console.log(e)
      } finally {
        this.loading = false
      }
    },
    // 表格接口
    async tablaData(eqId) {
      try {
        const body = {
          eqId: eqId
        }
        const r = await eqCardList(body)
        this.dataList = r.data
        // this.$set(this.dataList, this.dataList)
        // this.$forceUpdate()
        // Vue.set(this.dataList, 0, this.dataList)
      } catch (e) {
        console.log(e)
      } finally {
        // console.log(456)
        this.loading = false
      }
    },
    // 表格当前行被展开或收起
    exChange(row, rowList) {
      // console.log(row)
      // return
      this.loading = true

      var that = this
      if (rowList.length) { // 只展开一行//说明展开了
        // console.log('if')
        that.expands = []

        if (row) {
          // console.log(2)
          that.expands.push(row.eqId)// 只展开当前行id
        }
        this.tablaData(row.eqId)
      } else { // 说明收起了
        // console.log('else')
        that.expands = []
      }

      // if (rowList.length >= 1) {
      //   console.log(3)
      //   this.eqTableData.map(ele => {
      //     if (ele.eqId !== row.eqId) {
      //       this.$refs.refTable.toggleRowExpansion(ele, false)
      //     }
      //   })
      // }
    }

    // 测试跳转
    // Parameter() {
    //   this.$router.push({ name: 'eyParameter' })
    // }

  }
}
</script>
<style scoped>
.el-row {
  margin-bottom: 20px;
}
.el-select{
  top:-11px;
}
.el-col {
  border-radius: 4px;
}
.el-container{
  padding:30px;
  }
.el-dialog__header{
    height: 45px;
}
  /*背景图片*/
  .electricMeter{
  background-size:100% 100%;
  background-repeat: no-repeat;
  background-image: url('../../assets/images/wentidianbiao.png') ;
  height: 100px;
  }
  .WaterMeter{
  background-size:100% 100%;
  background-repeat: no-repeat;
  background-image: url('../../assets/images/wentishuibiao.png') ;
  height: 100px;
  }
  .coal{
  background-size:100% 100%;
  background-repeat: no-repeat;
  background-image: url('../../assets/images/dunbiaomei.png');
  height: 100px;
  }
.electricEnergy{
  background-size:100% 100%;;
  background-repeat: no-repeat;
  background-image: url('../../assets/images/zongdianhao.png') ;
  height: 100px;
  }
.waterEnergy{
  background-size:100% 100%;
  background-repeat: no-repeat;
  background-image: url('../../assets/images/zongshuihao.png');
  height: 100px;
}
.Scfm{
  background-size:100% 100%;
  background-repeat: no-repeat;
  background-image: url('../../assets/images/zongqihao.png');
  height: 100px;
}
.area{
  background-size:100% 100%;
  background-repeat: no-repeat;
  background-image: url('../../assets/images/jianzhumianji.png');
  height: 100px;
}
.people{
  background-size:100% 100%;
  background-repeat: no-repeat;
  background-image: url('../../assets/images/yondianrenshu.png');
  height: 100px;
}
.el-card{
  color:white;
}
.footcard{
padding-top:0;
box-shadow:0px 0px 15px 0px rgba(178,197,255,1)!important;
color: black;
overflow: hidden;
}
.text{
  font-size:12px;
  margin-top: 5px;
}
</style>
