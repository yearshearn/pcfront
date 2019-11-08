<template style="height:100%">
  <el-container>
    <el-header>
      <el-row>
        <el-col :span="6">
          <el-button
            type="primary"
            @click="$router.push('create')">新增角色</el-button>
        </el-col>
        <el-col :span="6" :offset="12" >
          <el-input
            v-model="search['search']"
            clearable
            placeholder="搜索"
            @clear="getList(true)"
            @keyup.enter.native="getList(true)">
            <el-button slot="append" icon="el-icon-search" @click="getList(true)"/>
          </el-input>
        </el-col>
      </el-row>
    </el-header>
    <el-main>
      <el-row>
        <el-col :span="24">
          <el-table
            v-loading="isLoading"
            ref="table"
            :data="list"
            :row-style="tableStripeCallBack"
            border
            max-height="620"
            align="center"
            style="width: 100%">
            <el-table-column
              label="序号"
              type="index"
              align="center"
              width="50"/>
            <el-table-column
              prop="roleName"
              label="角色名称"
              align="center"
              show-overflow-tooltip
              min-width="15%"/>
            <el-table-column
              prop="description"
              label="权限"
              align="center"
              show-overflow-tooltip
              min-width="15%"/>
            <el-table-column
              align="center"
              prop="state"
              show-overflow-tooltip
              width="100"
              label="角色状态">
              <template slot-scope="{row}">
                <el-tag :type="row.state | roleStatusFilter">
                  {{ row.state | roleStatusNameFilter }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column
              fixed="right"
              align="center"
              width="250"
              label="操作选项"
            >
              <template slot-scope="scope">
                <el-button :disabled="isOperating" size="mini" type="primary" @click="seeDetails(scope.$index,scope.row)">编辑</el-button>
                <el-button
                  v-if="scope['row']['state'] == 0"
                  :disabled="isOperating"
                  size="mini"
                  type="success"
                  @click="updateState(scope.row['roleId'],1)">启用
                </el-button>
                <el-button
                  v-else
                  :disabled="isOperating"
                  size="mini"
                  type="danger"
                  @click="updateState(scope.row['roleId'],0)">禁用
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>
      <el-row style="text-align:center">
        <el-col :span="24">
          <el-pagination
            :current-page="paginationData['currentPage']"
            :page-size="paginationData['pageSize']"
            :page-sizes="pageSizes"
            :total="paginationData['total']"
            style="padding-top:10px"
            layout="total, sizes, prev, pager, next, jumper"
            @size-change="handleSizeChange"
            @current-change="currentChange"/>
        </el-col>
      </el-row>
    </el-main>
  </el-container>
</template>

<script>
import { pageSizes } from '@/utils/globalConfig'

import { tableStripeCallBack } from '@/utils/style'

import { getRoleList, updateRoleState } from '@/api/mis/ums/role'

import { roleStatusFilter, roleStatusNameFilter } from '@/filter/ums/role'

export default {
  filters: {
    roleStatusFilter, roleStatusNameFilter
  },
  data() {
    return {
      pageSizes,
      isOperating: false,
      search: {
        real: '',
        search: ''
      },
      list: [],
      isLoading: false,
      paginationData: {
        currentPage: 1,
        pageSize: 10,
        total: 0
      }
    }
  },
  watch: {

  },
  created() {
  },
  async mounted() {
    this.getList()
  },
  methods: {
    // 表格隔行颜色
    tableStripeCallBack,
    async updateState(roleId, state) {
      this.isOperating = true
      try {
        const data = { roleId, state }
        await updateRoleState(data)
        this.$message({
          message: '操作成功！',
          type: 'success'
        })
      } catch (e) {
        console.log(e)
      } finally {
        this.isOperating = false
        this.getList()
      }
    },
    async getList(search, jump) {
      this.isLoading = true
      try {
        const params = {
          pageNum: this.paginationData['currentPage'],
          pageSize: this.paginationData['pageSize']
        }
        if (search) {
          this.search['real'] = this.search['search']
          params['pageNum'] = 1
        }
        if (jump) {
          this.search['search'] = this.search['real']
        }
        params['roleName'] = this.search['real']
        const r = await getRoleList(params)
        this.list = r['data']['list']
        this.paginationData['pageSize'] = r['data']['pageSize']
        this.paginationData['total'] = r['data']['count']
      } catch (e) {
        console.log(e)
      } finally {
        this.$refs.table.bodyWrapper.scrollTop = 0
        this.isLoading = false
      }
    },
    currentChange(targetPage) {
      console.log(this)
      this.paginationData['currentPage'] = targetPage
      this.getList(false, true)
    },
    back() {
      this.$router.push('/ums/role/create')
    },
    seeDetails(i, v) {
      console.log(v['roleId'])
      this.$router.push('edit/' + v['roleId'])
    },
    handleSizeChange(size) {
      this.paginationData['pageSize'] = size
      this.paginationData['currentPage'] = 1
      this.getList()
    }
  }
}
</script>

<style lang="scss" scoped>
  .el-container{
    padding:30px;
  }
</style>
