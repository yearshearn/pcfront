<template>
  <div>
    <el-dialog :visible="showFlag" :before-close="closeHandle" :title="titleName" center>
      <el-table
        v-loading="dialog['loading']"
        ref="table"
        :data="detailData"
        :max-height="545"
        :row-style="tableStripeCallBack"
        element-loading-text="获取列表中">
        <el-table-column label="序号" width="80" align="center" type="index"/>
        <el-table-column property="wrId" label="工单编号" align="center"/>
        <el-table-column property="requestor" label="申请人" align="center"/>
        <el-table-column property="cfName" label="技工" align="center" show-overflow-tooltip/>
        <el-table-column label="请求日期" width="110" align="center">
          <template slot-scope="{row}">
            {{ row['dateAssigned'].split(' ')[0] }}
          </template>
        </el-table-column>
        <el-table-column label="请求时间" width="110" align="center">
          <template slot-scope="{row}">
            {{ row['dateAssigned'].split(' ')[1] }}
          </template>
        </el-table-column>
        <el-table-column property="repairType" label="维修类型" align="center"/>
        <el-table-column property="probTypeName" label="问题类型" align="center" show-overflow-tooltip/>
        <el-table-column property="wrStatus" label="工单状态" width="110" align="center"/>
        <el-table-column
          label="地点"
          show-overflow-tooltip
          align="center">
          <template slot-scope="{row}">
            {{ row['blId'] + row['flId'] + row['rmId'] }}
          </template>
        </el-table-column>
        <el-table-column
          property="description"
          label="工作描述"
          show-overflow-tooltip
          align="center"/>
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
            @size-change="handleSizeChange"
          />
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import { tableStripeCallBack } from '@/utils/style'

import { pageSizes } from '@/utils/globalConfig'

import {
  wrStaturChartDetails,
  repairTypeChartDetails
} from '@/api/workorder/chart'

export default {
  props: {
    // 关闭
    closeDialog: {
      type: Function,
      default: null
    },
    // 是否显示
    showFlag: {
      type: Boolean,
      default: false
    },
    // 标题
    titleName: {
      type: String,
      default: ''
    },
    // 开始日期
    startDate: {
      type: String,
      default: ''
    },
    // 结束日期
    endDate: {
      type: String,
      default: ''
    },
    // 图表类型
    chartType: {
      type: String,
      default: ''
    },
    this: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      pageSizes,
      // 列表等待
      dialog: {
        loading: false
      },
      // 列表数组
      detailData: [],
      // 列表分页
      pagination: {
        currentPage: 1,
        pageSize: 10,
        total: 0
      }
    }
  },
  computed: {

  },
  watch: {
    showFlag() {
      if (Object.is(this.showFlag, true)) {
        this.chartDetails()
      }
    }
  },
  created() {},
  async mounted() {},
  methods: {
    // 表格隔行颜色
    tableStripeCallBack,
    // 工单状态详情
    async chartDetails() {
      this.dialog['loading'] = true
      try {
        const params = {
          startDate: this.startDate,
          endDate: this.endDate,
          wrStatus: this.titleName,
          repairType: this.titleName,
          pageCurrent: this.pagination['currentPage'],
          pageSize: this.pagination['pageSize']
        }
        let r = {}
        if (Object.is(this.chartType, 'workOrderStatus')) {
          r = await wrStaturChartDetails(params)
        }
        if (Object.is(this.chartType, 'repairType')) {
          r = await repairTypeChartDetails(params)
        }
        this.detailData = r['data']['data']
        this.pagination['total'] = r['data']['count']
        // console.log(r['data']['data']
      } catch (e) {
        console.log(e)
      } finally {
        this.dialog['loading'] = false
        this.$refs.table.bodyWrapper.scrollTop = 0
      }
    },
    // 问卷分页
    currentChange(targetPage) {
      this.pagination['currentPage'] = targetPage
      this.chartDetails()
    },
    // 分页跳转
    handleSizeChange(size) {
      this.pagination['pageSize'] = size
      this.pagination['currentPage'] = 1
      this.chartDetails()
    },
    // 关闭弹框
    closeHandle() {
      this.pagination = {
        currentPage: 1,
        pageSize: 10,
        total: 0
      }
      this.closeDialog()
    }
  }
}
</script>

<style scoped>
  .el-pagination{
    margin-top: 30px;
  }

  .el-table{
    height: 718px;
  }
</style>
