<template>
  <div>
    <el-dialog v-dialogDrag :visible="showFlag" :before-close="closeHandle" :title="titleName" center>
      <el-table
        v-loading="dialog['loading']"
        ref="table"
        :data="detailData"
        :row-style="tableStripeCallBack"
        max-height="550"
        element-loading-text="获取列表中">
        <el-table-column label="序号" width="80" align="center" type="index"/>
        <el-table-column
          v-if="stock"
          property="ptLocName"
          label="仓库名称"
          show-overflow-tooltip
          align="center"/>
        <el-table-column
          v-if="stock"
          property="code"
          label="备件编码"
          align="center"/>
        <el-table-column
          v-if="stock"
          property="partName"
          show-overflow-tooltip
          label="备件名称"
          width="120"
          align="center"/>
        <el-table-column
          v-if="stock"
          property="qtyOnHand"
          label="可用数量"
          align="center"/>
        <el-table-column
          v-if="stock"
          property="costTotal"
          label="库存价值"
          align="center"/>
        <el-table-column
          v-if="!stock"
          label="请求日期"
          width="110"
          align="center">
          <template slot-scope="{row}">
            {{ row['operationTime'] ? row['operationTime'].split(' ')[0] : '' }}
          </template>
        </el-table-column>
        <el-table-column
          v-if="!stock"
          label="请求时间"
          width="110"
          align="center">
          <template slot-scope="{row}">
            {{ row['operationTime'] ? row['operationTime'].split(' ')[1] : '' }}
          </template>
        </el-table-column>
        <el-table-column
          v-if="!stock"
          property="transType"
          sortable
          label="操作类型"
          width="110"
          align="center"/>
        <el-table-column
          v-if="!stock"
          property="code"
          sortable
          label="备件编码"
          width="110"
          align="center"/>
        <el-table-column
          v-if="!stock"
          property="partName"
          sortable
          show-overflow-tooltip
          label="备件名称"
          width="110"
          align="center"/>
        <el-table-column
          v-if="!stock"
          property="transferFrom"
          show-overflow-tooltip
          label="源位置"
          align="center"/>
        <el-table-column
          v-if="!stock"
          property="transferTo"
          show-overflow-tooltip
          label="目标位置"
          align="center"/>
        <el-table-column
          v-if="!stock"
          property="transQuantity"
          label="变动数量"
          align="center"/>
        <el-table-column
          v-if="!stock"
          property="costWhenUsed"
          label="单位成本"
          align="center"/>
        <el-table-column
          v-if="!stock"
          property="costTotal"
          label="总成本"
          align="center"/>
        <el-table-column
          v-if="!stock"
          property="performedName"
          label="执行人"
          align="center"
          show-overflow-tooltip/>
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
import { pageSizes } from '@/utils/globalConfig'

import { tableStripeCallBack } from '@/utils/style'

import {
  partTransRecordChartDetails,
  partInventoryChartDetails
} from '@/api/part/chart'

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
    // 状态
    state: {
      type: String,
      default: ''
    },
    // 仓库名称
    wareHouseName: {
      type: Array,
      default: () => []
    },
    // 标题
    titleName: {
      type: String,
      default: ''
    },
    // 标题id
    titleId: {
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
    }
  },
  data() {
    return {
      // 每页显示条数
      pageSizes,
      // 弹框
      dialog: {
        // 列表等待
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
    // 库存显示
    stock() {
      if (Object.is(this.state, '库存')) {
        return true
      }
      if (Object.is(this.state, '转移')) {
        return false
      }
    }
  },
  watch: {
    showFlag() {
      if (Object.is(this.showFlag, true)) {
        this.chartDetails()
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
      this.chartDetails()
    },
    // 分页跳转
    handleSizeChange(size) {
      this.pagination['pageSize'] = size
      this.pagination['currentPage'] = 1
      this.chartDetails()
    },
    // 图表详情
    async chartDetails() {
      this.dialog['loading'] = true
      try {
        const params = {
          startDate: this.startDate,
          endDate: this.endDate,
          operationType: this.titleId,
          pageNum: this.pagination['currentPage'],
          pageSize: this.pagination['pageSize']
        }
        const data = {
          category: this.titleId,
          ptStoreLocIds: this.wareHouseName,
          pageNum: this.pagination['currentPage'],
          pageSize: this.pagination['pageSize']
        }
        let r = {}
        if (Object.is(this.state, '库存')) {
          r = await partInventoryChartDetails(data)
          this.detailData = r['data']
          this.pagination['total'] = r['count']
          // console.log(this.titleId, this.wareHouseName)
        }
        if (Object.is(this.state, '转移')) {
          r = await partTransRecordChartDetails(params)
          this.detailData = r['data']['list']
          this.pagination['total'] = r['data']['count']
        }
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

  .el-table{
    height: 723px;
  }
</style>
