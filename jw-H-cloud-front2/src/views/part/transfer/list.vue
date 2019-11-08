<template>
  <el-container>
    <el-header>
      <el-form
        ref="transferRule"
        :model="transfer"
        label-position="right">
        <el-row :gutter="15">
          <el-col :span="5">
            <el-form-item
              label="开始时间"
              label-width="90px"
              prop="startDate">
              <el-date-picker
                v-model="transfer['startDate']"
                :picker-options="transferStartDateOptions"
                type="date"
                clearable
                style="width:140px"
                value-format="yyyy-MM-dd"
                placeholder="开始时间"/>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item
              label="结束时间"
              label-width="90px"
              prop="endDate">
              <el-date-picker
                v-model="transfer['endDate']"
                :picker-options="transferEndDateOptions"
                type="date"
                clearable
                style="width:140px"
                value-format="yyyy-MM-dd"
                placeholder="结束时间"/>
            </el-form-item>
          </el-col>
          <el-col :offset="1" :span="2">
            <el-button type="primary" @click="transferRecord(true)">显示</el-button>
          </el-col>
          <el-col :span="2">
            <el-button @click="cleanUp">清除</el-button>
          </el-col>
          <el-col :offset="2" :span="4">
            <el-form-item prop="search">
              <el-input
                v-model="search"
                placeholder="请输入备件名称"
                clearable
                @clear="transferRecord(true)"
                @keyup.enter.native="transferRecord(true)">
                <el-button
                  slot="append"
                  icon="el-icon-search"
                  @click="transferRecord(true)"/>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="3" align="right">
            <el-button
              @click="exportToExcel"
            >导出文档</el-button>
          </el-col>
        </el-row>
      </el-form>
    </el-header>
    <el-main>
      <el-card>
        <el-table
          v-loading="transfer['listLoading']"
          ref="table"
          :data="transfer['list']"
          :row-style="tableStripeCallBack"
          fit
          max-height="570"
          element-loading-text="数据加载中..."
          @filter-change="handleFilterTransType">
          <el-table-column
            width="80"
            align="center"
            type="index"
            fixed
            label="序号"/>
          <el-table-column
            show-overflow-tooltip
            label="请求日期"
            width="100"
            align="center">
            <template slot-scope="{row}">
              {{ row['operationTime'].split(' ')[0] }}
            </template>
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            label="请求时间"
            width="100"
            align="center">
            <template slot-scope="{row}">
              {{ row['operationTime'].split(' ')[1] }}
            </template>
          </el-table-column>
          <el-table-column
            :filters="transfer['itTypeData']"
            column-key="transType"
            width="130"
            align="center"
            prop="transType"
            label="变更类型"/>
          <el-table-column
            :filters="transfer['partCatData']"
            column-key="partCat"
            width="110"
            align="center"
            prop="partCat"
            label="备件类别"/>
          <el-table-column
            width="110"
            align="center"
            prop="code"
            show-overflow-tooltip
            label="备件编码"/>
          <el-table-column
            width="110"
            align="center"
            prop="partName"
            show-overflow-tooltip
            label="备件名称"/>
          <el-table-column
            align="center"
            show-overflow-tooltip
            prop="transferFrom"
            label="源位置"/>
          <el-table-column
            align="center"
            show-overflow-tooltip
            prop="transferTo"
            label="目标位置"/>
          <el-table-column
            align="center"
            prop="transQuantity"
            label="变更数量"/>
          <el-table-column
            align="center"
            prop="costWhenUsed"
            label="单位成本"/>
          <el-table-column
            align="center"
            prop="costTotal"
            label="总成本"/>
          <el-table-column
            align="center"
            prop="vnName"
            show-overflow-tooltip
            label="供应商"/>
          <el-table-column
            align="center"
            prop="wrLocation"
            show-overflow-tooltip
            label="使用地点"/>
          <el-table-column
            :filters="transfer['performedNameData']"
            column-key="performedName"
            width="100"
            align="center"
            prop="performedName"
            show-overflow-tooltip
            label="执行者"/>
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
import { humpTransformToUnderline } from '@/utils'

import { getToken } from '@/utils/auth'

import { tableStripeCallBack } from '@/utils/style'

import { pageSizes } from '@/utils/globalConfig'

import { getCfList } from '@/api/workorder/list'

import {
  itType,
  transferRecord,
  optionPartType
} from '@/api/part'

export default {
  data() {
    return {
      // 工单开始日期限制
      transferStartDateOptions: {
        disabledDate: (time) => {
          if (!Object.is(this.transfer['endDate'], '')) {
            return time.getTime() > Date.now() || time.getTime() > new Date(this.transfer['endDate']).getTime()
          } else {
            return time.getTime() > Date.now()
          }
        }
      },
      // 工单结束如期限制
      transferEndDateOptions: {
        disabledDate: (time) => {
          return time.getTime() < new Date(this.transfer['startDate']).getTime() || time.getTime() > Date.now()
        }
      },
      // 每页显示条数
      pageSizes,
      // 搜索
      search: '',
      // 转移
      transfer: {
        // 列表等待
        listLoading: false,
        // 开始日期
        startDate: '',
        // 结束日期
        endDate: '',
        // 列表
        list: [],
        // 操作类型
        itTypeData: [],
        // 备件类别
        partCatData: [],
        // 执行者
        performedNameData: []
      },
      filterObj: {
        part_cat: [],
        trans_type: [],
        performed_name: []
      },
      // 列表分页
      pagination: {
        currentPage: 1,
        pageSize: 10,
        total: 0
      }
    }
  },
  computed: {
    baseUrl() {
      return process.env.BASE_API
    }
  },
  created() {
  },
  async mounted() {
    this._getItType()
    this.getCfList()
    this.categoryOption()
    this.transferRecord()
  },
  methods: {
    // 表格隔行颜色
    tableStripeCallBack,
    // 执行者
    async getCfList() {
      try {
        const r = await getCfList()
        this.transfer['performedNameData'] = r['data'].map((item) => {
          return {
            text: item['userName'],
            value: item['userId']
          }
        })
        // console.log(r['data'])
      } catch (e) {
        console.log(e)
      }
    },
    // 变更类型
    async _getItType() {
      try {
        const r = await itType()
        this.transfer['itTypeData'] = r['data'].map((item) => {
          return {
            text: item.name,
            value: item.itTypeId
          }
        })
        // console.log(r['data'])
      } catch (e) {
        console.log(e)
      }
    },
    // 备件类别
    async categoryOption() {
      try {
        const params = {
          pageSize: 9999
        }
        const r = await optionPartType(params)
        this.transfer['partCatData'] = r['data'].map((item) => {
          return {
            text: item['name'],
            value: item['ptCatId']
          }
        })
        // console.log(r)
      } catch (e) {
        console.log(e)
      }
    },
    handleFilterTransType(filters) {
      for (const filter in filters) {
        const underLine = humpTransformToUnderline(filter)
        const filterVal = filters[filter]
        // console.log(underLine, filterVal)
        if (this.filterObj[underLine]) {
          this.filterObj[underLine] = filterVal
        }
      }
      this.pagination['currentPage'] = 1
      this.transferRecord()
    },
    // 问卷分页
    currentChange(targetPage) {
      this.pagination['currentPage'] = targetPage
      this.transferRecord(false, true)
    },
    // 分页跳转
    handleSizeChange(size) {
      this.pagination['pageSize'] = size
      this.pagination['currentPage'] = 1
      this.transferRecord()
    },
    // 转移记录
    async transferRecord(search, jump) {
      this.transfer['listLoading'] = true
      try {
        const data = {
          beginTime: this.transfer['startDate'],
          endTime: this.transfer['endDate'],
          partName: this.search,
          pageNum: this.pagination['currentPage'],
          pageSize: this.pagination['pageSize'],
          operationTypes: this.filterObj['trans_type'],
          userIds: this.filterObj['performed_name'],
          categories: this.filterObj['part_cat']
        }
        if (search) {
          data['pageCurrent'] = 1
          data['partName'] = this.search
        }
        if (jump) {
          this.search = ''
        }
        const r = await transferRecord(data)
        this.transfer['list'] = r['data']['list']
        this.pagination['total'] = r['data']['count']
        // console.log(data)
      } catch (e) {
        console.log(e)
      } finally {
        this.transfer['listLoading'] = false
        this.$refs.table.bodyWrapper.scrollTop = 0
      }
    },
    // 导出文档
    async exportToExcel() {
      const params = JSON.stringify({
        beginTime: this.transfer['startDate'],
        endTime: this.transfer['endDate'],
        partName: this.search,
        pageNum: this.pagination['currentPage'],
        pageSize: 999999,
        operationTypes: this.filterObj['trans_type'],
        categories: this.filterObj['part_cat'],
        performedName: this.filterObj['performed_name'],
        authorization: getToken()

      })
      const url = `/part/it/list`
      window.open(`${this.baseUrl}/wr/exportExcel?authorization=${getToken()}&projectName=it&postUrl=${url}&params=;;${encodeURI(params)};;`)
    },
    // 清空
    cleanUp() {
      this.$refs['transferRule'].resetFields()
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
