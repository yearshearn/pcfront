<template style="height:100%">
  <div>
    <el-button :disabled="!canEdit" @click="showDialog">选择其他问卷模板</el-button>
    <el-dialog
      :visible="showFlag"
      :before-close="closeDialog"
      title="选择其他问卷模板"
      width="60%"
      center>
      <el-row style="margin-bottom:20px">
        <el-col :span="6" :offset="18">
          <el-input
            v-model="search"
            placeholder="请输入关键字或问卷编码"
            @keyup.enter.native="getList(true)"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getList(true)"/>
          </el-input>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-table
            v-loading="listLoading"
            id="test"
            :data="lists"
            :height="505"
            border
            fit
            stripe
            element-loading-text="数据加载中..."
            style="width: 100%"
            @expand-change="findQuetsion">
            <el-table-column v-if="conTypes" type="expand" label="详情" width="50">
              <template slot-scope="{row}">
                <el-form v-for="(item,index) in problemsData" :key="index" label-position="left" inline>
                  <el-form-item :label="`问题${index + 1 + ':'}`" type="index" label-width="40px">
                    <br>
                    <el-form-item label="工作内容:">{{ item['workContent'] }}</el-form-item><br>
                    <el-form-item label="检查/扣分:">{{ item['insDed'] }}</el-form-item><br>
                    <el-form-item label="标准分:">{{ item['score'] }}</el-form-item>
                  </el-form-item>
                </el-form>
                <el-form>
                  <el-form-item label="问卷备注:" label-width="90">
                    <el-input
                      v-model="row['comments']"
                      :autosize="{ minRows: 5, maxRows: 5}"
                      style="width:50%"
                      type="textarea"
                      resize="none"
                      readonly/>
                  </el-form-item>
                </el-form>
              </template>
            </el-table-column>
            <el-table-column v-else type="expand" label="详情" width="50">
              <template slot-scope="problems">
                <div v-for="(item, index) in problemsData" :key="index">
                  <el-form-item :label="`问题${index + 1 + ' ：'}`" type="index" label-width="40px">
                    &nbsp;&nbsp;{{ item['proProblem'] }}
                  </el-form-item>
                </div>
                <el-form-item label="问卷备注:" label-width="90">
                  <el-input
                    v-model="problems['comments']"
                    :autosize="{ minRows: 5, maxRows: 5}"
                    style="width:50%"
                    type="textarea"
                    resize="none"
                    readonly/>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              prop="queId"
              label="问卷编码"
              min-width="20%"/>
            <el-table-column
              align="center"
              prop="queName"
              label="问卷名称"
              show-overflow-tooltip
              min-width="20%"/>
            <el-table-column
              align="center"
              prop="isValid"
              label="是否生效"
              width="100"
            >
              <template slot-scope="{row}">
                <el-tag :type="row.isValid | isValidFilter">
                  {{ row.isValid | isValidNameFilter }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              prop="editor"
              label="编辑人"
              min-width="15%"/>
            <el-table-column
              align="center"
              prop="operationDaytime"
              label="更改时间"
              min-width="20%"/>

            <el-table-column
              fixed="right"
              align="center"
              width="100"
              label="操作"
            >
              <template slot-scope="scope">
                <el-link
                  type="primary"
                  @click="selectHandler(scope.$index,scope.row)"
                >选择</el-link>
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
                @current-change="currentChange"/>
            </el-col>
          </el-row>

        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import { getQuestionnairesList, getQuestionnaireDetailsByQueId } from '@/api/contract'
import { isValidFilter, isValidNameFilter } from '@/filter/contract'
export default {
  filters: {
    isValidFilter, isValidNameFilter
  },
  props: {
    canEdit: {
      type: Boolean,
      default: false
    },
    selectCallback: {
      type: Function,
      default: null
    },
    conType: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      listLoading: true,
      showFlag: false,
      lists: [],
      // 问题详情数组
      problemsData: [],
      search: '',
      realSearch: '',
      paginationData: {
        currentPage: 1,
        pageSize: 10,
        total: 0
      }
    }
  },
  computed: {
    conTypes() {
      if (Object.is(this.conType, '长期')) {
        return true
      }
      return false
    }
  },
  watch: {
    showFlag(v) {
      // console.log(v)
      if (v) this.getList()
    }
  },
  created() {
    this.getList()
  },
  async mounted() {
    // console.log(this.$route.params)
  },
  methods: {
    // 查找问题
    async findQuetsion(row, expanded) {
      try {
        const params = {
          queId: row['queId']
        }
        // console.log(row, expanded)
        const r = await getQuestionnaireDetailsByQueId(params)
        this.problemsData = r['data']['problems']
        // console.log(r['data'])
      } catch (e) {
        console.log(e)
      }
    },
    async getList(search, jump) {
      this.listLoading = true
      try {
        const params = {
          pageCurrent: this.paginationData['currentPage'],
          pagesize: this.paginationData['pageSize'],
          conType: this.conType
        }
        if (search) {
          params['pageCurrent'] = 1
          this.realSearch = this.search
        }
        if (jump) {
          this.search = this.realSearch
        }
        params['solr'] = this.realSearch
        if (this.conType !== '') {
          params['queType'] = this.conType
        }
        const r = await getQuestionnairesList(params)
        this.lists = r['data']['records']
        this.paginationData = {
          currentPage: r['data']['pageCurrent'],
          pageSize: r['data']['pageSize'],
          total: r['data']['rowCount']
        }
        // console.log(this.lists)
      } catch (e) {
        console.log(e)
      } finally {
        this.listLoading = false
      }
    },
    selectHandler(i, r) {
      this.selectCallback(r)
      this.closeDialog()
    },
    currentChange(targetPage) {
      this.paginationData['currentPage'] = targetPage
      this.getList(false, true)
    },
    showDialog() {
      this.showFlag = true
    },
    closeDialog() {
      this.showFlag = false
      this.lists = []
      this.paginationData = {
        currentPage: 1,
        pageSize: 10,
        total: 0
      }
      this.search = ''
    }
  }
}
</script>

