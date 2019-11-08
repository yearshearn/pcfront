<template style="height:100%">
  <el-container style="margin-top: 30px;">
    <el-header>
      <el-row :gutter="15">
        <el-col :span="6" >
          <el-button >自动补货记录</el-button>
        </el-col>
        <el-col :span="2" :offset="14">
          <el-button @click="dialogVisible = true">一键采购</el-button>
        </el-col>
        <el-col :span="2">
          <el-button @click="exportToExcel">导出文档</el-button>
        </el-col>
        <!-- <el-col :span="2">
            <el-button>打印</el-button>
          </el-col> -->
      </el-row>
    </el-header>
    <el-main height="95%">
      <el-table
        :data="tableData"
        :row-style="tableStripeCallBack"
        fit
        highlight-current-row
        max-height="578"
        element-loading-text="数据加载中..."
        @filter-change="handleFilterChange"
      >
        <el-table-column
          fixed
          align="center"
          label="序号"
          type="index"
          width="50"
        />
        <el-table-column
          fixed
          align="center"
          prop="code"
          show-overflow-tooltip
          label="备件编号"
        />
        <el-table-column
          fixed
          align="center"
          prop="name"
          show-overflow-tooltip
          label="备件名称"
        />
        <el-table-column
          fixed
          align="center"
          prop="code"
          show-overflow-tooltip
          label="可用数量"
        />
        <el-table-column
          fixed
          align="center"
          prop="code"
          show-overflow-tooltip
          label="安全保有量"
        />

        <el-table-column
          fixed
          align="center"
          prop="code"
          show-overflow-tooltip
          label="备件供应商"
        />
        <el-table-column
          fixed
          align="center"
          prop="code"
          show-overflow-tooltip
          label="单价（元）"
        />
        <el-table-column
          fixed
          align="center"
          prop="code"
          show-overflow-tooltip
          label="备件类型"
        />
        <el-table-column
          fixed
          align="center"
          prop="code"
          show-overflow-tooltip
          label="备件类别"
        />
        <el-table-column
          fixed
          align="center"
          prop="code"
          show-overflow-tooltip
          label="近30日累计消耗量"
        />
        <el-table-column
          fixed
          align="center"
          prop="code"
          show-overflow-tooltip
          label="建议采购数量"
        />
      </el-table>
      <el-row style="text-align:center">
        <el-col :span="24">
          <el-pagination
            :page-sizes="pageSizes"
            :current-page="pagination['currentPage']"
            :page-size="pagination['pageSize']"
            :total="pagination['total']"
            layout="total, sizes, prev, pager, next, jumper"
            @current-change="currentChange"
            @size-change="handleSizeChange"/>
        </el-col>
      </el-row>
    </el-main>
    <el-dialog
      :visible.sync="dialogVisible"
      :before-close="handleClose"
      title="您确认要一键采购吗"
      width="30%"
      close="cl"
    >
      <!-- <span>这是一段信息</span> -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="procure">确 定</el-button>
      </span>
    </el-dialog>
  </el-container>
</template>

<script>
import { getToken } from '@/utils/auth'
import { tableStripeCallBack } from '@/utils/style'
import { pageSizes } from '@/utils/globalConfig'
import { humpTransformToUnderline } from '@/utils'
import { partInventory } from '@/api/part'
export default {
  name: 'PartAutoList',
  components: {},
  props: {

  },
  data() {
    return {
      pageSizes,
      state: 1,
      isOperating: false,
      listLoading: true,
      tableData: [],
      pagination: {
        currentPage: 1,
        pageSize: 10,
        total: 0
      },
      hideSinglePage: false,
      dialogVisible: false
    }
  },
  computed: {
    baseUrl() {
      return process.env.BASE_API
    },
    filtersDataString() {
      const data = JSON.parse(JSON.stringify(this.filterObj))
      const targetData = {}
      for (const key in data) {
        if (data[key].length !== 0) {
          targetData[key] = data[key]
        }
      }
      return targetData
      // return encodeURI(JSON.stringify(targetData))
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

    handleFilterChange(filters) {
      for (const filter in filters) {
        const underLine = humpTransformToUnderline(filter)
        const filterVal = filters[filter]
        if (this.filterObj[underLine]) {
          this.filterObj[underLine] = filterVal
        }
        // console.log(underLine, filterVal)
      }
      this.pagination['currentPage'] = 1
      this.getList()
    },
    procure() {
      this.dialogVisible = false
    },
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done()
        })
        .catch(_ => {})
    },
    async getList() {
      try {
        this.listLoading = true
        const params = {
          pageNum: this.pagination['currentPage'],
          pageSize: this.pagination['pageSize']
        }
        const result = await partInventory(params)
        this.tableData = result.data.list
        this.pagination['pageSize'] = result['data']['pageSize']
        this.pagination['total'] = result['data']['count']
      } catch (error) {
        console.log(error)
      } finally {
        this.$refs.table.bodyWrapper.scrollTop = 0
      }
    },
    currentChange(targetPage) {
      this.pagination['currentPage'] = targetPage
    },
    // 分页跳转
    handleSizeChange(size) {
      this.pagination['pageSize'] = size
      this.pagination['currentPage'] = 1
      this.getList()
    },
    // 导出文档
    async exportToExcel() {
      const params = JSON.stringify({
        pageNum: this.pagination['currentPage'],
        pageSize: 999999,
        authorization: getToken()
      })
      const url = '/part/store/part/list'
      window.open(`${this.baseUrl}/wr/exportExcel?authorization=${getToken()}&projectName=inventory&postUrl=${url}&params=;;${encodeURI(params)};;`)
    }
  }

}
</script>

<style>

</style>
