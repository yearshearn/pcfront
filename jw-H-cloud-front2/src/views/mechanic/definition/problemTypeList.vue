<template>
  <el-container>
    <el-header>
      <el-row :span="12">
        <el-col>
          <el-button type="primary" @click="$router.push('addProblemType')">
            新增问题类型
          </el-button>
        </el-col>
      </el-row>
    </el-header>
    <el-main>
      <el-row>
        <el-col :span="24">
          <el-table
            v-loading="isLoading"
            ref="table"
            :row-style="tableStripeCallBack"
            :data="list"
            max-height="600"
            border
            style="width:100%">
            <el-table-column
              align="center"
              label="序号"
              type="index"
              width="80"/>
            <el-table-column
              align="center"
              label="问题类型名称"
              type=""
              prop="name"
              min-width="30%"/>
            <el-table-column
              align="center"
              label="问题类型说明"
              type=""
              prop="description"
              min-width="30%"/>
            <el-table-column
              align="center"
              label="问题分类"
              type=""
              prop="sortId"
              min-width="30%"/>
            <el-table-column
              align="center"
              label="所属工种"
              show-overflow-tooltip
              type=""
              prop="name"
              min-width="30%">
              <template slot-scope="{row}">
                <div v-if="row.professions">
                  <span v-for="(item,index) in row.professions" :key="index">
                    {{ item.name===''?'':(index>0) ? '、':"" }}{{ item.name }}
                  </span>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              label="预估小时"
              type=""
              prop="predictHour"
              min-width="25%"/>
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
                <el-button
                  v-if="scope.row.state==1"
                  :disabled="isOperating"
                  size="mini"
                  type="danger"
                  @click="typeBtn(scope.row.id,0)"
                >停用</el-button>
                <el-button
                  v-if="scope.row.state==0"
                  :disabled="isOperating"
                  size="mini"
                  type="success"
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
  problemClassList, // 问题类型列表
  btnProblem// 启用禁用问题类型状态
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
      window.sessionStorage.setItem('paramsData', JSON.stringify(row))
      this.$router.push({ name: 'addProblemType', params: { row: row }})
    },
    async getList(search, jump) {
      try {
        this.isLoading = true
        const params = {
          pageNum: this.paginationData['currentPage'],
          pageSize: this.paginationData['pageSize']
        }
        const r = await problemClassList(params)
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
        console.log()
        await btnProblem(data)
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

