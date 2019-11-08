<template style="height:100%">

  <el-container style="padding:30px;">
    <el-header height="5%">
      <el-form label-position="right">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item label="合同类型:">
              <el-select v-model="conType" style="width:58%" placeholder="请选择问卷类型" clearable @change="getList">
                <el-option
                  v-for="item in conTypesArr"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"/>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :offset="10" :span="6">
            <el-input
              v-model="search"
              placeholder="请输入合同名称或合同编码"
              clearable
              @clear="getList(true)"
              @keyup.enter.native="getList(true)"
            >
              <el-button
                slot="append"
                icon="el-icon-search"
                @click="getList(true)"/>
            </el-input>
          </el-col>
          <el-col :span="2" style="text-align:center">
            <el-button
              @click="$router.push('/contract/newlyBuild/newContract')">创建合同</el-button>
          </el-col>
        <!-- <el-col :span="2">
          <el-button :loading = "downloadLoading" style="margin:0 auto;" @click="exportToexcelHandel">导出excel</el-button>
        </el-col> -->
        </el-row>
      </el-form>
    </el-header>
    <el-main height="95%">
      <el-table
        v-loading="listLoading"
        ref="table"
        :data="lists"
        :row-style="tableStripeCallBack"
        border
        fit
        element-loading-text="数据加载中..."
        style="width: 100%"
      >
        <el-table-column
          fixed
          align="center"
          prop="conId"
          label="合同编码"
          width="150"/>
        <el-table-column
          fixed
          align="center"
          prop="conName"
          show-overflow-tooltip
          label="合同名称"
          width="200"/>
        <el-table-column
          align="center"
          prop="resPerson"
          label="医院责任人"
          width="100"
        />
        <el-table-column
          align="center"
          prop="conType"
          label="合同类型"
          width="100"
        >
          <template slot-scope="{row}">

            {{ row.conType | conTypeNameFilter }}

          </template>
        </el-table-column>
        <el-table-column
          align="center"
          prop="dateStart"
          label="开始日期"
          width="110"
          sortable
        />
        <el-table-column
          align="center"
          prop="dateEnd"
          label="结束日期"
          width="110"
          sortable
        />
        <el-table-column
          align="center"
          prop="supplier"
          show-overflow-tooltip
          label="设备供应商"
          width="100"
        />
        <el-table-column
          align="center"
          prop="maintDep"
          show-overflow-tooltip
          label="维保单位"
          width="100"
        />
        <el-table-column
          align="center"
          prop="conPriority"
          show-overflow-tooltip
          label="合同优先级"
          width="100"
        >
          <template slot-scope="{row}">
            <el-tag :type="row.conPriority | conPriorityFilter">
              {{ row.conPriority | conPriorityNameFilter }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          prop="conStatus"
          show-overflow-tooltip
          label="合同状态"
          width="100"
        >
          <template v-if="row.conType!=='长期'" slot-scope="{row}">
            <el-tag :type="row.conStatus | conStatusFilter">
              {{ row.conStatus | conStatusNameFilter }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          prop="conTerm"
          show-overflow-tooltip
          label="合同签约期限(年)"
          width="100"
        />
        <el-table-column
          align="center"
          prop="comments"
          show-overflow-tooltip
          label="说明"
          min-width="100%"
        />
        <el-table-column
          align="center"
          prop="conContacts"
          show-overflow-tooltip
          label="合同编辑人"
          width="100"
        />
        <el-table-column
          fixed="right"
          align="center"
          width="250"
          label="操作"
        >
          <template slot-scope="scope">
            <el-button
              size="mini"
              @click="seeDetails(scope.$index,scope.row)">查看</el-button>
            <el-button
              v-if="scope['row']['conStatus'] != 'AI' && scope['row']['conType'] !=='长期'"
              :disabled="changingStatus"
              size="mini"
              @click="changeStatus(scope.row)">发出</el-button>
              <!-- <el-button
              v-if="scope['row']['conStatus'] != 'AI' && scope['row']['conType'] !=='长期'"
              :disabled="changingStatus"
              size="mini"
              type="danger"
              @click="deleteContract(scope.row)" >删除</el-button> -->
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          prop="percent"
          show-overflow-tooltip
          label="已付款进度"
          width="100"/>
        <el-table-column
          align="center"
          show-overflow-tooltip
          label="合同总金额"
          width="100">
          <template slot-scope="{row}">
            {{ '￥' + row['totalAmount'] }}
          </template>
        </el-table-column>
      </el-table>
      <el-row style="text-align:center">
        <el-col :span="24">
          <el-pagination
            :current-page="paginationData['currentPage']"
            :page-size="paginationData['pageSize']"
            :page-sizes="pageSizes"
            :total="paginationData['total']"
            style="padding-top:10px"
            layout="total, sizes, prev, pager, next, jumper"
            @size-change="handleSizeChange"
            @current-change="currentChange"/>
        </el-col>
      </el-row>
      <el-form ref="downloadForm" :action="downloadFormData['action']" method="get"/>

    </el-main>
  </el-container>
</template>

<script>
// import qs from 'qs'
import { pageSizes } from '@/utils/globalConfig'

import {
  getList as getContractList,
  changeContractStatus
  // deleteContract,
  // exportToExcel
} from '@/api/contract'

import {
  conTypeNameFilter,
  conStatusFilter,
  conStatusNameFilter,
  conPriorityNameFilter,
  conPriorityFilter } from '@/filter/contract'

import { parseTime } from '@/utils'

import { tableStripeCallBack } from '@/utils/style'

import { mapGetters } from 'vuex'

import {
  conTypesArr
} from '@/utils/enumerationList/contract'

import { editRoleFlag } from '@/utils/buttonRole/contract'

// import { default as permission } from '@/directive/permission' // 权限判断指令
// import checkPermission from '@/utils/permission' // 权限判断函数
export default {
  name: 'ContractList',
  directives: {
  },
  filters: {
    conTypeNameFilter,
    conStatusFilter,
    conStatusNameFilter,
    conPriorityNameFilter,
    conPriorityFilter
  },
  data() {
    return {
      pageSizes,
      editRoleFlag,
      conTypesArr,
      downloadFormData: {
        action: ''
      },
      downloadLoading: false,
      paginationData: {
        currentPage: 1,
        pageSize: 10,
        total: 0
      },
      conType: '',
      lists: [],
      str: '',
      listLoading: true,
      search: '',
      realSearch: '',
      changingStatus: false
    }
  },
  computed: {
    ...mapGetters([
      'name',
      'roleGroups'
    ])
  },
  created() {

  },
  async mounted() {
    this.getList()
  },
  methods: {
    // 表格隔行颜色
    tableStripeCallBack,
    handleSizeChange(size) {
      this.paginationData['pageSize'] = size
      this.paginationData['currentPage'] = 1
      this.getList()
    },
    async exportToexcelHandel() {
      try {
        // window.open('http://192.168.0.116:9000/api/v1/contract/download')
        // return
        // const r = await exportToExcel()
        // // console.log(r)
        // // // return
        // const blobArr = new Blob(r, { type: 'application/octet-stream' })
        // // const reader = new FileReader()
        // // reader.readAsDataURL(blobArr)
        // // reader.onload = function(e) {
        // const url = window.URL.createObjectURL(blobArr)
        // const link = document.createElement('a')
        // link.style.display = 'none'
        // link.href = url
        // link.setAttribute('download', '123.xls')
        // document.body.appendChild(link)
        // link.click()
        // const iframe = document.createElement('iframe')
        // iframe.style.display = 'none'
        // iframe.src = 'http://192.168.0.123:8091/api/v2/contract/download'
        // document.body.appendChild(iframe)
        // // this.downloadFormData['action'] = 'http://192.168.0.123:8091/api/v2/contract/download'
        // // this.$refs['downloadForm'].submit()
      } catch (e) {
        console.log(e)
      }
    },
    async getList(search, jump) {
      this.listLoading = true
      try {
        // const r = await getListFunction(
        //   getContractList,
        //   this.paginationData,
        //   { search, jump },
        //   { realSearch: this.realSearch, search: this.search }
        // )
        // console.log(r)
        const params = {
          pageCurrent: this.paginationData['currentPage'],
          pagesize: this.paginationData['pageSize'],
          conType: this.conType,
          userName: encodeURI(this.name),
          roleGroups: encodeURI(JSON.stringify(this.roleGroups))
        }
        if (search) {
          params['pageCurrent'] = 1
          this.realSearch = this.search
        }
        if (jump) {
          this.search = this.realSearch
        }
        params['solr'] = this.realSearch

        const result = await getContractList(params)
        // console.log(result['data'])
        this.lists = result['data']
        // this.paginationData['currentPage'] = result['data']['pageCurrent']
        this.paginationData['pageSize'] = result['pageSize']
        this.paginationData['total'] = result['count']
      } catch (e) {
        console.log(e)
      } finally {
        this.$refs.table.bodyWrapper.scrollTop = 0
        this.listLoading = false
      }
    },

    seeDetails(i, val) {
      const conId = val['conId']
      // console.log(val)
      this.$router.push({
        name: 'contractDetails',
        params: {
          cid: conId,
          conType: val['conType']
        }
      })
      // this.$router.push('/contract/details/' + conId)
    },
    conTypeFilterHandler(val, row, col) {
      // console.log(val, row, col)
      return val === row['conType']
    },
    currentChange(targetPage) {
      this.paginationData['currentPage'] = targetPage
      this.getList(false, true)
    },
    handleDownload() {
      this.$router.push('/contract/details/test')
      // this.downloadLoading = true
      // import('@/vendor/Export2Excel').then(excel => {
      //   const tHeader = ['Id', 'Title', 'Author']
      //   const filterVal = ['conId', 'conName', 'conType']
      //   const list = this.lists
      //   const data = this.formatJson(filterVal, list)
      //   excel.export_json_to_excel({
      //     header: tHeader,
      //     data,
      //     filename: 'test',
      //     autoWidth: true,
      //     bookType: 'csv'
      //   })
      //   this.downloadLoading = false
      // })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        if (j === 'timestamp') {
          return parseTime(v[j])
        } else {
          return v[j]
        }
      }))
    },
    async changeStatus(v) {
      this.changingStatus = true
      try {
        await this.$confirm(`一经发出后维护保养计划不可修改, 是否继续?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        const { conId, dateEnd, dateStart } = v
        // console.log(conId, dateEnd, dateStart)
        await changeContractStatus({ conId, dateEnd, dateStart })
        // console.log(r)
        this.$message({
          message: '发出成功！',
          type: 'success'
        })
      } catch (e) {
        console.log(e)
      } finally {
        this.changingStatus = false
        this.getList()
      }
    }
    // async deleteContract(v) {
    //   this.changingStatus = true
    //   try {
    //     const { conId } = v
    //     // console.log(conId)
    //     await deleteContract({ conId })
    //     // console.log(r)
    //     this.$message({
    //       message: '删除成功！',
    //       type: 'success'
    //     })
    //   } catch (e) {
    //     console.log(e)
    //   } finally {
    //     this.changingStatus = false
    //     this.getList()
    //   }
    // }
  }
}
</script>

