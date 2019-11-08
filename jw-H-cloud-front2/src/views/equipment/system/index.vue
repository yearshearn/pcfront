<template style="height:100%">
  <el-container>
    <el-container style="padding:30px">
      <el-header>
        <el-row :gutter="15">
          <el-col :offset="16" :span="6">
            <el-input
              v-model="searchObj['keyWord']"
              clearable
              placeholder="请输入系统名称"
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
              max-height="600"
              border>
              <el-table-column
                fixed="left"
                align="center"
                label="序号"
                type="index"
                width="50"/>
              <el-table-column
                prop="alarmType"
                align="center"
                label="系统类别"
                min-width="50"/>
              <el-table-column
                prop="description"
                align="center"
                label="系统名称"
                min-width="50"/>
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
                    @click="$router.push('edit/' + row['alarmType'])">编辑</el-button>
                  <el-button
                    :disabled="isOperating"
                    size="mini"
                    type="danger"
                    @click="deleteAlarmType(row['alarmType'])">删除</el-button>
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
import {
  getTableList,
  deleteEquipmentSystemData
} from '@/api/equipment/system'
export default {
  components: {

  },
  filters: {
  },
  data() {
    return {
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
      }
    }
  },
  computed: {

  },
  watch: {
  },
  created() {
  },
  async mounted() {
    this.getList()
  },
  methods: {
    tableStripeCallBack,
    async deleteAlarmType(alarmType) {
      this.isOperating = true
      try {
        await this.$confirm(`是否要删除：${alarmType}`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        const body = {
          alarmType
        }
        await deleteEquipmentSystemData(body)
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
          description: this.realSearchObj['keyWord']
        }
        const r = await getTableList(params)
        this.tableData = r['data']['list']
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

<style>

</style>

