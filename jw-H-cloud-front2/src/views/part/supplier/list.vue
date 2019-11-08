<template style="height:100%">
  <el-container>
    <el-header style="margin-top:20px">
      <el-row :gutter="15">
        <el-col :span="4">
          <el-button @click="handleEdit('create')">新增供应商</el-button>
        </el-col>
        <el-col :span="4" :offset="12">
          <el-input
            v-model="searchObj['contact']"
            clearable
            placeholder="请输入联系人"
            @clear="getList(true)"
            @keyup.enter.native="getList(true)">
            <el-button slot="append" icon="el-icon-search" @click="getList(true)"/>
          </el-input>
        </el-col>
        <el-col :span="4" >
          <el-input
            v-model="searchObj['company']"
            placeholder="请输入供应商名称"
            clearable
            @clear="getList(true)"
            @keyup.enter.native="getList(true)"
          >
            <el-button slot="append" icon="el-icon-search" @click="getList(true)"/>
          </el-input>
        </el-col>
        <!-- <el-col :span="1" :offset="1">
          <el-button>打印</el-button>
        </el-col> -->
      </el-row>
    </el-header>
    <el-main>
      <el-table
        v-loading="listLoading"
        ref="table"
        :data="tableData"
        :row-style="tableStripeCallBack"
        fit
        max-height="578"
        element-loading-text="数据加载中..."
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
          align="center"
          prop="company"
          label="供应商名称"
          show-overflow-tooltip
        />
        <el-table-column
          fixed
          align="center"
          prop="address"
          label="地址"
        />
        <el-table-column
          fixed
          align="center"
          prop="vendorType"
          show-overflow-tooltip
          label="供应商类型"
        />
        <el-table-column
          fixed
          align="center"
          prop="contact"
          label="联系人姓名"
        />
        <el-table-column
          fixed
          align="center"
          prop="phone"
          label="电话"
        />
        <el-table-column
          fixed
          align="center"
          prop="parts"
          label="备件"
          show-overflow-tooltip
        />
        <el-table-column
          fixed="right"
          align="center"
          width="250"
          label="操作选项"
          class-name="small-padding fixed-width"
        >
          <template slot-scope="{row}">
            <el-button :disabled="isOperating" size="mini" type="primary" @click="handleEdit('edit', row)">编辑</el-button>
            <el-button
              v-if="row.state == 0"
              size="mini"
              type="success"
              @click="handleOperate(row, 1)"
            >启用</el-button>
            <el-button
              v-if="row.state == 1"
              size="mini"
              type="danger"
              @click="handleOperate(row, 0)"
            >停用</el-button>
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
import { tableStripeCallBack } from '@/utils/style'

import { pageSizes } from '@/utils/globalConfig'

import { getPartSupplierList, modifyPartSupplierState } from '@/api/part'

export default {
  components: {},
  filters: {},
  props: {},
  data() {
    return {
      pageSizes,
      isOperating: false,
      listLoading: true,
      tableData: [],
      pagination: {
        currentPage: 1,
        pageSize: 10,
        total: 0
      },
      hideSinglePage: false,
      searchObj: {
        company: '',
        contact: ''
      },
      realSearchObj: {
        company: '',
        contact: ''
      }
    }
  },
  computed: {
  },
  created() {},
  async mounted() {
    this.getList()
  },
  methods: {

    // 表格隔行颜色
    tableStripeCallBack,
    async getList(search, jump) {
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
          this.searchObj = JSON.parse(JSON.stringify(this.realSearchObj))
        }
        params['company'] = this.realSearchObj['company']
        params['contact'] = this.realSearchObj['contact']
        this.listLoading = true
        const result = await getPartSupplierList(params)
        this.tableData = result.data.list
        for (var i = 0; i < this.tableData.length; i++) {
          var supplierName = this.tableData[i]['parts']
          // console.log(supplierName)
          if (!supplierName || supplierName.length === 0) {
            this.tableData[i]['parts'] = '-'
          } else {
            var suname = ''
            for (var j = 0; j < supplierName.length; j++) {
              if (j === supplierName.length - 1) {
                suname += supplierName[j]['partName']
              } else {
                suname += supplierName[j]['partName'] + '、'
              }
            }
            this.tableData[i]['parts'] = suname
          }

          // console.log(supplierName)
        }
        // console.log(this.tableData)
        this.pagination['pageSize'] = result['data']['pageSize']
        this.pagination['total'] = result['data']['count']
      } catch (err) {
        console.log(err)
      } finally {
        this.listLoading = false
        this.$refs.table.bodyWrapper.scrollTop = 0
      }
    },
    handleEdit(state = 'create', row) {
      if (state !== 'create') {
        this.$router.push({
          name: 'PartSupplierEdit',
          // 携带参数id,进入编辑页面
          params: {
            id: row.vnId
          }
        })
      } else {
        // 进入新增页面
        this.$router.push({ name: 'PartSupplierCreate' })
      }
    },
    // 修改备件类型状态
    async handleOperate(row, state) {
      // console.log(row)
      // 携带参数id,state
      const body = {
        state: state,
        vnId: row.vnId
      }
      try {
        await modifyPartSupplierState(body)
      } catch (e) {
        console.log(e)
      } finally {
        this.getList()
        this.$message({
          message: '操作成功',
          type: 'success'
        })
      }
    },
    currentChange(targetPage) {
      this.pagination['currentPage'] = targetPage
      this.getList(false, true)
    },
    // 分页跳转
    handleSizeChange(size) {
      this.pagination['pageSize'] = size
      this.pagination['currentPage'] = 1
      this.getList()
    }
  }
}

</script>

<style scoped>
  .el-pagination{
    margin-top: 30px;
  }
</style>
