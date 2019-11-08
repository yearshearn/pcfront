<template style="height:100%">
  <el-container>
    <el-header style="margin-top:30px;">
      <el-form label-position="right">
        <el-row :gutter="15">
          <el-col :span="8">
            <el-button class="filter-item" type="" @click="handleEdit('create')">新增备件类别</el-button>
            <el-switch
              v-model="state"
              :active-value="0"
              :inactive-value="1"
              style="margin-left:15px"
              active-text="禁用"
              inactive-text="全部"/>
          </el-col>
          <el-col :span="4" :offset="12">
            <el-input
              v-model="realNameSearch['search']"
              placeholder="请输入备件类别名称"
              clearable
              @clear="_getPartTypeList(true)"
              @keyup.enter.native="_getPartTypeList(true)"
            >
              <el-button slot="append" icon="el-icon-search" @click="_getPartTypeList(true)"/>
            </el-input>
          </el-col>

        </el-row>
      </el-form>
    </el-header>
    <el-main height="95%">
      <el-table
        v-loading="listLoading"
        ref="table"
        :data="tableData"
        :row-style="tableStripeCallBack"
        element-loading-text="数据加载中..."
        fit
        highlight-current-row
        max-height="618"
        style="width: 100%"
      >
        <el-table-column type="index" label="序号" width="200" align="center"/>
        <el-table-column align="center" prop="name" show-overflow-tooltip label="备件类别名称" />
        <el-table-column label="状态" class-name="status-col" width="200" prop="state" >
          <template slot-scope="{row}">
            <el-tag :type="row.state | typeFilter">{{ row.state | stateFilter }}</el-tag>
          </template>
        </el-table-column>
        <!-- <el-table-column align="center" prop="fcd" show-overflow-tooltip label="创建时间" /> -->
        <!-- <el-table-column align="center" prop="description" show-overflow-tooltip label="类型描述" /> -->
        <el-table-column
          fixed="right"
          label="操作"
          align="center"
          width="400"
          class-name="small-padding fixed-width"
        >
          <template slot-scope="{row}">
            <el-button size="mini" type="primary" @click="handleEdit('edit', row)">编辑</el-button>
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
            >禁用</el-button>
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

import { getPartTypeList, modifyPartTypeState } from '@/api/part'

import { stateFilter, typeFilter } from '@/filter/state'

export default {
  name: 'PartTypeList',
  components: {},
  filters: {
    stateFilter,
    typeFilter
  },
  props: {},
  data() {
    return {
      pageSizes,
      listLoading: true,
      state: 1,
      tableData: [],
      pagination: {
        currentPage: 1,
        pageSize: 10,
        total: 0
      },
      hideSinglePage: false,
      realNameSearch: {
        real: '',
        search: ''
      }
    }
  },
  computed: {},
  watch: {
    state() {
      this._getPartTypeList(true)
    }
  },
  created() {
    this._getPartTypeList()
  },
  async mounted() { },
  methods: {
    // 表格隔行颜色
    tableStripeCallBack,
    handleEdit(state = 'create', row) {
      if (state !== 'create') {
        this.$router.push({
          name: 'PartTypeEdit',
          // 携带参数id,进入编辑页面
          params: {
            id: row.ptCatId
          }
        })
      } else {
        // 进入新增页面
        this.$router.push({ name: 'PartTypeCreate' })
      }
    },
    //  请求数据
    async _getPartTypeList(search, jump) {
      try {
        const params = {
          pageNum: this.pagination['currentPage'],
          pageSize: this.pagination['pageSize']
        }
        if (this.state === 0) {
          params['state'] = 0
        }
        if (search) {
          // console.log(this.realNameSearch)
          this.realNameSearch['real'] = this.realNameSearch['search']
          this.pagination['currentPage'] = 1
          params['pageNum'] = 1
        }
        if (jump) {
          this.realNameSearch['search'] = this.realNameSearch['real']
        }
        if (!search) {
          this.realNameSearch['search'] = this.realNameSearch['real']
        }
        if (this.realNameSearch['real']) {
          params['name'] = this.realNameSearch['real']
        }
        this.listLoading = true
        const result = await getPartTypeList(params)
        //   const listData = result.data.list
        //   listData.sort(function(b, a) {
        //     return Date.parse(a.fcd) - Date.parse(b.fcd)
        //   })
        this.tableData = result.data.list
        // console.log(this.tableData)
        this.pagination['pageSize'] = result['data']['pageSize']
        this.pagination['total'] = result['data']['count']
      } catch (error) {
        console.log(error)
      } finally {
        this.listLoading = false
        this.$refs.table.bodyWrapper.scrollTop = 0
      }
    },
    // 修改备件类型状态
    async handleOperate(row, state) {
      // console.log(row)
      // 携带参数id,state
      const body = {
        state: state,
        ptCatId: row.ptCatId
      }
      try {
        await modifyPartTypeState(body)
      } catch (e) {
        console.log(e)
      } finally {
        this._getPartTypeList()
        this.$message({
          message: '操作成功',
          type: 'success'
        })
      }
    },
    currentChange(targetPage) {
      this.pagination['currentPage'] = targetPage
      this._getPartTypeList(false, true)
    },
    // 分页跳转
    handleSizeChange(size) {
      this.pagination['pageSize'] = size
      this.pagination['currentPage'] = 1
      this._getPartTypeList()
    }
  }
}
</script>

<style scoped>
  .el-pagination{
    margin-top: 30px;
  }
</style>
