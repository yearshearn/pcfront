<template style="height:100%">
  <el-container style="padding:30px">
    <el-header>
      <el-row>
        <el-col :span="12">
          <el-select
            v-model="status"
            clearable
            placeholder="点击筛选">
            <el-option
              v-for="item in statusOptions"
              :key="item.value"
              :label="item.value"
              :value="item.value"/>
          </el-select>
        </el-col>
        <el-col :span="6" :offset="2" >
          <el-input
            v-model="realNameSearch['search']"
            clearable
            placeholder="搜索"
            @clear="getList(true)"
            @keyup.enter.native="getList(true)">
            <el-button slot="append" icon="el-icon-search" @click="getList(true)"/>
          </el-input>
        </el-col>
        <el-col :span="4" style="text-align:center">
          <el-button
            @click="$router.push('list/create')"
          >新增问题</el-button>
          <el-button
            @click="exportToExcel"
          >导出 </el-button>
        </el-col>
      </el-row>
    </el-header>
    <el-main>
      <el-row>
        <el-col :span="24">
          <!-- <el-card>  -->
          <el-table
            v-loading="isLoading"
            ref="table"
            :data="list"
            :row-style="tableStripeCallBack"
            border
            max-height="600"
            style="width: 100%"
            @sort-change="handleSortChange"
            @selection-change="handleSelectionChange"
            @filter-change="handleFilterChange">
            <el-table-column
              fixed="left"
              align="center"
              label="序号"
              type="index"
              width="50"/>
            <el-table-column
              fixed="left"
              align="center"
              sortable="custom"
              prop="wrId"
              label="工单编号"
              show-overflow-tooltip
              width="180"/>
            <el-table-column
              align="center"
              prop="location"
              label="地点"
              show-overflow-tooltip
              width="120"/>
            <el-table-column
              align="center"
              prop="description"
              label="说明"
              show-overflow-tooltip
              width="90"/>
            <el-table-column
              :filters="enumerationVal['repairTypeOptions']"
              column-key="repairType"
              align="center"
              prop="repairType"
              label="维修类型"
              show-overflow-tooltip
              width="120"/>
            <el-table-column
              :filters="enumerationVal['probTypeOptions']"
              column-key="probType"
              align="center"
              prop="probTypeName"
              label="问题类型"
              show-overflow-tooltip
              width="120"/>
            <el-table-column
              align="center"
              prop="wrStatus"
              label="状态"
              show-overflow-tooltip
              width="120"/>
            <el-table-column
              :filters="enumerationVal['cfIdOptions']"
              column-key="cfId"
              align="center"
              label="指派给到"
              show-overflow-tooltip
              width="120">
              <template
                slot-scope = "{row}"
              >
                <span
                  @click="handlerCellClick(row)"
                >
                  <el-link> {{ row.cfName }}
                    <!-- <i class="el-icon-view el-icon--right"/> -->
                  </el-link>
                </span>
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              prop="requestor"
              label="提出问题者"
              show-overflow-tooltip
              width="120"/>
            <el-table-column
              align="center"
              prop="eqId"
              label="所属设备"
              show-overflow-tooltip
              width="90"/>
            <el-table-column
              align="center"
              prop="workTpye"
              label="工种"
              show-overflow-tooltip
              width="90"/>
            <el-table-column
              :filters="enumerationVal['reworkOptions']"
              align="center"
              prop="rework"
              column-key="rework"
              label="返修"
              show-overflow-tooltip
              width="90"/>
            <el-table-column
              align="center"
              prop="priority"
              label="优先级"
              show-overflow-tooltip
              width="90"/>
            <el-table-column
              align="center"
              prop="document"
              label="附加文档"
              show-overflow-tooltip
              width="90">
              <template slot-scope="{row}">
                <span v-if="!row['hasFiles']">无</span>
                <el-link
                  v-if="row['hasFiles']"
                  type="primary"
                  @click="downloadFile(row)">下载</el-link>
              </template>
            </el-table-column>
            <el-table-column
              sortable="custom"
              align="center"
              prop="dateAssigned"
              label="排程时间"
              show-overflow-tooltip
              width="180"/>
            <el-table-column
              sortable="custom"
              align="center"
              prop="dateRequested"
              label="开始时间"
              show-overflow-tooltip
              width="180"/>
            <el-table-column
              sortable="custom"
              align="center"
              prop="dateCompleted"
              label="完成时间"
              show-overflow-tooltip
              width="180"/>
            <el-table-column
              fixed="right"
              align="center"
              width="240"
              label="操作选项"
            >
              <template slot-scope="scope">
                <el-button
                  v-if="scope.row.wrStatus === '普单-未分配' || scope.row.wrStatus === '疑单-未分配' "
                  :disabled="isOperating"
                  size="mini"
                  type="primary"
                  @click="seeDetails(scope.row)">编辑</el-button>
                <el-button
                  v-if="scope.row.wrStatus === '普单-未分配' || scope.row.wrStatus === '疑单-未分配' "
                  :disabled="isOperating"
                  size="mini"
                  type="primary"
                  @click="showAssignToCf(scope.row)">指派</el-button>
                <el-button
                  v-if="scope.row.wrStatus === '普单-未分配' || scope.row.wrStatus === '疑单-未分配' || scope.row.wrStatus === '普单-未完成' || scope.row.wrStatus === '疑单-未完成' "
                  :disabled="isOperating"
                  size="mini"
                  type="primary"
                  @click="deleteWr(scope.row.wrId)">取消</el-button>
                <el-button
                  v-if="scope.row.wrStatus === '普单-已完成' || scope.row.wrStatus === '疑单-已完成' "
                  :disabled="isOperating"
                  size="mini"
                  type="primary"
                  @click="closeWr(scope.row)">关闭</el-button>
              </template>
            </el-table-column>
          </el-table>
          <!-- </el-card> -->
        </el-col>
      </el-row>
      <el-row style="text-align:center">
        <el-col :span="24">
          <el-pagination
            :disabled="isLoading"
            :page-sizes="pageSizes"
            :current-page="paginationData['currentPage']"
            :page-size="paginationData['pageSize']"
            :total="paginationData['total']"
            style="padding-top:10px"
            layout="total, sizes, prev, pager, next, jumper"
            @size-change="handleSizeChange"
            @current-change="currentChange"/>
        </el-col>
      </el-row>
      <CfDetails
        :close-cf-dialog = "closeCfDialog"
        :wr-id="targetWrId"
        :cf-name="cfName"
        :cf-id="cfId"
        :dialog-visible-flag="cfDialogVisibleFlag"
      />
      <AssignToCf
        :show-flag="assignToCfFlag"
        :cf-id="assignTo['cfId']"
        :wr-id="assignTo['wrId']"
        :wr-status="assignTo['wrStatus']"
        :close-dialog="closeDialog"
      />
    </el-main>
  </el-container>
</template>

<script>
import { humpTransformToUnderline, customUriEncode } from '@/utils'

import { default as CfDetails } from '../dialog/cfDetails'

import { default as AssignToCf } from '../dialog/assignToCf'

import qs from 'qs'

import { exportToExcel } from '@/api/utils'

import { tableStripeCallBack } from '@/utils/style'

import {
  getWorkorderList,
  getCfList,
  deleteWrs,
  closeWrs
} from '@/api/workorder/list'

import {
  getProblemOptions
} from '@/api/enumeration'

import { mapGetters } from 'vuex'

import { getToken } from '@/utils/auth'

import {
  repairType as repairTypeOptions,
  priority as priorityOptions
} from '@/utils/enumerationList/workorder'

import { pageSizes } from '@/utils/globalConfig'

export default {
  components: {
    CfDetails,
    AssignToCf
  },
  filters: {

  },

  data() {
    return {
      pageSizes,
      cfName: '',
      cfId: '',
      enumerationVal: {
        repairTypeOptions,
        priorityOptions,
        probTypeOptions: [],
        cfIdOptions: [],
        requestorOptions: [],
        teamgroupOptions: [],
        reworkOptions: [
          {
            value: '是',
            text: '是'
          }, {
            value: '否',
            text: '否'
          }
        ]
      },
      sort: '',
      sortFiled: '',
      assignTo: {
        wrId: '',
        cfName: '',
        wrStatus: '',
        cfId: ''
      },
      assignToCfFlag: false,
      statusOptions: [
        {
          value: '普单-未分配'
        },
        {
          value: '普单-未完成'
        },
        {
          value: '普单-已完成'
        },
        {
          value: '疑单-未分配'
        },
        {
          value: '疑单-未完成'
        },
        {
          value: '疑单-已完成'
        }
      ],
      targetWrId: '',
      cfDialogVisibleFlag: false,
      status: '',
      isOperating: false,
      paginationData: {
        currentPage: 1,
        pageSize: 10,
        total: 0
      },
      isLoading: true,
      realNameSearch: {
        real: '',
        search: ''
      },
      list: [],
      filterObj: {
        repair_type: [],
        prob_type: [],
        cf_id: [],
        requestor: [],
        work_team_id: [],
        rework: []
      }
    }
  },
  computed: {
    baseUrl() {
      return process.env.BASE_API
    },
    ...mapGetters([
      'name',
      'userId'
    ]),
    repairTypeFilters() {
      const arr = []
      for (let i = 0; i < 100; i++) {
        arr.push({
          value: i,
          text: i + ''
        })
      }
      return arr
    },
    filtersDataString() {
      const data = JSON.parse(JSON.stringify(this.filterObj))
      const targetData = {}
      for (const key in data) {
        if (data[key].length !== 0) {
          targetData[key] = data[key]
        }
      }
      // console.log(targetData)
      // return targetData
      return encodeURI(JSON.stringify(targetData))
    }
  },
  watch: {
    status() {
      this.getList(true)
    }
  },
  created() {
  },
  async mounted() {
    this.getList()
    this.getCfList()
    this.getProblemOptions()
  },
  methods: {
    // 表格隔行颜色
    tableStripeCallBack,
    async exportToExcel() {
      // const data = {
      //   baseUrl: '\/wr\/findAllWr',
      //   queryObj: {
      //     keyWords: this.realNameSearch['real'],
      //     userId: this.userId,
      //     status: this.status,
      //     field: this.sortFiled || 'date_assigned',
      //     sort: this.sort || 'desc',
      //     pageSize: 999999,
      //     pageCurrent: 1,
      //     screen: encodeURI(this.filtersDataString),
      //     authorization: getToken()
      //   }
      // }
      let url = `;;/wr/findAllWr\?${qs.stringify({
        keyWords: this.realNameSearch['real'],
        userId: this.userId,
        status: this.status,
        field: this.sortFiled || 'date_assigned',
        sort: this.sort || 'desc',
        pageSize: 999999,
        pageCurrent: 1,
        authorization: getToken()
      })}`
      url += `&screen=${encodeURI(this.filtersDataString)};;`
      // console.log(customUriEncode(temp, '/'))
      window.open(`${this.baseUrl}/wr/exportExcel?projectName=wr&url=${url}&authorization=${getToken()}`)
    },
    async getProblemOptions() {
      try {
        const params = {
          pageSize: 9999
        }
        const r = await getProblemOptions(params)
        this.enumerationVal['probTypeOptions'] = r['data'].map(i => {
          return {
            text: i['name'],
            value: i['id']
          }
        })
        console.log(r)
      } catch (e) {
        this.enumerationVal['probTypeOptions'] = []
        console.log(e)
      }
    },
    async closeWr(data) {
      this.isOperating = true
      try {
        await this.$confirm(`是否要关闭工单：${data['wrId']}`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        const body = {
          ids: [data['wrId']]
        }
        await closeWrs(body)
        this.$message({
          message: '操作成功！',
          type: 'success'
        })
      } catch (e) {
        console.log(e)
      } finally {
        this.getList()
        this.isOperating = false
      }
    },
    async deleteWr(id) {
      this.isOperating = true
      try {
        await this.$confirm(`是否要取消工单：${id}`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        const body = {
          ids: [id]
        }
        await deleteWrs(body)
        this.$message({
          message: '操作成功！',
          type: 'success'
        })
        // console.log(r)
        this.getList()
      } catch (e) {
        console.log(e)
      } finally {
        this.isOperating = false
      }
    },
    async getCfList() {
      try {
        const r = await getCfList()
        this.enumerationVal['cfIdOptions'] = r['data'].map(i => {
          return {
            text: i['userName'],
            value: i['userId']
          }
        })
      } catch (e) {
        console.log(e)
      }
    },
    closeDialog(flag) {
      if (flag) {
        this.getList()
      }
      this.assignToCfFlag = false
    },
    showAssignToCf(row) {
      this.assignTo['wrStatus'] = row['wrStatus']
      this.assignTo['cfId'] = row['cfId']
      this.assignTo['wrId'] = row['wrId'].toString()
      this.assignToCfFlag = true
    },
    updateStatus(status) {
      // console.log(status)
    },
    downloadFile(row) {
      window.open(`${this.baseUrl}/wr/downFile?projectName=wr&projectId=${row['wrId']}&authorization=${getToken()}`)
    },
    handleSelectionChange(...arr) {
      // console.log(arr)
    },
    closeCfDialog(flag) {
      this.cfDialogVisibleFlag = false
      if (flag) {
        this.getList()
      }
    },
    handlerCellClick(row) {
      this.targetWrId = row['wrId'] + ''
      this.cfName = row['cfName']
      // console.log(row)
      this.cfId = row['cfId']
      this.cfDialogVisibleFlag = true
    },
    handleSortChange(v) {
      const { column, prop, order } = v
      this.sort = order ? order === 'descending' ? 'desc' : 'asc' : ''
      this.sortFiled = humpTransformToUnderline(prop)
      // console.log(column, prop, order)
      this.getList(true)
    },
    handleFilterChange(filters) {
      for (const filter in filters) {
        const underLine = humpTransformToUnderline(filter)
        const filterVal = filters[filter]
        if (this.filterObj[underLine]) {
          this.filterObj[underLine] = filterVal
        }
      }
      this.paginationData['currentPage'] = 1
      this.getList()
    },
    seeDetails(v) {
      this.$router.push('list/edit/' + v['wrId'])
    },
    getListByStatus(status) {
      if (status !== this.status) {
        this.status = status
        this.paginationData['currentPage'] = 1
        this.getList(false, true)
      }
    },
    async getList(search, jump) {
      try {
        this.isLoading = true
        const params = {
          pageCurrent: this.paginationData['currentPage'],
          pageSize: this.paginationData['pageSize'],
          status: this.status,
          field: this.sortFiled || 'date_assigned',
          sort: this.sort || 'desc'
        }
        if (this.status === '') {
          params['status'] = ''
        }
        if (search) {
          this.realNameSearch['real'] = this.realNameSearch['search']
          this.paginationData['currentPage'] = 1
          params['pageCurrent'] = 1
        }
        if (jump) {
          this.realNameSearch['search'] = this.realNameSearch['real']
        }
        if (!search) {
          this.realNameSearch['search'] = this.realNameSearch['real']
        }
        params['keyWords'] = this.realNameSearch['real']
        params['userId'] = this.userId
        // params['roleGroups'] = encodeURI(JSON.stringify(['1 1', '2,2', 3, 4, 5, 6]))
        // console.log(this.filtersDataString)
        params['screen'] = this.filtersDataString
        const r = await getWorkorderList(params)
        // this.paginationData['pageSize'] = r['data']['pageSize']
        // console.log(r)
        // this.list = r['data']['list']['items']
        // this.paginationData['total'] = r['data']['rowCount']

        this.list = r['data']['list']
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

<style scoped>
  .el-pagination{
    margin-top: 30px;
  }
</style>
