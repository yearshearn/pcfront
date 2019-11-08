<template style="height:100%">
  <el-container>
    <el-container style="padding:30px">
      <el-header>
        <el-row :gutter="15">
          <el-col :offset="16" :span="6">
            <el-input
              v-model="searchObj['keyWord']"
              clearable
              placeholder="请输入设备类型"
              @clear="getList(true)"
              @keyup.enter.native="getList(true)">
              <el-button
                slot="append"
                icon="el-icon-search"
                @click="getList(true)"/>
            </el-input>
          </el-col>
          <el-col :span="2">
            <el-button
              @click="$router.push('add')"
            >添加</el-button>
          </el-col>
        </el-row>
      </el-header>
      <el-main style="margin-top:-15px">
        <el-row>
          <el-col :span="24">
            <el-table
              v-loading="isLoading"
              ref="table"
              :data="tableData"
              :row-style="tableStripeCallBack"
              max-height="644"
              border
              @filter-change="filterChange">
              <el-table-column
                fixed="left"
                align="center"
                label="序号"
                type="index"
                width="50"/>
              <el-table-column
                prop="equipmentAlarmId"
                align="center"
                fixed="left"
                show-overflow-tooltip
                label="设备报警ID"
                width="100"/>
              <el-table-column
                prop="eqStd"
                fixed="left"
                align="center"
                label="设备类型"
                show-overflow-tooltip
                width="200">
                <template slot-scope="{row}">
                  {{ row['eqStd'] }}
                  <span v-if="row['eqSubtypes']"> - {{ row['eqSubtypes'] }}</span>
                </template>
              </el-table-column>
              <el-table-column
                :filters="options['description']"
                fixed="left"
                column-key="description"
                prop="alarmTypeName"
                align="center"
                show-overflow-tooltip
                label="系统名称"
                width="150"/>
              <el-table-column
                prop="colors"
                align="center"
                label="等级颜色标识"
                width="120">
                <template slot-scope="{row}">
                  <div
                    :class="row['alarmLevel'] == 1?'alarmColorError':'alarmColorWarning'"
                    style="height:30px;width:95%"/>
                </template>
              </el-table-column>
              <el-table-column
                prop="alarmLevel"
                align="center"
                label="警报等级"
                width="100"/>
              <el-table-column
                prop="posion"
                align="center"
                label="标识位"
                width="100"/>
              <el-table-column
                prop="posionValue"
                align="center"
                show-overflow-tooltip
                label="标志位值"
                width="150"/>
              <el-table-column
                prop="dataType"
                align="center"
                show-overflow-tooltip
                label="数据类型"
                width="150"/>
              <el-table-column
                prop="maximumAlarm"
                align="center"
                label="最高报警阈值"
                width="120"/>
              <el-table-column
                prop="minimumAlarm"
                align="center"
                label="最低报警阈值"
                width="120"/>
              <el-table-column
                prop="switchAlarm"
                align="center"
                label="开关"
                width="75">
                <template slot-scope="{row}">
                  <el-tag :type="row.switchAlarm | isValidFilter">
                    {{ row.switchAlarm == 0 ? '停用':'启用' }}
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column
                prop="description"
                align="center"
                label="报警描述"
                show-overflow-tooltip
                width="250"/>
              <el-table-column
                fixed="right"
                align="center"
                width="240"
                label="操作选项"
              >
                <template slot-scope="{row}">
                  <el-button
                    :disabled="isOperating"
                    size="mini"
                    type="primary"
                    @click="$router.push('edit/' + row['equipmentAlarmId'])">编辑</el-button>
                  <el-button
                    v-if="row['switchAlarm'] == '1'"
                    :disabled="isOperating"
                    size="mini"
                    type="danger"
                    @click="updateStatus(row['equipmentAlarmId'],row['switchAlarm'],row['eqStd'])">停用</el-button>
                  <el-button
                    v-else
                    :disabled="isOperating"
                    size="mini"
                    type="success"
                    @click="updateStatus(row['equipmentAlarmId'],row['switchAlarm'],row['eqStd'])">启用</el-button>
                  <el-button
                    :disabled="isOperating"
                    size="mini"
                    type="danger"
                    @click="deleteAlarmType(row['equipmentAlarmId'],row['eqStd'])">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
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
      </el-main>
    </el-container>
  </el-container>

</template>

<script>
import { tableStripeCallBack } from '@/utils/style'
import { pageSizes } from '@/utils/globalConfig'
import { isValidFilter } from '@/filter/contract'
import {
  getTableList,
  deleteEquipmentAlarmData,
  updateEquipmentAlarmStatus
} from '@/api/equipment/alarm'
import {
  getTableList as getDesOptions
} from '@/api/equipment/system'
export default {
  components: {

  },
  filters: {
    isValidFilter
  },
  data() {
    return {
      options: {
        description: []
      },
      isLoading: true,
      isOperating: false,
      pageSizes,
      paginationData: {
        currentPage: 1,
        pageSize: 10,
        total: 0
      },
      tableData: [],
      searchObj: {
        keyWord: ''
      },
      realSearchObj: {
        keyWord: ''
      },
      filterArr: []
    }
  },
  computed: {

  },
  watch: {
  },
  created() {
  },
  async mounted() {
    console.log(this.$route)
    this.getDesOptions()
    this.getList()
  },
  methods: {
    tableStripeCallBack,
    async updateStatus(equipmentAlarmId, status, eqStd) {
      this.isOperating = true
      try {
        // eslint-disable-next-line
        status = status == '1' ? '0' : '1'
        await this.$confirm(`是否要${status === '0' ? '停用' : '启用'}：${eqStd}?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        const body = {
          equipmentAlarmId,
          switchAlarm: status
        }
        await updateEquipmentAlarmStatus(body)
        this.$message({
          message: `更新成功！`,
          type: 'success'
        })
      } catch (e) {
        console.log(e)
      } finally {
        this.isOperating = false
        this.getList()
      }
    },
    async filterChange(filters) {
      this.filterArr = filters['description']
      this.getList(true)
    },
    async getDesOptions() {
      try {
        const params = {
          pageSize: 99999
        }
        const r = await getDesOptions(params)
        this.options['description'] = r['data']['list'].map(i => {
          return {
            text: i['description'],
            value: i['alarmType']
          }
        })
        console.log(this.options['description'])
      } catch (e) {
        console.log(e)
      }
    },
    async deleteAlarmType(equipmentAlarmId, eqStd) {
      this.isOperating = true
      try {
        await this.$confirm(`是否要删除：${eqStd}`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        const body = {
          equipmentAlarmId
        }
        await deleteEquipmentAlarmData(body)
        this.$message({
          message: `删除成功！`,
          type: 'success'
        })
        this.getList()
      } catch (e) {
        console.log(e)
      } finally {
        this.isOperating = false
      }
    },
    async getList(search, jump) {
      this.isLoading = true
      try {
        if (search || jump) {
          if (search) {
            this.paginationData['currentPage'] = 1
          }
          this.realSearchObj = JSON.parse(JSON.stringify(this.searchObj))
        } else {
          this.searchObj = JSON.parse(JSON.stringify(this.realSearchObj))
        }
        const params = {
          pageSize: this.paginationData['pageSize'],
          pageNum: this.paginationData['currentPage'],
          eqStd: this.realSearchObj['keyWord']
          // alarmType: JSON.stringify(['test1', 'test10'])
        }
        if (this.filterArr.length !== 0) {
          params['alarmTypeName'] = encodeURI(JSON.stringify(this.filterArr))
        }
        const r = await getTableList(params)
        this.tableData = r['data']['list']
        this.paginationData['total'] = r['data']['count']
      } catch (e) {
        console.log(e)
      } finally {
        this.isLoading = false
        this.$refs.table.bodyWrapper.scrollTop = 0
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

<style>
  .alarmColorError{
    background:#FF3333
  }
  .alarmColorWarning{
    background:#FFCC02
  }
</style>

