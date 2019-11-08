<template style="height:100%">
  <el-container>
    <el-header>
      <el-row :gutter="20">
        <el-col :span="12" >
          <el-button
            type="primary"
            @click="$router.push('create')">新增账号</el-button>
          <el-button :type="!showCfFlag ?'primary':'success'" style="margin-left:15px" @click="showCf">只显示技工</el-button>
          <el-switch
            v-model="state"
            :active-value="0"
            :inactive-value="1"
            style="margin-left:15px"
            active-text="禁用账号"
            inactive-text="全部账号"/>
            <!-- <el-checkbox
            v-model="showCfFlag"
            style="margin-left:15px"
          >只显示技工</el-checkbox> -->
        </el-col>
        <el-col :span="4">
          <el-input
            v-model="searchObj['userName']"
            clearable
            placeholder="请输入用户名"
            @clear="getList(true)"
            @keyup.enter.native="getList(true)"/>
        </el-col>
        <el-col :span="4">
          <el-input
            v-model="searchObj['roleName']"
            clearable
            placeholder="请输入角色名"
            @clear="getList(true)"
            @keyup.enter.native="getList(true)"/>
        </el-col>
        <el-col :span="4">
          <el-input
            v-model="searchObj['dept']"
            clearable
            placeholder="请输入部门"
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
            :header-cell-style="()=>''"
            max-height="620"
            border
            style="width: 100%">
            <el-table-column
              align="center"
              label="序号"
              type="index"
              width="50"/>
            <el-table-column
              align="center"
              prop="fcd"
              label="注册时间"
              show-overflow-tooltip
              width="180"/>
            <el-table-column
              align="center"
              prop="userName"
              label="用户名"
              show-overflow-tooltip
              width="120"/>
            <el-table-column
              align="center"
              prop="realName"
              label="真实姓名"
              show-overflow-tooltip
              width="90"/>
            <el-table-column
              align="center"
              prop="phone"
              label="联系电话"
              show-overflow-tooltip
              width="160"/>
            <el-table-column
              align="center"
              prop="roleGroups"
              label="角色组"
              show-overflow-tooltip
              min-width="200">
              <template slot-scope="{row}">
                <div v-if="row.roleGroups">
                  <span v-for="(item, index) in row.roleGroups" :key="index">
                    {{ item ==='' ? '' :(index > 0) ?'、':'' }}{{ item }}
                  </span>
                </div>
                <span v-else>
                  （空）
                </span>

              </template>
            </el-table-column>
            <el-table-column
              align="center"
              prop="userDeptVos"
              label="部门职位"
              show-overflow-tooltip
              min-width="100">
              <template slot-scope="{row}">
                <div v-if="row.userDeptVos">
                  <span v-for="(item, index) in row.userDeptVos" :key="index">
                    {{ (index>0) ?'、':'' }}{{ item['deptName'] + '-' + item['job'] }}
                  </span>
                </div>
                <span v-else>
                  （空）
                </span>
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              prop="state"
              show-overflow-tooltip
              width="100"
              label="账号状态">
              <template slot-scope="{row}">
                <el-tag :type="row.state | accStatusFilter">
                  {{ row.state | accStatusNameFilter }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column
              fixed="right"
              align="center"
              width="260"
              label="操作选项"
            >
              <template slot-scope="scope">
                <el-button :disabled="isOperating" size="mini" type="primary" @click="seeDetails(scope.$index,scope.row)">编辑</el-button>
                <el-button :disabled="isOperating" size="mini" type="primary" @click="resetPwd(scope.row)">重置密码</el-button>
                <el-button
                  v-if="scope['row']['state'] == 1"
                  :disabled="isOperating"
                  size="mini"
                  type="danger"
                  @click="updateState(scope.row['userId'],0,scope.row['userName'])">禁用</el-button>
                <el-button
                  v-if="scope['row']['state'] == 0"
                  :disabled="isOperating"
                  size="mini"
                  type="success"
                  @click="updateState(scope.row['userId'],1,scope.row['userName'] )">启用</el-button>
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
import {
  tableStripeCallBack,
  tableHeaderStyleCallBack
} from '@/utils/style'

import { pageSizes } from '@/utils/globalConfig'

import {
  getUserList,
  updateUserState,
  resetPassword } from '@/api/mis/ums/account'

import {
  accStatusNameFilter,
  accStatusFilter } from '@/filter/ums/account'

import { mapGetters } from 'vuex'

export default {
  filters: {
    accStatusNameFilter,
    accStatusFilter
  },

  data() {
    return {
      pageSizes,
      showCfFlag: false,
      state: 1,
      isOperating: false,
      paginationData: {
        currentPage: 1,
        pageSize: 10,
        total: 0
      },
      isLoading: true,
      searchObj: {
        dept: '',
        roleName: '',
        userName: ''
      },
      realSearchObj: {
        dept: '',
        roleName: '',
        userName: ''
      },
      list: []
    }
  },
  computed: {
    ...mapGetters([
      'name',
      'userId'
    ])
  },
  watch: {
    state() {
      this.getList(true)
    }
  },
  created() {
  },
  async mounted() {
    this.getList()
    // this.resetPwd(1)
  },
  methods: {
    tableHeaderStyleCallBack,
    tableStripeCallBack,
    showCf() {
      this.showCfFlag = !this.showCfFlag
      this.getList(true)
    },
    async resetPwd(v) {
      try {
        await this.$confirm(`此操作将重置${v['userName']}的密码, 是否继续?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        const body = {
          userId: v['userId']
        }
        await resetPassword(body)
        this.$message({
          type: 'success',
          message: '重置成功!'
        })
      } catch (e) {
        console.log(e)
      }
    },
    back() {
      this.$router.push('/ums/user/create')
    },
    seeDetails(i, v) {
      console.log(i, v)
      this.$router.push('edit/' + v['userId'])
    },
    async updateState(userId, state, userName) {
      // updateUserState
      this.isOperating = true
      try {
        const data = {
          state,
          userId
        }
        await this.$confirm(`此操作将${state === 0 ? '禁用' : '启用'}${userName}, 是否继续?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        await updateUserState(data)
        this.$message({
          message: '操作成功！',
          type: 'success'
        })
        // console.log(r)
      } catch (e) {
        console.log(e)
      } finally {
        // console.log('ok')
        this.isOperating = false
        this.getList()
      }
    },
    async getList(search, jump) {
      try {
        this.isLoading = true
        const params = {
          pageNum: this.paginationData['currentPage'],
          pageSize: this.paginationData['pageSize']
          // userId: this.userId
        }
        if (this.state === 0) {
          params['state'] = 0
        }
        if (search) {
          this.realSearchObj = JSON.parse(JSON.stringify(this.searchObj))
          // this.realNameSearch['real'] = this.realNameSearch['search']
          this.paginationData['currentPage'] = 1
          params['pageNum'] = 1
        }
        if (!search || jump) {
          this.searchObj = JSON.parse(JSON.stringify(this.realSearchObj))
        }
        if (this.showCfFlag) {
          params['isCf'] = 1
        }
        params['userName'] = this.realSearchObj['userName']
        params['roleName'] = this.realSearchObj['roleName']
        params['deptName'] = this.realSearchObj['dept']
        const r = await getUserList(params)
        this.list = r['data']['list']
        this.paginationData['pageSize'] = r['data']['pageSize']
        this.paginationData['total'] = r['data']['count']
        // console.log(r)
      } catch (e) {
        console.log(e)
      } finally {
        this.$refs.table.bodyWrapper.scrollTop = 0
        this.isLoading = false
      }
    },
    currentChange(targetPage) {
      this.paginationData['currentPage'] = targetPage
      this.getList(false, true)
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

