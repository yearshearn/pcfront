<template>
  <el-container>
    <el-header>
      <el-row :span="12">
        <el-col >
          <el-button type="primary" @click="$router.push('SLAdetails')">
            新增
          </el-button>
        </el-col>
      </el-row>
    </el-header>
    <el-main>
      <el-row>
        <el-col :span="24">
          <el-table
            v-loading="isLoading"
            ref="table"
            :row-style="tableStripeCallBack"
            :data="list"
            max-height="600"
            border
            style="width:100%"
            @filter-change="handleFilterChange"
          >
            <el-table-column
              align="center"
              label="序号"
              type="index"
              width="80"/>
            <el-table-column
              :filters="filterData.address"
              column-key="blId"
              align="center"
              label="地点"
              type=""
              prop="blId"
              min-width="30%"/>
            <el-table-column
              :filters="filterData.name"
              column-key="personLiableName"
              align="center"
              label="责任人"
              type=""
              prop="personLiableName"
              min-width="30%"/>
            <el-table-column
              :filters="filterData.probTypeName"
              column-key="problemType"
              align="center"
              label="问题类型"
              show-overflow-tooltip
              type=""
              prop="problemType"
              min-width="30%"/>
            <el-table-column
              :filters="filterData.priority"
              column-key="slaSort"
              align="center"
              label="优先排名"
              type=""
              prop="slaSort"
              min-width="30%"/>
            <el-table-column
              :filters="filterData.wrid"
              column-key="distributeObjectName"
              align="center"
              label="指派对象"
              type=""
              prop="distributeObjectName"
              min-width="30%"/>
            <el-table-column
              align="center"
              label="服务时间"
              type=""
              prop="serviceStartTime"
              show-overflow-tooltip
              min-width="30%">
              <template slot-scope="{row}">
                <div>
                  {{ row.serviceStartTime }} -- {{ row.serviceEndTime }}
                </div>
              </template>
            </el-table-column>
            <el-table-column
              :filters="filterData.eqId"
              column-key="eqId"
              align="center"
              label="设备"
              type=""
              prop="eqType"
              show-overflow-tooltip
              min-width="30%" >
              <template slot-scope="{row}">
                <div>
                  {{ row.eqType }}--{{ row.eqCode }}--{{ row.eqSystem }}
                </div>
              </template>
            </el-table-column>
            <el-table-column
              :filters="filterData.contract"
              column-key="contractName"
              align="center"
              label="合同名称"
              type=""
              prop="contractName"
              min-width="30%"/>
            <el-table-column
              :filters="filterData.Approval"
              column-key="approversName"
              align="center"
              label="审批"
              type=""
              prop="approversName"
              min-width="30%"/>
            <el-table-column
              fixed="right"
              align="center"
              label="操作选项"
              min-width="70%"
            >
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  @click="handleEdit(scope.$index, scope.row)"
                >
                  编辑
                </el-button>
                <el-button
                  size="mini"
                  type="danger"
                  @click="handleDelete(scope.$index, scope.row,2)"
                >
                  删除
                </el-button>
                <el-button
                  v-if="scope.row.slaStatus==0"
                  :disabled="isOperating"
                  size="mini"
                  type="danger"
                  @click="typeBtn(scope.$index, scope.row,1)"
                >
                  停用
                </el-button>
                <el-button
                  v-if="scope.row.slaStatus==1"
                  :disabled="isOperating"
                  size="mini"
                  type="success"
                  @click="typeBtn(scope.$index, scope.row,0)"
                >
                  启用
                </el-button>
                <i
                  class="el-icon-caret-top"
                  style="margin-left:15px;"
                  @click="move(0,scope.row)"
                />
                <i
                  class="el-icon-caret-bottom"
                  style="margin-left:15px;"
                  @click="move(1,scope.row)"
                />
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
import { humpTransformToUnderline
//  customUriEncode
} from '@/utils'
import { pageSizes } from '@/utils/globalConfig'
import {
  getSLAList, // 列表
  delectSLA, // 删除
  moveSLA// 上下移动
} from '@/api/SLA/SLA'
// import { humpTransformToUnderline } from '@/utils'
export default {
  data() {
    return {
      isOperating: false,
      isLoading: false,
      // 分页
      pageSizes,
      paginationData: {
        currentPage: 1,
        pageSize: 10,
        total: 0
      },
      // 列表数据
      list: [],
      filterData: {
        address: [],
        name: [],
        probTypeName: [],
        priority: [{ text: '1', value: '1' }, { text: '2', value: '2' }, { text: '3', value: '3' }],
        wrid: [],
        eqId: [],
        contract: [],
        Approval: []
      },
      filterArr: []
    }
  },
  async mounted() {
    this.getList()
  },
  methods: {
    // 表格隔行颜色
    tableStripeCallBack,
    // 操作，编辑
    handleEdit(index, row) {
      window.sessionStorage.setItem('paramsData', row.id)
      // this.$router.push({ name: 'SLAdetails', params: { row: row }})
      this.$router.push({ name: 'SLAdetails' })
    },
    // 操作，删除
    async  handleDelete(index, row, slaStatus) {
      // window.sessionStorage.setItem('paramsData', JSON.stringify(row))
      // console.log(row)
      try {
        const body = {
          slaId: row.slId,
          slaStatus: slaStatus
        }
        await delectSLA(body)
        this.$message({
          message: '操作成功',
          type: 'success'
        })
      } catch (e) {
        console.log(e)
      } finally {
        this.isLoading = false
        this.getList()
      }
    },
    // 筛选
    // 测试
    handleFilterChange(filters) {
      console.log(filters)
      for (const filter in filters) {
        const underLine = humpTransformToUnderline(filter)
        const filterVal = filters[filter]
        console.log(underLine)
        console.log(filterVal)
        // if (this.filterData[underLine]) {
        //   this.filterData[underLine] = filterVal
        // }
      }
      // this.filterArr = filters['address']
      // console.log(this.filterArr)
    },
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
    // 获取数据
    async getList(search, jump) {
      this.isLoading = true
      try {
        const body = {
          currentPage: this.paginationData['currentPage'],
          pageSize: this.paginationData['pageSize']
        }
        // if (this.filterArr.length !== 0) {
        //   body['alarmTypeName'] = encodeURI(JSON.stringify(this.filterArr))
        // }
        const r = await getSLAList(body)
        this.list = r.data.data
        this.paginationData['pageSize'] = r['data']['pageSize']
        this.paginationData['total'] = r['data']['total']
      } catch (e) {
        console.log(e)
      } finally {
        this.$refs.table.bodyWrapper.scrollTop = 0
        this.isLoading = false
      }
    },
    // 停用启用
    async typeBtn(index, row, slaStatus) {
      this.isOperating = true
      try {
        const body = {
          slaId: row.slId,
          slaStatus: slaStatus
        }
        await delectSLA(body)
        this.$message({
          message: '操作成功',
          type: 'success'
        })
      } catch (e) {
        console.log(e)
      } finally {
        this.isOperating = false
        this.isLoading = false
        this.getList()
      }
    },
    // 优先排名移动
    async move(type, row) {
      // console.log(row)
      // return
      try {
        const body = {
          'id': row.id,
          'slaSort': row.slaSort,
          'moveType': type
        }
        await moveSLA(body)
      } catch (e) {
        console.log(e)
      } finally {
        this.isLoading = false
        this.getList()
      }
      console.log(type)
    }
  }
}
</script>
