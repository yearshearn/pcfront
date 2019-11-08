<template style="height:100%">
  <el-container style="padding-top:30px;">
    <el-header height="5%">
      <el-form label-position="right">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item label="问卷类型:" label-width="90px">
              <el-select v-model="queType" placeholder="请选择问卷类型" clearable @change="getList">
                <el-option key="定期" label="定期" value="定期">定期</el-option>
                <el-option key="长期" label="长期" value="长期">长期</el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :offset="10" :span="6">
            <el-input
              v-model="search"
              placeholder="请输入问卷名称或问卷编码"
              @keyup.enter.native="getList(true)"
            >
              <el-button slot="append" icon="el-icon-search" @click="getList(true)"/>
            </el-input>
          </el-col>
          <el-col :span="2">
            <el-button @click="$router.push('/contract/newlyBuild/newQuestionnaire')">创建问卷</el-button>
          </el-col>
        </el-row>
      </el-form>
    </el-header>
    <!-- Main content -->
    <el-main>
      <el-table
        v-loading="listLoading"
        ref="table"
        :data="lists"
        :row-style="tableStripeCallBack"
        fit
        max-height="618"
        element-loading-text="数据加载中..."
      >
        <el-table-column
          align="center"
          prop="queId"
          label="问卷编码"
          min-width="20%"/>
        <el-table-column
          align="center"
          prop="queName"
          label="问卷名称"
          show-overflow-tooltip
          min-width="20%"/>
        <el-table-column
          align="center"
          prop="queType"
          label="问卷类型"
          show-overflow-tooltip
          min-width="20%"/>
        <el-table-column
          align="center"
          prop="isValid"
          label="是否生效"
          width="100"
        >
          <template slot-scope="{row}">
            <el-tag :type="row.isValid | isValidFilter">
              {{ row.isValid | isValidNameFilter }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          prop="operationDaytime"
          label="更改时间"
          min-width="20%"/>

        <el-table-column
          fixed="right"
          align="center"
          width="200"
          label="操作"
        >
          <template slot-scope="scope">
            <el-button
              size="mini"
              @click="seeDetails(scope.$index,scope.row)"
            >查看详情</el-button>
            <el-button
              v-if="scope['row']['isValid'] !== 1"
              size="mini"
              type="danger"
              @click="deleteQue(scope.row)"
            >删除</el-button>
          </template>
        </el-table-column>
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
import { pageSizes } from '@/utils/globalConfig'

import { tableStripeCallBack } from '@/utils/style'

import { getQuestionnairesList, deleteQuestionnaire } from '@/api/contract'

import { isValidFilter, isValidNameFilter } from '@/filter/contract'

export default {
  name: 'ContractList',
  filters: {
    isValidFilter, isValidNameFilter
  },
  data() {
    return {
      pageSizes,
      // 问卷类型
      queType: '',
      lists: [],
      str: '',
      listLoading: true,
      search: '',
      realSearch: '',
      paginationData: {
        currentPage: 1,
        pageSize: 10,
        total: 0
      }
    }
  },
  created() {
  },
  async mounted() {
    this.getList()
  },
  methods: {
    // 表格隔行颜色
    tableStripeCallBack,
    // 查看列表
    async getList(search, jump) {
      this.listLoading = true
      try {
        const params = {
          pageCurrent: this.paginationData['currentPage'],
          pagesize: this.paginationData['pageSize'],
          solr: '',
          queType: this.queType
        }
        if (search) {
          params['pageCurrent'] = 1
          this.realSearch = this.search
        }
        if (jump) {
          this.search = this.realSearch
        }
        params['solr'] = this.realSearch
        const r = await getQuestionnairesList(params)
        this.lists = (r['data']['records']).reverse()
        this.paginationData = {
          currentPage: r['data']['pageCurrent'],
          pageSize: r['data']['pageSize'],
          total: r['data']['rowCount']
        }
        // console.log(this.lists)
      } catch (e) {
        console.log(e)
      } finally {
        this.listLoading = false
        this.$refs.table.bodyWrapper.scrollTop = 0
      }
    },
    // 查看详情
    seeDetails(i, v) {
      const queId = v.queId
      this.$router.push('/contract/questionnaire/details/' + queId)
    },
    // 分页跳转
    currentChange(targetPage) {
      this.paginationData['currentPage'] = targetPage
      this.getList(false, true)
    },
    // 分页跳转
    handleSizeChange(size) {
      this.paginationData['pageSize'] = size
      this.paginationData['currentPage'] = 1
      this.getList()
    },
    // 删除问卷
    async deleteQue(v) {
      const data = {
        queId: v['queId'],
        isValid: v['isValid']
      }
      try {
        await deleteQuestionnaire(data)
        this.$message({
          message: '删除成功！',
          type: 'success'
        })
      } catch (e) {
        console.log(e)
      } finally {
        this.getList()
      }
    }
  }
}
</script>

<style scoped>
  .el-pagination{
    margin-top: 30px;
  }
</style>
