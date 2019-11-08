<template style="height:100%">
  <el-container style="margin-top: 30px;">
    <el-header>
      <el-form
        label-position="right"
      >
        <el-row :gutter="15">
          <el-col :span="6">
            <el-button @click="handleEdit('create')">新增备件</el-button>
          </el-col>
          <el-col :span="4" :offset="4">
            <el-input
              v-model="searchObj['code']"
              clearable
              placeholder="请输入备件编码"
              @clear="_getPartDetailList(true)"
              @keyup.enter.native="_getPartDetailList(true)">
              <el-button slot="append" icon="el-icon-search" @click="_getPartDetailList(true)"/>
            </el-input>
          </el-col>
          <el-col :span="4">
            <el-input
              v-model="searchObj['type']"
              clearable
              placeholder="请输入备件类别"
              @clear="_getPartDetailList(true)"
              @keyup.enter.native="_getPartDetailList(true)">
              <el-button slot="append" icon="el-icon-search" @click="_getPartDetailList(true)"/>
            </el-input>
          </el-col>
          <el-col :span="4" >
            <el-input
              v-model="searchObj['name']"
              placeholder="请输入备件名称"
              clearable
              @clear="_getPartDetailList(true)"
              @keyup.enter.native="_getPartDetailList(true)"
            >
              <el-button slot="append" icon="el-icon-search" @click="_getPartDetailList(true)"/>
            </el-input>
          </el-col>
          <el-col :span="2">
            <el-button @click="exportToExcel">导出文档</el-button>
          </el-col>
        </el-row>
      </el-form>
    </el-header>
    <el-main>
      <el-table
        v-loading="listLoading"
        ref="table"
        :data="tableData"
        :row-style="tableStripeCallBack"
        fit
        max-height="589"
        element-loading-text="数据加载中..."
        style="100%"
      >
        <el-table-column
          fixed
          align="center"
          label="序号"
          width="50"
          type="index"
        />
        <el-table-column
          fixed
          sortable
          align="center"
          prop="code"
          label="备件编号"
        />
        <el-table-column
          fixed
          sortable
          align="center"
          prop="name"
          label="备件名称"
          show-overflow-tooltip
        />
        <el-table-column
          fixed
          sortable
          align="center"
          prop="type"
          label="备件类别"
        />
        <el-table-column
          fixed
          align="center"
          prop="costUnitStd"
          label="单价（元）"
        />
        <el-table-column
          fixed
          align="center"
          prop="unitsOrder"
          label="单位"
        />
        <el-table-column
          fixed
          sortable
          align="center"
          prop="vendors"
          label="备件供应商"
          show-overflow-tooltip
        />
        <el-table-column
          fixed="right"
          align="center"
          width="250"
          show-overflow-tooltip
          label="操作选项"
          class-name="small-padding fixed-width"
        >
          <template slot-scope="{row}">
            <el-button :disabled="isOperating" size="mini" type="primary" @click="handleEdit('edit', row)">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-row style="text-align:center">
        <el-col :span="24">
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
    </el-main>
  </el-container>
</template>

<script>
import qs from 'qs'

import { tableStripeCallBack } from '@/utils/style'

import { getToken } from '@/utils/auth'

import { pageSizes } from '@/utils/globalConfig'

import { typeFilter, stateFilter } from '@/filter/state'

import { getPartDetailList, modifyPartState } from '@/api/part'

export default {
  name: 'PartDetailList',
  components: {},
  filters: {
    typeFilter,
    stateFilter
  },
  props: {},
  data() {
    return {
      pageSizes,
      // state: 1,
      isOperating: false,
      listLoading: true,
      tableData: [],
      pagination: {
        currentPage: 1,
        pageSize: 10,
        total: 0
      },
      // suppliers: '',
      hideSinglePage: false,
      searchObj: {
        name: '',
        code: '',
        type: ''
      },
      realSearchObj: {
        name: '',
        code: '',
        type: ''

      }
    }
  },
  computed: {
    baseUrl() {
      return process.env.BASE_API
    }
  },
  watch: {
  },
  created() {
    this._getPartDetailList()
  },
  async mounted() { },
  methods: {
    // 表格隔行颜色
    tableStripeCallBack,
    // 修改备件类型状态
    async handleOperate(row, state) {
      // console.log(row)
      // 携带参数id,state
      const body = {
        partId: row.partId
      }
      try {
        await modifyPartState(body)
      } catch (e) {
        console.log(e)
      } finally {
        this._getPartDetailList()
        this.$message({
          message: '操作成功',
          type: 'success'
        })
      }
    },
    async handleEdit(state = 'create', row) {
      // console.log(row)
      if (state !== 'create') {
        this.$router.push({
          name: 'PartDetailEdit',
          params: {
            id: row.partId
          }
        })
      } else {
        this.$router.push({ name: 'PartDetailCreate' })
      }
    },
    async _getPartDetailList(search, jump) {
      try {
        const params = {
          pageNum: this.pagination['currentPage'],
          pageSize: this.pagination['pageSize']
        }
        if (search) {
          // console.log(this.realNameSearch)
          this.realSearchObj = JSON.parse(JSON.stringify(this.searchObj))
          this.pagination['currentPage'] = 1
          params['pageNum'] = 1
        }
        if (!search || jump) {
          this.realSearchObj = JSON.parse(JSON.stringify(this.searchObj))
        }
        params['code'] = this.realSearchObj['code']
        params['name'] = this.realSearchObj['name']
        params['type'] = this.realSearchObj['type']
        this.listLoading = true
        const result = await getPartDetailList(params)
        this.tableData = result.data.list
        for (var i = 0; i < this.tableData.length; i++) {
          var supplierName = this.tableData[i]['vendors']
          if (!supplierName || supplierName.length === 0) {
            this.tableData[i]['vendors'] = '-'
          } else {
            var suname = ''
            for (var j = 0; j < supplierName.length; j++) {
              if (j === supplierName.length - 1) {
                suname += supplierName[j]['company']
              } else {
                suname += supplierName[j]['company'] + '、'
              }
            }
            this.tableData[i]['vendors'] = suname
          }
          // console.log(supplierName)
        }
        this.pagination['pageSize'] = result['data']['pageSize']
        this.pagination['total'] = result['data']['count']
      } catch (error) {
        console.log(error)
      } finally {
        this.listLoading = false
        this.$refs.table.bodyWrapper.scrollTop = 0
      }
    },
    currentChange(targetPage) {
      this.pagination['currentPage'] = targetPage
      this._getPartDetailList(false, true)
    },
    // 分页跳转
    handleSizeChange(size) {
      this.pagination['pageSize'] = size
      this.pagination['currentPage'] = 1
      this._getPartDetailList()
    },
    // 导出文档
    async exportToExcel() {
      const url = `;;/part/list\?${qs.stringify({
        pageNum: this.pagination['currentPage'],
        pageSize: 999999,
        code: this.realSearchObj['code'],
        type: this.realSearchObj['type'],
        name: this.realSearchObj['name'],
        authorization: getToken()
      })}`
      window.open(`${this.baseUrl}/wr/exportExcelPart?projectName=part&url=${url}&authorization=${getToken()}`)
      // window.open(`http://192.168.0.133:9083/jwkjPublicService/exportExcelPart?projectName=part&url=${url}&authorization=${getToken()}`)
    }
  }
}
</script>

<style scoped>
  .el-pagination{
    margin-top: 30px;
  }
</style>
