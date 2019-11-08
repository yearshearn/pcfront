<template>
  <el-container>
    <el-header>
      <el-row :gutter="15" align="right">
        <!-- <el-col :span="4" :offset="16">
          <el-input
            v-model="assets['searchEqId']"
            placeholder="设备编码"
            clearable
            @clear="assetsList(true)"
            @keyup.enter.native="assetsList(true)">
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="assetsList(true)"/>
          </el-input>
        </el-col> -->
        <el-col :span="4" :offset="20">
          <el-input
            v-model="assets['searchEqType']"
            placeholder="设备类型"
            clearable
            @clear="assetsList(true)"
            @keyup.enter.native="assetsList(true)">
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="assetsList(true)"/>
          </el-input>
        </el-col>
      </el-row>
    </el-header>
    <el-main>
      <el-card>
        <el-table
          v-loading="assets['listLoading']"
          ref="table"
          :data="assets['list']"
          :row-style="tableStripeCallBack"
          fit
          max-height="618"
          element-loading-text="数据加载中..."
          @filter-change="filterChange">
          <el-table-column align="center" type="index" fixed label="序号"/>
          <el-table-column align="center" property="eqId" fixed label="设备编码" show-overflow-tooltip/>
          <el-table-column align="center" property="eqStd" label="设备类型" show-overflow-tooltip>
            <template slot-scope="{row}">
              {{ row['eqStd'] }}
              <span v-if="row['eqSubtypes']"> - {{ row['eqSubtypes'] }}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" property="eqTypeCode" label="设备类型编码" show-overflow-tooltip/>
          <el-table-column
            :filters="options['description']"
            align="center"
            property="alarmType"
            label="系统名称"
            column-key="alarmType"
            show-overflow-tooltip/>
          <el-table-column align="center" property="assetNumber" label="资产编码" show-overflow-tooltip/>
          <el-table-column align="center" property="qtyPms" label="保养周期(天)"/>
          <el-table-column align="center" property="costPurchase" label="采购价格" show-overflow-tooltip/>
          <el-table-column align="center" label="操作选项">
            <template slot-scope="{row}">
              <el-button size="mini" type="primary" @click="handleEdit(row)">编辑</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-row>
          <el-col :span="24" align="center">
            <el-pagination
              :page-sizes="pageSizes"
              :current-page="pagination['currentPage']"
              :page-size="pagination['pageSize']"
              :total="pagination['total']"
              layout="total, sizes, prev, pager, next, jumper"
              @current-change="currentChange"
              @size-change="handleSizeChange"
            />
          </el-col>
        </el-row>
      </el-card>
    </el-main>
  </el-container>
</template>

<script>
import { pageSizes } from '@/utils/globalConfig'

import { tableStripeCallBack } from '@/utils/style'

import { getTableList } from '@/api/equipment/system'

import { equipmentAssetsList } from '@/api/equipment/assets'

export default {
  data() {
    return {
      // 每页显示条数
      pageSizes,
      assets: {
        // 设备类型搜索
        searchEqType: '',
        // 列表数组
        list: [],
        // 列表等待
        listLoading: false
      },
      // 系统名称下拉框数组
      options: {
        description: []
      },
      // 系统筛选
      filterArr: [],
      // 列表分页
      pagination: {
        currentPage: 1,
        pageSize: 10,
        total: 0
      }
    }
  },
  computed: {},
  created() {},
  async mounted() {
    this.assetsList()
    this.getSystemList()
  },
  methods: {
    // 表格隔行颜色
    tableStripeCallBack,
    // 问卷分页
    currentChange(targetPage) {
      this.pagination['currentPage'] = targetPage
      this.assetsList(false, true)
    },
    // 分页跳转
    handleSizeChange(size) {
      this.pagination['pageSize'] = size
      this.pagination['currentPage'] = 1
      this.assetsList()
    },
    // 编辑
    handleEdit(row) {
      // console.log(row)
      this.$router.push({
        name: 'assetsEdit',
        params: { eqId: row['eqId'] }
      })
    },
    // 系统名称
    async getSystemList() {
      try {
        const r = await getTableList()
        this.options['description'] = r['data']['list'].map((item) => {
          return {
            text: item.description,
            value: item.alarmType
          }
        })
        // console.log(r['data'])
      } catch (error) {
        console.log(error)
      }
    },
    // 系统名称筛选
    async filterChange(filters) {
      this.filterArr = filters['alarmType']
      this.assetsList(true)
    },
    // 列表数据
    async assetsList(search, jump) {
      this.assets['listLoading'] = true
      try {
        const params = {
          pageNum: this.pagination['currentPage'],
          pageSize: this.pagination['pageSize']
        }
        if (search) {
          params['pageNum'] = 1
          params['eqId'] = this.assets['searchEqId']
          params['eqStd'] = this.assets['searchEqType']
        }
        if (jump) {
          params['eqId'] = this.assets['searchEqId']
          params['eqStd'] = this.assets['searchEqType']
        }
        if (this.filterArr.length !== 0) {
          console.log(this.filterArr.length)
          params['alarmTypeName'] = encodeURI(JSON.stringify(this.filterArr))
        }
        const r = await equipmentAssetsList(params)
        this.assets['list'] = r['data']['list']
        this.pagination['total'] = r['data']['count']
        // console.log(r['data'])
      } catch (error) {
        console.log(error)
      } finally {
        this.assets['listLoading'] = false
        this.$refs.table.bodyWrapper.scrollTop = 0
      }
    }
  }
}
</script>

<style scoped>
  .el-container{
    margin: 30px 30px 0;
  }

  .el-pagination{
    margin-top: 30px;
  }
</style>
