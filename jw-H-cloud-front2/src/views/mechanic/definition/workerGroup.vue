<template>
  <el-container>
    <el-header>
      <el-row >
        <el-col :span="12">
          <el-button type="primary" @click="$router.push('addWorkerGroup')">
            新增工作组
          </el-button>
        </el-col>
        <el-col :span="6" :offset="6" >
          <el-input
            v-model="realNameSearch['search']"
            clearable
            placeholder="搜索"
            @clear="getList(true)"
            @keyup.enter.native="getList(true)">
            <el-button slot="append" icon="el-icon-search" @click="getList(true)"/>
          </el-input>
        </el-col>
      </el-row>
    </el-header>
    <!-- 定义工作组：工作组名称，说明，技工自行分配(下拉框(是/否)),选择主管 -->
    <el-main>
      <el-row>
        <el-col :span="24">
          <el-table
            v-loading="isLoading"
            ref="table"
            :data="list"
            :row-style="tableStripeCallBack"
            max-height="600"
            border
            style="width:100%">
            <el-table-column
              align="center"
              label="序号"
              type="index"
              width="80"
            />
            <el-table-column
              align="center"
              label="工作组名称"
              type="name"
              prop="name"
              min-width="35%"
            />
            <el-table-column
              align="center"
              label="工作组说明"
              type="description"
              prop="description"
              min-width="35%"
            />
            <el-table-column
              align="center"
              label="用户是否自分配"
              type="cfAssign"
              prop="cfAssign"
              min-width="35%"
            >
              <template slot-scope="{row}">
                <div>
                  {{ row.cfAssign=1?'是':'否' }}
                </div>
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              label="组员"
              type="worker"
              prop="admin"
              min-width="35%"
              show-overflow-tooltip
            >
              <template slot-scope="{row}">
                <div v-if="row.users">
                  <span v-for="(item,index) in row.users" :key="index">
                    {{ item.userName===""?'':(index>0)?' 、':"" }}{{ item.userName }}
                  </span>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              label="主管"
              type="admin"
              min-width="35%"
            >
              <template slot-scope="{row}">
                <div v-if="row.users">
                  <span v-for="(item,index) in row.users" :key="index">
                    {{ item.isSup===1?item.userName:'' }}
                  </span>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              fixed="right"
              align="center"
              label="操作选项"
              min-width="25%"
            >
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                  <!-- <el-button type="danger" >停用</el-button> -->
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
  groupList// 工种选项
} from '@/api/mechanic/mechainc'
import { pageSizes } from '@/utils/globalConfig'
import { tableStripeCallBack } from '@/utils/style'
export default {
  data() {
    return {
      pageSizes,
      isLoading: true,
      paginationData: {
        currentPage: 1,
        pageSize: 10,
        total: 0
      },
      realNameSearch: {
        real: '',
        search: ''
      },
      list: []
    }
  },
  async mounted() {
    window.sessionStorage.removeItem('paramsData')
    this.getList()
  },
  methods: {
    // 表格隔行颜色
    tableStripeCallBack,
    handleEdit(index, row) {
      window.sessionStorage.setItem('paramsData', JSON.stringify(row))
      this.$router.push({ name: 'addWorkerGroup', params: { row: row }})
    },
    async  getList(search, jump) {
      try {
        this.isLoading = true
        const params = {
          pageNum: this.paginationData['currentPage'],
          pageSize: this.paginationData['pageSize']
          // userId: this.userId
        }
        if (search) {
          this.realNameSearch['real'] = this.realNameSearch['search']
          this.paginationData['currentPage'] = 1
          params['pageNum'] = 1
        }
        if (jump) {
          this.realNameSearch['search'] = this.realNameSearch['real']
        }
        if (!search) {
          this.realNameSearch['search'] = this.realNameSearch['real']
        }
        params['name'] = this.realNameSearch['real']
        // console.log(params)
        const r = await groupList(params)
        this.list = r['data'].list
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
