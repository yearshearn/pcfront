<template>
  <el-container>
    <el-header>
      <el-row>
        <el-col>
          <el-button type="primary" @click="$router.push('addtypeWork')">
            新增工种
          </el-button>
        </el-col>
      </el-row>
    </el-header>
    <!-- 定义工种： 工种名称，说明，每天工作小时，小时费率，加班费率，双倍费率 -->
    <el-main>
      <el-row>
        <el-col :span="24">
          <el-table
            v-loading="isloading"
            ref="table"
            :data="list"
            :row-style="tableStripeCallBack"
            max-height="600"
            border
            style="width:100%"
          >
            <el-table-column
              align="center"
              label="序号"
              type="index"
              width="80"
            />
            <el-table-column
              align="center"
              label="工种名称"
              type=""
              prop="name"
              min-width="30%"/>
            <el-table-column
              align="center"
              label="工种说明"
              type=""
              prop="description"
              min-width="30%"/>
            <el-table-column
              align="center"
              label="每天工作小时"
              type=""
              prop="hour"
              min-width="25%"/>
            <el-table-column
              align="center"
              label="小时费率"
              type=""
              prop="hourlyRate"
              min-width="25%"/>
            <el-table-column
              align="center"
              label="加班费率"
              type=""
              prop="overtimeRate"
              min-width="25%"/>
            <el-table-column
              align="center"
              label="双倍费率"
              type=""
              prop="doubleRate"
              min-width="25%"/>
            <el-table-column
              align="center"
              label="问题类型"
              show-overflow-tooltip
              type=""
              prop="name"
              min-width="30%">
              <template slot-scope="{row}">
                <div v-if="row.problemTypes">
                  <span v-for="(item,index) in row.problemTypes" :key="index">
                    {{ item.name===''?'':(index>0) ? '、':"" }}{{ item.name }}
                  </span>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              fixed="right"
              label="操作选项"
              align="center"
              min-width="25%"
            >
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
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
<style>
.el-container{
    padding:30px;
  }
</style>

<script>
import {
  typeWorkList// 列表

} from '@/api/mechanic/mechainc'

import { pageSizes } from '@/utils/globalConfig'

import { tableStripeCallBack } from '@/utils/style'

export default {
  data() {
    return {
      pageSizes,
      mustval: {
        name: '', // 工种名称
        hour: '', // 每天工作小时
        description: '', // 说明
        hourlyRate: '', // 小时费率
        overtimeRate: '', // 加班费率
        doubleRate: ''// 双倍费率
      },
      list: [],
      paginationData: {
        currentPage: 1,
        pageSize: 10,
        total: 0
      },
      realNameSearch: {
        real: '',
        search: ''
      },
      isloading: false
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
      // 这里的jur_name是我自己通过Ajax请求后台的数据的来的，你们的根据自己的定。
      window.sessionStorage.setItem('paramsData', JSON.stringify(row))
      this.$router.push({ name: 'addtypeWork', params: { row: row }})
    },
    async getList(search, jump) {
      try {
        this.isloading = true
        const params = {
          pageNum: this.paginationData['currentPage'],
          pageSize: this.paginationData['pageSize']
          // userId: this.userId
        }
        const r = await typeWorkList(params)
        this.list = r['data'].list
        this.paginationData['pageSize'] = r['data']['pageSize']
        this.paginationData['total'] = r['data']['count']
      } catch (e) {
        console.log(e)
      } finally {
        this.$refs.table.bodyWrapper.scrollTop = 0
        this.isloading = false
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
