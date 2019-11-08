<template>
  <el-container>
    <el-header>
      <el-row :span="12">
        <el-button type="primary" @click="$router.push('addQuestionClass')">
          新增问题分类
        </el-button>
      </el-row>
    </el-header>
    <el-main>
      <el-row >
        <el-col :span="24" >
          <el-table
            v-loading="isLoading"
            ref="table"
            :row-style="tableStripeCallBack"
            :data="list"
            max-height="600"
            border
            style="width:100%" >
            <el-table-column
              align="center"
              label="序号"
              type="index"
              width="80"
            />
            <el-table-column
              align="center"
              label="问题分类名称"
              type=""
              prop="name"
              min-width="50%"
            />
            <el-table-column
              align="center"
              label="问题分类说明"
              type=""
              prop="description"
              min-width="50%"
            />
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
                <el-button
                  v-if="scope.row.state==1"
                  :disabled="isOperating"
                  type="danger"
                  size="mini"
                  @click="typeBtn(scope.row.id,0)"
                >停用</el-button>
                <el-button
                  v-if="scope.row.state==0"
                  :disabled="isOperating"
                  type="success"
                  size="mini"
                  @click="typeBtn(scope.row.id,1)"
                >启用</el-button>
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
  getProblemTypeList, // 问题分类列表
  btnType // 停用0/启用1状态
} from '@/api/mechanic/mechainc'

import { pageSizes } from '@/utils/globalConfig'

import { tableStripeCallBack } from '@/utils/style'
export default {
  data() {
    return {
      pageSizes,
      isLoading: true,
      list: [],
      isOperating: false,
      paginationData: {
        currentPage: 1,
        pageSize: 10,
        total: 0
      },
      realNameSearch: {
        real: '',
        search: ''
      }
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
      // console.log(row)// row中就包含了你点击的那一行的数据
      // 这里的jur_name是我自己通过Ajax请求后台的数据的来的，你们的根据自己的定。
      window.sessionStorage.setItem('paramsData', JSON.stringify(row))
      this.$router.push({ name: 'addQuestionClass', params: { row: row }})
    },
    async getList(search, jump) {
      try {
        this.isLoading = true
        const params = {
          pageNum: this.paginationData['currentPage'],
          pageSize: this.paginationData['pageSize']
          // userId: this.userId
        }
        const r = await getProblemTypeList(params)
        // console.log(r['data'])
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
    async typeBtn(fid, fstate) {
      this.isOperating = true
      try {
        const data = { id: fid, state: fstate }
        await btnType(data)
        this.$message({
          message: '操作成功',
          type: 'success'
        })
      } catch (e) {
        console.log(e)
      } finally {
        this.isOperating = false
        this.getList()
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
