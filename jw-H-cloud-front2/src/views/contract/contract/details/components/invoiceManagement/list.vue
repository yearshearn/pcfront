<template>
  <el-container>
    <el-header>
      <el-row>
        <el-col align="right">
          <el-button @click="add">新增发票</el-button>
        </el-col>
      </el-row>
    </el-header>
    <el-main>
      <el-card>
        <el-form label-position="right">
          <el-table
            v-loading="loading"
            ref="table"
            :data="invoice['list']"
            :max-height="578"
            :row-style="tableStripeCallBack"
            element-loading-text="获取列表中">
            <el-table-column label="序号" align="center" type="index"/>
            <el-table-column property="pipelineNum" label="发票号码" align="center"/>
            <el-table-column property="requestorName" label="上传人" align="center"/>
            <el-table-column label="上传日期" align="center">
              <template slot-scope="{row}">
                {{ row['dateRequest'].split(' ')[0] }}
              </template>
            </el-table-column>
            <el-table-column label="上传时间" align="center">
              <template slot-scope="{row}">
                {{ row['dateRequest'].split(' ')[1] }}
              </template>
            </el-table-column>
            <el-table-column property="amount" label="金额" align="center">
              <template slot-scope="{row}">
                {{ '￥' + row['amount'] }}
              </template>
            </el-table-column>
            <el-table-column property="percent" label="已付款进度" align="center" show-overflow-tooltip/>
            <el-table-column property="description" label="备注" align="center" show-overflow-tooltip/>
            <el-table-column align="center" label="操作选项" width="150">
              <template slot-scope="{row}">
                <el-button size="mini" type="primary" @click="handleEdit(row)">编辑</el-button>
                <el-button size="mini" type="danger" @click.native.prevent="clear(row)">删除</el-button>
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
                @size-change="handleSizeChange"
              />
            </el-col>
          </el-row>
        </el-form>
      </el-card>
    </el-main>
    <detailDialog
      :con-id="conId"
      :title-name="titleName"
      :editor-dialog="editorDialog"
      :invoice-id="invoiceId"
      :close-dialog="closeDialog"
      :invoice-list="invoiceList"/>
  </el-container>
</template>

<script>
import { tableStripeCallBack } from '@/utils/style'

import { pageSizes } from '@/utils/globalConfig'

import { default as detailDialog } from './editor'

import {
  invoiceList,
  deleteInvoice
} from '@/api/contract'

export default {
  // 公共组件
  components: {
    detailDialog
  },
  props: {
    conId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      // 分页
      pageSizes,
      // 表格等待
      loading: false,
      // 新增编辑弹窗
      editorDialog: false,
      // 子组件标题
      titleName: '',
      invoiceId: '',
      invoice: {},
      // 列表分页
      pagination: {
        currentPage: 1,
        pageSize: 10,
        total: 0
      }
    }
  },
  computed: {},
  created() {},
  async mounted() {
    this.invoiceList()
  },
  methods: {
    // 表格隔行颜色
    tableStripeCallBack,
    // 问卷分页
    currentChange(targetPage) {
      this.pagination['currentPage'] = targetPage
      this.invoiceList()
    },
    // 分页跳转
    handleSizeChange(size) {
      this.pagination['pageSize'] = size
      this.pagination['currentPage'] = 1
      this.invoiceList()
    },
    // 新增
    add() {
      this.editorDialog = true
      this.titleName = '新增'
    },
    // 编辑
    handleEdit(rows) {
      // console.log(rows)
      this.invoiceId = String(rows['invoiceId'])
      this.editorDialog = true
      this.titleName = '编辑'
    },
    // 关闭弹框
    closeDialog() {
      this.editorDialog = false
    },
    // 删除
    async clear(rows) {
      try {
        await this.$confirm(`确定要删除此发票记录吗?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        const data = {
          invoiceId: rows['invoiceId']
        }
        await deleteInvoice(data)
        this.$message({
          message: '删除成功！',
          type: 'success'
        })
      } catch (error) {
        console.log(error)
      } finally {
        this.invoiceList()
      }
    },
    // 发票列表
    async invoiceList() {
      this.loading = true
      try {
        const params = {
          conId: this.conId,
          pageNum: this.pagination['currentPage'],
          pageSize: this.pagination['pageSize']
        }
        const r = await invoiceList(params)
        this.invoice['list'] = r['data']
        this.pagination['total'] = r['count']
        // console.log(this.pagination)
      } catch (error) {
        console.log(error)
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style scoped>
  .el-main{
    padding: 0px 20px;
  }

  .el-pagination{
    margin-top: 30px;
  }
</style>
