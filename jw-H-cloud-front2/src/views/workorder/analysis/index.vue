<template>
  <el-container>
    <!-- 头部 -->
    <el-header>
      <el-form
        ref="workingHours"
        :rules="workingHours"
        :model="workingHours"
        label-width="90px"
        label-position="right">
        <el-row :gutter="15">
          <el-col :span="4">
            <el-form-item
              label="问题类型:"
              prop="problemType">
              <el-select
                v-model="workingHours['problemType']"
                clearable
                placeholder="请选择">
                <el-option
                  v-for="item in workingHours['problemOptions']"
                  :key="item['name']"
                  :label="item['name']"
                  :value="item['id']"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item
              label="维修类型:"
              prop="repairType">
              <el-select
                v-model="workingHours['repairType']"
                clearable
                placeholder="请选择">
                <el-option
                  v-for="item in repairTypeOptions"
                  :key="item['name']"
                  :label="item['name']"
                  :value="item['name']"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item
              label="开始年月"
              prop="startDate">
              <el-date-picker
                :picker-options="startDateOptions"
                v-model="workingHours['startDate']"
                type="month"
                clearable
                style="width:100%"
                value-format="yyyy-MM"
                placeholder="开始年月"/>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item
              label="结束年月"
              prop="endDate">
              <el-date-picker
                :picker-options="workOrderEndDateOptions"
                v-model="workingHours['endDate']"
                type="month"
                clearable
                style="width:100%"
                value-format="yyyy-MM"
                placeholder="结束年月"/>
            </el-form-item>
          </el-col>
          <el-col :span="2" align="right">
            <el-button type="primary" @click="display">显示</el-button>
          </el-col>
          <el-col :span="2" align="right">
            <el-button @click="cleanUp">清除</el-button>
          </el-col>
          <el-col :span="2" align="right">
            <el-button
              @click="exportToExcel"
            >导出文档</el-button>
          </el-col>
        </el-row>
      </el-form>
    </el-header>
    <!-- 主体 -->
    <el-main>
      <el-card>
        <el-form
          label-position="right">
          <el-table
            v-loading="workingHours['loading']"
            ref="table"
            :data="workingHours['cfTimeAnalusis']"
            :row-style="tableStripeCallBack"
            fit
            max-height="600"
            element-loading-text="获取列表中"
            @row-click="rowClick">
            <el-table-column label="序号" fixed width="80" align="center" type="index"/>
            <el-table-column
              :filters="filterData"
              :filter-method="filterHandler"
              property="cfName"
              label="姓名"
              align="center"
              fixed
              column-key="cfName"/>
            <el-table-column property="sumTimeAnalysis" fixed label="总计(时)" align="center"/>
            <el-table-column
              v-for="(item,index) in workingHours['monthsData']"
              :label="item"
              :key="index"
              align="center">
              <template slot-scope="{row}">
                <span>{{ row['monthTimeAnalysis'][index]['value'] }}</span>
              </template>
            </el-table-column>
          </el-table>
          <el-row>
            <el-col :span="24" align="center">
              <el-pagination
                :page-sizes="pageSizes"
                :current-page="pagination['currentPage']"
                :page-size="pagination['pageSize']"
                :total="pagination['total']"
                layout="total, sizes, prev, pager, next, jumper"
                @current-change="currentChange"
                @size-change="handleSizeChange"/>
            </el-col>
          </el-row>
        </el-form>
      </el-card>
    </el-main>
    <detailDialog
      :close-dialog="closeDialog"
      :statistical-date="workingHours['statisticalDate']"
      :show-flag="workingHours['dialog']"
      :cf-name="workingHours['cfName']"
      :problem-type="workingHours['problemType']"
      :repair-type="workingHours['repairType']"/>
  </el-container>
</template>

<script>
import qs from 'qs'

import { tableStripeCallBack } from '@/utils/style'

import { getToken } from '@/utils/auth'

import { pageSizes } from '@/utils/globalConfig'

import { default as detailDialog } from './components/dialog'

import { problemOptions } from '@/api/mechanic/mechainc'

import { timeAnalysis } from '@/api/workorder/analysis'

export default {
  // 公共组件
  components: {
    detailDialog
  },
  filters: {
  },
  props: {

  },
  data() {
    return {
      // 开始年月限制
      startDateOptions: {
        disabledDate: (time) => {
          if (!Object.is(this.workingHours['endDate'], '')) {
            return time.getTime() > Date.now() || time.getTime() > new Date(this.workingHours['endDate']).getTime()
          } else {
            return time.getTime() > Date.now()
          }
        }
      },
      // 结束年月限制
      workOrderEndDateOptions: {
        disabledDate: (time) => {
          return time.getTime() < new Date(this.workingHours['startDate']).getTime() || time.getTime() > Date.now()
        }
      },
      // 分页显示条数
      pageSizes,
      filterData: [],
      // 维修类型下啦数组
      repairTypeOptions: [
        { name: '维修' },
        { name: '巡修' }
      ],
      // 工时
      workingHours: {
        // 表格等待
        loading: false,
        // 弹框详情
        dialog: false,
        // 问题类型
        problemType: '',
        // 维修类型
        repairType: '',
        // 开始年月
        startDate: '',
        // 结束年月
        endDate: '',
        // 问题类型下拉框数组
        problemOptions: [],
        // 月份数组
        monthsData: [],
        // 工时数组
        cfTimeAnalusis: [],
        // 获得表头的内容
        statisticalDate: '',
        // 技工名称
        cfName: ''
      },
      // 列表分页
      pagination: {
        currentPage: 1,
        pageSize: 10,
        total: 0
      }
    }
  },
  computed: {
    baseUrl() {
      return process.env.BASE_API
    }
  },
  created() {},
  async mounted() {
    this.problemOptions()
    this.getTimeAnalysis()
  },
  methods: {
    // 表格隔行颜色
    tableStripeCallBack,
    // 问题类型下拉框
    async problemOptions() {
      try {
        const r = await problemOptions()
        this.workingHours['problemOptions'] = r['data']
        // console.log(r['data'])
      } catch (e) {
        console.log(e)
      } finally {
        () => {}
      }
    },
    // 工时列表
    async getTimeAnalysis() {
      try {
        this.workingHours['loading'] = true
        const params = {
          repairType: this.workingHours['repairType'],
          probType: this.workingHours['problemType'],
          dateStart: this.workingHours['startDate'],
          dateEnd: this.workingHours['endDate'],
          pageCurrent: this.pagination['currentPage'],
          pageSize: this.pagination['pageSize']
        }
        const r = await timeAnalysis(params)
        this.workingHours['monthsData'] = r['data']['months']
        this.workingHours['cfTimeAnalusis'] = r['data']['cfTimeAnalusis']
        this.pagination['total'] = r['data']['count']
        this.filterData = r['data']['cfTimeAnalusis'].map((item) => {
          return {
            text: item.cfName,
            value: item.cfName
          }
        })
        // console.log(r['data']['cfTimeAnalusis'], r['data']['months'])
      } catch (e) {
        console.log(e)
      } finally {
        this.$refs.table.bodyWrapper.scrollTop = 0
        this.workingHours['loading'] = false
      }
    },
    // 表格点击事件
    rowClick(row, column) {
      this.workingHours['statisticalDate'] = column['label']
      this.workingHours['cfName'] = row['cfId']
      this.workingHours['dialog'] = true
      const date = ['姓名', '序号']
      if (date.includes(this.workingHours['statisticalDate'])) {
        this.workingHours['dialog'] = false
      }
      // console.log(this.workingHours['statisticalDate'], row, row['index'], column['label'], column)
    },
    // 该列的筛选
    filterHandler(value, row, column) {
      const property = column['property']
      return row[property] === value
      // console.log(value, row, column)
    },
    // 关闭弹框
    closeDialog() {
      this.workingHours['dialog'] = false
    },
    // 问卷分页
    currentChange(targetPage) {
      this.pagination['currentPage'] = targetPage
      this.getTimeAnalysis()
    },
    // 分页跳转
    handleSizeChange(size) {
      this.pagination['pageSize'] = size
      this.pagination['currentPage'] = 1
      this.getTimeAnalysis()
    },
    // 显示
    display() {
      const params = {
        problemType: this.workingHours['problemType'],
        repairType: this.workingHours['repairType'],
        startDate: this.workingHours['startDate'],
        endDate: this.workingHours['endDate']
      }
      this.getTimeAnalysis(params)
    },
    // 清空
    cleanUp() {
      this.$refs['workingHours'].resetFields()
    },
    // 导出文档
    async exportToExcel() {
      const url = `;;/wr/timeAnalysis\?${qs.stringify({
        repairType: this.workingHours['repairType'],
        probType: this.workingHours['problemType'],
        dateStart: this.workingHours['startDate'],
        dateEnd: this.workingHours['endDate'],
        pageCurrent: this.pagination['currentPage'],
        pageSize: 999999,
        authorization: getToken()
      })}`
      window.open(`${this.baseUrl}/wr/exportExcelUnique?projectName=wrAnalysis&url=${url}&authorization=${getToken()}`)
    }
  }
}
</script>

<style scoped>
  .el-container{
    margin: 30px 30px 0;
  }

  .el-pagination{
    margin-top: 30px;
  }
</style>
