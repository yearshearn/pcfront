<template style="height:100%">
  <el-container style="margin-top:30px">
    <el-header>
      <el-form label-position="right">
        <el-row :gutter="15">
          <el-col :span="4">
            <el-input
              v-model="realSearch['code']"
              clearable
              placeholder="请输入备件编码"
              @keyup.enter.native="getList(scope)"
              @clear="getList(true)">
              <el-button slot="append" icon="el-icon-search" @click="getList(true)"/>
            </el-input>
          </el-col>
          <el-col :span="4">
            <el-input
              v-model="realSearch['name']"
              clearable
              placeholder="请输入备件名称"
              @keyup.enter.native="getList(scope)"
              @clear="getList(true)">
              <el-button slot="append" icon="el-icon-search" @click="getList(true)"/>
            </el-input>
          </el-col>
          <el-col :span="2" :offset="14" align="right">
            <el-button @click="exportToExcel">
              导出文档
            </el-button>
          </el-col>
        </el-row>
      </el-form>
    </el-header>
    <el-main height="95%">
      <el-table
        :data="inventoryList"
        :row-style="tableStripeCallBack"
        fit
        highlight-current-row
        element-loading-text="数据加载中..."
        style="width:100%"
        @filter-change="handleFilterChange"
      >
        <el-table-column
          width="100"
          label="序号"
          type="index"
          align="center"/>
        <el-table-column
          label="备件编码"
          prop="code"
          align="center"/>
        <el-table-column
          label="备件名称"
          prop="name"
          show-overflow-tooltip
          align="center"/>
        <el-table-column
          :filters="part['categories']"
          column-key="categories"
          label="备件类别"
          prop="category"
          align="center"/>
        <el-table-column
          :filters="part['ptStoreLocName']"
          column-key="ptStoreLocName"
          label="仓库名"
          show-overflow-tooltip
          prop="ptStoreLocName"
          align="center"/>
        <el-table-column
          label="可用数量"
          prop="qtyOnHand"
          align="center"/>
        <el-table-column
          label="安全保有量"
          prop="qtyMinHand"
          align="center"/>
        <el-table-column
          label="单价"
          prop="costUnitStd"
          align="center"/>
        <el-table-column
          label="总价值"
          prop="costTotal"
          align="center"/>
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
  </el-container>
</template>

<script>
import { getToken } from '@/utils/auth'

import { tableStripeCallBack } from '@/utils/style'

import { pageSizes } from '@/utils/globalConfig'

import { humpTransformToUnderline } from '@/utils'

import {
  partInventory,
  storeOptions,
  optionPartType } from '@/api/part'

export default {
  components: {},
  filters: {
  },

  props: {},
  data() {
    return {
      pageSizes,
      realSearch: {
        code: '',
        name: ''
      },
      part: {
        ptStoreLocName: [],
        categories: []
      },
      inventoryLoading: true,
      pagination: {
        currentPage: 1,
        pageSize: 10,
        total: 0
      },
      filterObj: {
        pt_store_loc_name: [],
        categories: []
      },
      inventoryList: []
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
  watch: {
  },
  created() {
  },
  async mounted() {
    this.getList()
    this.getTypeOptions()
    this.categoryOption()
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
    async categoryOption() {
      try {
        const params = {
          pageSize: 9999
        }
        const r = await optionPartType(params)
        this.part['categories'] = r['data'].map(i => {
          return {
            text: i['name'],
            value: i['ptCatId']
          }
        })
        // console.log(r)
      } catch (e) {
        this.part['categories'] = []
        console.log(e)
      }
    },
    async getTypeOptions() {
      try {
        const params = {
          pageSize: 9999
        }
        const r = await storeOptions(params)
        this.part['ptStoreLocName'] = r['data'].map(i => {
          return {
            text: i['ptStoreLocName'],
            value: i['ptStoreLocId']
          }
        })
        // console.log(r)
      } catch (e) {
        this.part['ptStoreLocName'] = []
        console.log(e)
      }
    },
    async getList() {
      try {
        const data = {
          pageNum: this.pagination['currentPage'],
          pageSize: this.pagination['pageSize']
        }
        this.inventoryLoading = true
        data['ptStoreLocIds'] = this.filterObj.pt_store_loc_name
        data['categories'] = this.filterObj.categories
        data['code'] = this.realSearch['code']
        data['name'] = this.realSearch['name']
        const result = await partInventory(data)
        this.inventoryList = result.data.list
        // 按编码排序显示
        this.inventoryList.sort(function(a, b) {
          return a.code.localeCompare(b.code)
        })

        this.pagination['pageSize'] = result['data']['pageSize']
        this.pagination['total'] = result['data']['count']
      } catch (err) {
        console.log(err)
      } finally {
        this.inventoryLoading = false
        this.$refs.table.bodyWrapper.scrollTop = 0
      }
    },
    currentChange(targetPage) {
      this.pagination['currentPage'] = targetPage
      this.getList()
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
        code: this.realSearch['code'],
        name: this.realSearch['name'],
        ptStoreLocIds: this.filterObj.pt_store_loc_name,
        categories: this.filterObj.categories,
        authorization: getToken()
      })
      const url = `/part/store/part/list`
      window.open(`${this.baseUrl}/wr/exportExcel?authorization=${getToken()}&projectName=inventory&postUrl=${url}&params=;;${encodeURI(params)};;`)
      // window.open(`http://192.168.0.133:9083/jwkjPublicService/exportExcel?authorization=${getToken()}&projectName=inventory&postUrl=${url}&params=;;${encodeURI(params)};;`)
    }
  }
}
</script>

<style scoped>
  .el-pagination{
    margin-top: 30px;
  }
</style>
