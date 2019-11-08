<template style="height:100%">
  <el-container>
    <el-header>
      <el-dialog
        :visible.sync="isConfig"
        title="修改记录方式"
        width="30%"
        @close="closeConfig">
        <el-form ref="configForm" :rules="configFormRules" :model="configForm" label-width="120px">
          <el-form-item label="记录方式：" prop="type">
            <el-checkbox-group v-model="configForm.type">
              <el-checkbox label="2">数据库</el-checkbox>
              <el-checkbox label="1">缓存</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-form>
        <span slot="footer">
          <el-button @click=" isConfig = false ">取 消</el-button>
          <el-button :disabled="isUpload" type="primary" @click="saveConfig">确 定</el-button>
        </span>
      </el-dialog>
      <el-dialog
        :visible.sync="showStackMsgFlag"
        title="查看堆栈信息"
        width="60%"
        @close="showStackMsgFlag = false">
        <div v-for="(item, index) in stackMsg" :key="index">
          {{ item }}
        </div>
        <span slot="footer">
          <el-button @click=" showStackMsgFlag = false ">关闭</el-button>
        </span>
      </el-dialog>
      <el-row>
        <el-col :span="8">
          <el-date-picker
            v-model="startAndEndTime"
            :picker-options="contractStartPicker"
            style="width:98%"
            type="datetimerange"
            range-separator="-"
            value-format="timestamp"
            start-placeholder="开始时间"
            end-placeholder="结束时间"/>
        </el-col>
        <el-col :span="14">
          <el-button type="primary" @click="getList(true)">搜索</el-button>
        </el-col>

        <el-col :span="2">
          <el-button type="primary" icon="el-icon-s-tools" @click="isConfig = true">设置</el-button>
        </el-col>
      </el-row>
    </el-header>
    <el-main height="95%">
      <el-table
        v-loading="listLoading"
        :data="lists"
        border
        fit
        stripe
        element-loading-text="数据加载中..."
        style="width: 100%;"
      >

        <el-table-column
          align="center"
          prop="recDate"
          label="异常时间"
          width="200"
        >
          <template slot-scope="{row}">
            {{ row.recDate | parseTime }}
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          prop="methodName"
          label="异常方法"
          show-overflow-tooltip
          min-width="20%"/>
        <el-table-column
          align="center"
          prop="className"
          label="异常所在类"
          show-overflow-tooltip
          min-width="15%"/>
        <el-table-column
          align="center"
          prop="exceptionName"
          label="异常名称"
          show-overflow-tooltip
          min-width="20%"/>
        <el-table-column
          align="center"
          prop="requestParam"
          label="请求参数"
          show-overflow-tooltip
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
            >查看堆栈信息</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-row style="text-align:center">
        <el-col :span="24">
          <el-pagination
            :current-page="paginationData['currentPage']"
            :page-size="paginationData['pageSize']"
            :total="paginationData['total']"
            style="padding-top:10px"
            layout="total, prev, pager, next"
            @current-change="currentChange"
          />
        </el-col>
      </el-row>
    </el-main>
  </el-container>

</template>

<script>
import {
  // getLogList,
  updateLogConfig,
  getLogConfig,
  getExceptionLogs,
  getExceptionStackMsg } from '@/api/mis/ums/logs'

import {
  parseTime
} from '@/utils'
export default {
  filters: {
    parseTime
  },
  data() {
    return {
      stackMsg: [],
      stackMsgLoading: false,
      showStackMsgFlag: false,
      startAndEndTime: [],
      searchTime: [],
      contractStartPicker: {
        shortcuts: [
          {
            text: '最近一天',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(end.getTime() - 3600 * 1000 * 24)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近三天',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(end.getTime() - 3600 * 1000 * 24 * 3)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近一周',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(end.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', [start, end])
            }
          }
        ]
      },
      lists: [],
      listLoading: false,
      paginationData: {
        currentPage: 1,
        pageSize: 10,
        total: 0
      },
      isUpload: false,
      isConfig: false,
      title: '日志查看',
      configForm: {
        type: []
      },
      configFormRules: {
        type: [
          { required: true, message: '请至少选择一项', trigger: 'change' }
        ]
      }

    }
  },
  watch: {
    startAndEndTime(v) {
      // console.log(v)
    }
  },
  created() {
  },
  async mounted() {
    this.getList()
    this.getConfig()
  },
  methods: {
    async seeDetails(i, v) {
      this.showStackMsgFlag = true
      this.stackMsgLoading = true
      try {
        const params = {
          id: v['id']
        }
        const r = await getExceptionStackMsg(params)
        this.stackMsg = r['data']
      } catch (e) {
        console.log(e)
      } finally {
        this.stackMsgLoading = false
      }
    },
    async getConfig() {
      try {
        const r = await getLogConfig()
        if (r['data'] === '0') {
          this.configForm['type'] = ['1', '2']
        } else {
          this.configForm['type'] = [r['data']]
        }
      } catch (e) {
        console.log(e)
      } finally {
        console.log('get ok')
      }
    },
    async getList(search, jump) {
      this.listLoading = true
      try {
        if (search) {
          this.paginationData['currentPage'] = 1
          this.searchTime = this.startAndEndTime
        }
        if (jump) {
          this.startAndEndTime = this.searchTime
        }
        const params = {
          pageNum: this.paginationData['currentPage'],
          pageSize: this.paginationData['pageSize']
        }
        if (this.searchTime && this.searchTime.length !== 0) {
          params['beginTime'] = this.searchTime[0] + ''
          params['endTime'] = this.searchTime[1] + ''
          // beginTime endTime
        }
        // console.log(params)
        const r = await getExceptionLogs(params)
        this.lists = r['data']['list']
        this.paginationData['total'] = r['data']['count']
      } catch (e) {
        console.log(e)
      } finally {
        this.listLoading = false
      }
      // const r = await getLogList()
      // console.log(r)
    },
    async closeConfig() {
      // console.log('close')
      this.isConfig = false
      this.getConfig()
      await this.$refs['configForm'].clearValidate()
    },
    async saveConfig() {
      this.isUpload = true
      try {
        await this.$refs['configForm'].validate()
        const data = {

        }
        if (this.configForm['type'].length === 2) {
          data['type'] = 0
        } else {
          data['type'] = this.configForm['type'][0]
        }
        await updateLogConfig(data)
        this.$message({
          message: '更新成功！',
          type: 'success'
        })
        this.closeConfig()
      } catch (e) {
        console.log(e)
      } finally {
        this.isUpload = false
        // alert('submit')
      }
    },
    currentChange(targetPage) {
      this.paginationData['currentPage'] = targetPage
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
