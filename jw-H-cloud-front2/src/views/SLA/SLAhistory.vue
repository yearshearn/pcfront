<template>
  <el-container>
    <!-- <el-header>
      <el-row>
        <el-col>
          el
        </el-col>
      </el-row>
    </el-header> -->
    <el-main>
      <el-row>
        <el-col>
          <el-table
            v-loading="isLoading"
            :row-style="tableStripeCallBack"
            :data="list"
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
              label="SLA名称"
              type=""
              prop="slaName"
              min-width="30%"
            />
            <el-table-column
              align="center"
              label="日期时间"
              type=""
              prop="eventTime"
              min-width="30%"
            />
            <el-table-column
              align="center"
              label="来源"
              type=""
              prop=""
              min-width="30%"
            />
            <el-table-column
              align="center"
              label="状态"
              type=""
              prop="eventStatus"
              min-width="30%"
            />
            <el-table-column
              align="center"
              label="指派对象"
              type=""
              prop="personLiable"
              min-width="30%"
            />
            <el-table-column
              align="center"
              label="申请人"
              type=""
              prop="distributeObject"
              min-width="30%"
            />
            <el-table-column
              align="center"
              label="地点"
              show-overflow-tooltip

              type=""
              min-width="30%"
            >
              <template slot-scope="{row}">
                <div>
                  {{ row.block }}{{ row.blId }}{{ row.flId }}{{ row.rmId }}
                </div>

              </template>
            </el-table-column>

          </el-table>
        </el-col>
      </el-row>
      <!-- 分页 -->
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
</template>
<style>
.el-container{
    padding:30px;
  }
</style>

<script>
import { tableStripeCallBack } from '@/utils/style'
import { pageSizes } from '@/utils/globalConfig'
import { evntList } from '@/api/SLA/SLA'
export default {
  data() {
    return {
      isLoading: false,
      // 分页
      pageSizes,
      paginationData: {
        currentPage: 1,
        pageSize: 10,
        total: 0
      },
      // 列表数据
      list: []
    }
  },
  async mounted() {
    this.getList()
  },
  methods: {
    // 表格隔行颜色
    tableStripeCallBack,
    // 分页
    currentChange(targetPage) {
      this.paginationData['currentPage'] = targetPage
      this.getList(false, true)
    },
    handleSizeChange(size) {
      this.paginationData['pageSize'] = size
      this.paginationData['currentPage'] = 1
      this.getList()
    },
    // 获取列表
    async getList(search, jump) {
      this.isLoading = true
      try {
        const parame = {
          currentPage: this.paginationData['currentPage'],
          pageSize: this.paginationData['pageSize']
        }
        const r = await evntList(parame)
        this.list = r.data.data
        this.paginationData['pageSize'] = r['data']['pageSize']
        this.paginationData['total'] = r['data']['total']
      } catch (e) {
        console.log(e)
      } finally {
        this.isLoading = false
      }
    }
  }
}
</script>
