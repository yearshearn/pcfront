<template>
  <div>
    <el-dialog :visible="showFlag" :before-close="closeHandle" :title="statisticalDate" center>
      <el-table
        v-loading="dialog['loading']"
        ref="table"
        :data="detailData"
        :row-style="tableStripeCallBack"
        max-height="539"
        element-loading-text="获取列表中">
        <el-table-column label="序号" width="80" align="center" type="index"/>
        <el-table-column property="wrId" label="工单编号" align="center"/>
        <el-table-column property="cfName" show-overflow-tooltip label="技工" align="center"/>
        <el-table-column label="完成日期" width="120" align="center">
          <template slot-scope="{row}">
            {{ Object.is(row['dateCompleted'], null) ? '' : row['dateCompleted'].split(' ')[0] }}
          </template>
        </el-table-column>
        <el-table-column property="dateCompleted" label="完成时间" width="120" align="center">
          <template slot-scope="{row}">
            {{ Object.is(row['dateCompleted'], null) ? '' : row['dateCompleted'].split(' ')[1] }}
          </template>
        </el-table-column>
        <el-table-column property="repairType" label="维修类型" align="center"/>
        <el-table-column property="actLaborHours" label="实际工时(时)" width="100" align="center"/>
        <el-table-column property="location" show-overflow-tooltip label="地点" width="150" align="center"/>
        <el-table-column property="cfNotes" show-overflow-tooltip label="工作描述" width="150" align="center"/>
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
    </el-dialog>
  </div>
</template>

<script>
import { tableStripeCallBack } from '@/utils/style'

import { pageSizes } from '@/utils/globalConfig'

import {
  performanceDetails
} from '@/api/workorder/analysis'

export default {
  props: {
    // 技工名称
    cfName: {
      type: String,
      default: ''
    },
    // 维修类型
    repairType: {
      type: String,
      default: ''
    },
    // 问题类型
    problemType: {
      type: String,
      default: ''
    },
    // 统计日期
    statisticalDate: {
      type: String,
      default: ''
    },
    // 关闭
    closeDialog: {
      type: Function,
      default: null
    },
    // 是否显示
    showFlag: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      pageSizes,
      // 详情数组
      detailData: [],
      // 列表等待
      dialog: {
        loading: false
      },
      // 列表分页
      pagination: {
        currentPage: 1,
        pageSize: 10,
        total: 0
      }
    }
  },
  computed: {},
  watch: {
    showFlag() {
      if (Object.is(this.showFlag, true)) {
        this.getPerformanceDetails()
      }
    }
  },
  created() {
  },
  async mounted() {
  },
  methods: {
    // 表格隔行颜色
    tableStripeCallBack,
    // 关闭弹框
    closeHandle() {
      this.pagination = {
        currentPage: 1,
        pageSize: 10,
        total: 0
      }
      this.closeDialog()
    },
    // 问卷分页
    currentChange(targetPage) {
      this.pagination['currentPage'] = targetPage
      this.getPerformanceDetails()
    },
    // 分页跳转
    handleSizeChange(size) {
      this.pagination['pageSize'] = size
      this.pagination['currentPage'] = 1
      this.getPerformanceDetails()
    },
    // 工时详情
    async getPerformanceDetails() {
      let date = ''
      if (!Object.is(this.statisticalDate, '总计(时)')) {
        date = this.statisticalDate
      }
      try {
        this.dialog['loading'] = true
        const params = {
          cfId: this.cfName,
          date: date,
          repairType: this.repairType,
          probType: this.problemType,
          pageCurrent: this.pagination['currentPage'],
          pageSize: this.pagination['pageSize']
        }
        const r = await performanceDetails(params)
        this.detailData = r['data']['list']
        this.pagination['total'] = r['data']['count']
        // console.log(r['data'])
      } catch (e) {
        console.log(e)
      } finally {
        this.dialog['loading'] = false
        this.$refs.table.bodyWrapper.scrollTop = 0
      }
    }
  }
}
</script>

<style scoped>
  .el-pagination{
    margin-top: 30px;
  }
</style>
