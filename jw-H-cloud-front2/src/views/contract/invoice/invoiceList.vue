<template>
  <el-container>
    <el-header>
      <el-row :gutter="15">
        <el-col :offset="18" :span="4">
          <el-input
            v-model="invoiceList['search']"
            placeholder="请输入合同编码"
            clearable
            @clear="getAllInvoiceList(true)"
            @keyup.enter.native="getAllInvoiceList(true)">
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getAllInvoiceList(true)"/>
          </el-input>
        </el-col>
        <el-col :span="2" align="right">
          <el-button @click="exportToExcel">导出</el-button>
        </el-col>
      </el-row>
    </el-header>
    <el-main>
      <el-table
        v-loading="listLoading"
        ref="table"
        :data="invoiceList['listData']"
        :row-style="tableStripeCallBack"
        fit
        max-height="528"
        element-loading-text="数据加载中...">
        <el-table-column align="center" type="index" label="序号" fixed/>
        <el-table-column align="center" property="conId" label="合同编码" fixed/>
        <el-table-column align="center" property="conName" label="合同名称" show-overflow-tooltip/>
        <el-table-column align="center" property="resPerson" label="合同责任人"/>
        <el-table-column align="center" property="pipelineNum" label="发票号码" show-overflow-tooltip/>
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
        <el-table-column label="金额" align="center">
          <template slot-scope="{row}">
            {{ '￥' + row['amount'] }}
          </template>
        </el-table-column>
        <el-table-column align="center" property="percent" label="已付款进度"/>
      </el-table>
      <el-row style="text-align:center">
        <el-col :span="24">
          <el-pagination
            :page-sizes="pageSizes"
            :current-page="paginationData['currentPage']"
            :page-size="paginationData['pageSize']"
            :total="paginationData['total']"
            layout="total, sizes, prev, pager, next, jumper"
            @current-change="currentChange"
            @size-change="handleSizeChange"/>
        </el-col>
      </el-row>
    </el-main>
  </el-container>
</template>

<script>
import qs from 'qs'

import { pageSizes } from '@/utils/globalConfig'

import { tableStripeCallBack } from '@/utils/style'

import { allInvoiceList } from '@/api/contract'

import { getToken } from '@/utils/auth'

export default {
  data() {
    return {
      pageSizes,
      listLoading: false,
      file: false,
      invoiceList: {},
      paginationData: {
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
  mounted() {
    this.getAllInvoiceList()
  },
  methods: {
    // 表格隔行颜色
    tableStripeCallBack,
    // 分页跳转
    currentChange(targetPage) {
      this.paginationData['currentPage'] = targetPage
      this.getAllInvoiceList(false, true)
    },
    // 分页跳转
    handleSizeChange(size) {
      this.paginationData['pageSize'] = size
      this.paginationData['currentPage'] = 1
      this.getAllInvoiceList()
    },
    // 所有发票列表
    async getAllInvoiceList(search, jump) {
      this.listLoading = true
      try {
        const params = {
          pageNum: this.paginationData['currentPage'],
          pageSize: this.paginationData['pageSize'],
          conId: this.invoiceList['search']
        }
        if (search) {
          params['pageNum'] = 1
          params['conId'] = this.invoiceList['search']
        }
        if (jump) {
          params['conId'] = this.invoiceList['search']
        }
        const r = await allInvoiceList(params)
        this.invoiceList['listData'] = r['data']['list']
        this.paginationData['total'] = r['data']['count']
        // console.log(r['list'])
      } catch (error) {
        console.log(error)
      } finally {
        this.listLoading = false
        // this.$refs.table.bodyWrapper.scrollTop = 0
      }
    },
    // 导出
    async exportToExcel() {
      const url = `;;/contract/invoice/allInvoiceList\?${qs.stringify({
        conId: this.invoiceList['search'],
        pageSize: 999999,
        pageNum: 1,
        authorization: getToken()
      })}`
      window.open(`${this.baseUrl}/wr/exportExcel?projectName=invoice&url=${url}&authorization=${getToken()}`)
    }
  }
}
</script>

<style scoped>
  .el-container{
    margin-top: 30px;
  }

  .el-pagination{
    margin-top: 30px;
  }
</style>
