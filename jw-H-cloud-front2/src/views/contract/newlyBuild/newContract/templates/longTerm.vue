<template>
  <div>
    <el-form
      ref="contractRule"
      :rules="contractRule"
      :model="submit['tContract']"
      label-position="right"
      label-width="115px"
    >
      <!-- 定义合同 -->
      <!-- onkeyup="value=value.replace(/[^\u4E00-\u9FA5]/g,'')"
          onpaste="value=value.replace(/[^\u4E00-\u9FA5]/g,'')"
      oncontextmenu="value=value.replace(/[^\u4E00-\u9FA5]/g,'')"-->
      <el-row>
        <el-col :span="24" align="center">
          <div class="grid-content bg-purple">定义合同</div>
        </el-col>
      </el-row>
      <el-row :gutter="15">
        <el-col :span="6">
          <el-form-item label="合同编码:" prop="conId">
            <el-input v-model="submit['tContract']['conId']" placeholder="请输入合同编码" clearable/>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="合同名称:" prop="conName">
            <el-input v-model="submit['tContract']['conName']" placeholder="请输入合同名称" clearable/>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="合同编辑人:" prop="conContacts">
            <el-input v-model="submit['tContract']['conContacts']" placeholder="请输入编辑人" clearable/>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="院方责任人:" prop="resPerson">
            <el-select
              v-model="submit['tContract']['resPerson']"
              style="width:80%"
              clearable
              placeholder="请选择责任人">
              <el-option
                v-for="item in resPersonData"
                :key="item.userId"
                :label="item.userName"
                :value="item.userId"/>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="15">
        <el-col :span="6">
          <el-form-item label="合同类型:">
            <el-input value="长期" readonly/>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="合同优先级:" prop="conPriority">
            <el-select
              v-model="submit['tContract']['conPriority']"
              style="width:80%"
              clearable
              placeholder="请选择"
            >
              <el-option
                v-for="item in conPriorityArr"
                :key="item.label"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="签约期限(年):" prop="conTerm">
            <el-input
              v-model="submit['tContract']['conTerm']"
              placeholder="请输入年限"
              clearable
              style="width:80%"
            />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="联系人:" prop="maintPeople">
            <el-input v-model="submit['tContract']['maintPeople']" placeholder="请输入联系人" clearable/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">
          <el-form-item label="联系人电话:" prop="maintPhone">
            <el-input
              v-model="submit['tContract']['maintPhone']"
              placeholder="请输入联系人电话"
              clearable
            />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="合同总金额:" prop="totalAmount">
            <el-input
              v-model="submit['tContract']['totalAmount']"
              placeholder="请输入合同总金额"
              clearable/>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="起止时间:" prop="dateStart">
            <el-input v-show="false" v-model="submit['tContract']['dateStart']"/>
            <el-date-picker
              v-model="startDateToEnd"
              :picker-options="contractStartPicker"
              type="daterange"
              align="right"
              unlink-panels
              value-format="yyyy-MM-dd"
              range-separator="-"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="说明:" prop="comments">
            <el-input
              :autosize="{ minRows: 3, maxRows: 3}"
              v-model="submit['tContract']['comments']"
              type="textarea"
              resize="none"
              placeholder="请输入备注"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="15">
        <el-col :span="24" align="middle">
          <div class="grid-content bg-purple">合同问卷</div>
        </el-col>
      </el-row>
      <el-row :gutter="15">
        <el-col :offset="10" :span="6" align="left">
          <el-form-item label="问卷名称:" label-width="85px" prop="queName">
            <el-input v-model="submit['tContract']['queName']" readonly placeholder="请选择或新建问卷"/>
          </el-form-item>
        </el-col>
        <el-col :span="8" align="right">
          <CreateQuestion :create-que-handle="createQueHandle" que-type="长期"/>
        </el-col>
      </el-row>
      <!-- 问卷列表 -->
      <el-table
        v-loading="question['listLoading']"
        ref="table"
        :data="question['list']"
        :row-style="tableStripeCallBack"
        border
        max-height="560"
        empty-text="请新建问卷"
        element-loading-text="获取列表中"
        @expand-change="findQuetsion">
        <el-table-column width="80" align="center" type="expand" label="详情">
          <template slot-scope="{row}">
            <el-form v-for="(item,index) in question['problemsData']" :key="index" label-position="left" inline>
              <el-form-item label="问题" type="index" label-width="40px">{{ index + 1 + ':' }}</el-form-item>
              <br>
              <el-form-item label="工作内容:">{{ item['workContent'] }}</el-form-item>
              <el-form-item label="检查/扣分:">{{ item['insDed'] }}</el-form-item>
              <el-form-item label="标准分:">{{ item['score'] }}</el-form-item>
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
        <el-table-column width="80" align="center" prop="queId" label="问卷编码"/>
        <el-table-column width="400" align="center" prop="queName" label="问卷名称"/>
        <el-table-column align="center" prop="isValid" label="是否有效">
          <template slot-scope="{row}">
            <el-tag :type="row.isValid | isValidFilter">{{ row.isValid | isValidNameFilter }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="operationDaytime" label="更改时间"/>
        <el-table-column align="center" label="操作">
          <template slot-scope="scope">
            <el-button
              type="success"
              size="mini"
              @click.native.prevent="selectQuestionName(scope.$index, question['list'])"
            >选择</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-row>
        <el-col :offset="5" :span="12" align="center">
          <el-pagination
            :page-sizes="pageSizes"
            :current-page="pagination['currentPage']"
            :page-size="pagination['pageSize']"
            :total="pagination['total']"
            layout="total, sizes, prev, pager, next, jumper"
            @current-change="currentChange"
            @size-change="handleSizeChange"/>
        </el-col>
        <el-col :offset="5" :span="2" align="right">
          <el-button
            :loading="contractLoading"
            type="primary"
            class="submit"
            @click.native.prevent="subMission"
          >{{ contractLoading ? '提交中' : '提交' }}</el-button>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import { default as CreateQuestion } from '../dialog/createQuestion'

import {
  checkContractIdExist
} from '@/utils/validate/contract'

import {
  getNewContract,
  getQuestionnairesList,
  findContractResPerson,
  getQuestionnaireDetailsByQueId
} from '@/api/contract'

import { tableStripeCallBack } from '@/utils/style'

import {
  conPriorityArr,
  claTypeArr,
  dayArr,
  tempBlArr,
  tempFlArr,
  tempRmArr,
  tempDeviceArr
} from '@/utils/enumerationList/contract'

import { phoneReg } from '@/utils/validate/reg'

import { pageSizes } from '@/utils/globalConfig'

import {
  conTypeFilter,
  conBuildFilter,
  conFloorFilter,
  conRoomFilter,
  conModesFilter,
  conIntervalWeekFilter,
  isValidFilter,
  isValidNameFilter
} from '@/filter/contract'

export default {
  components: {
    CreateQuestion
  },
  filters: {
    conTypeFilter,
    conBuildFilter,
    conFloorFilter,
    conRoomFilter,
    conModesFilter,
    conIntervalWeekFilter,
    isValidFilter,
    isValidNameFilter
  },
  // 子组件通过props来接收数据:
  props: {
    conType: {
      type: String,
      default: ''
    }
  },
  data() {
    const conTermChange = (rule, value, callback) => {
      const regular = /^\d{0,1}(\.\d{0,1})?$/g
      if (!value || Object.is(value, '0')) {
        return callback(new Error('签约期限不能为空或0'))
      }
      if (value > 3) {
        callback(new Error('签约期限不能大于3年'))
      }
      if (!regular.test(value)) {
        return callback(new Error('签约期限只能输入数字加1位小数和一个点'))
      }
      callback()
    }
    const totalAmountChange = (rule, value, callback) => {
      const regular = /^\d{0,9}(\.\d{0,2})?$/g
      if (!value || Object.is(value, '0')) {
        return callback(new Error('合同总金额不能为空或0'))
      }
      if (!regular.test(value)) {
        return callback(new Error('合同总金额只能输入数字加2位小数和一个点'))
      }
      callback()
    }
    return {
      uploadData: new FormData(),
      pageSizes,
      conPriorityArr,
      dayArr,
      claTypeArr,
      tempBlArr,
      tempFlArr,
      tempRmArr,
      tempDeviceArr,
      // 日期快捷方式
      contractStartPicker: {
        shortcuts: [
          {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              end.setTime(end.getTime() + 3600 * 1000 * 24 * 90)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近六个月',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              end.setTime(end.getTime() + 3600 * 1000 * 24 * 180)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近一年',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              end.setTime(end.getTime() + 3600 * 1000 * 24 * 365)
              picker.$emit('pick', [start, end])
            }
          }
        ]
      },
      // 开始日期和结束日期
      startDateToEnd: [],
      // 提交加载中
      contractLoading: false,
      resPersonData: [],
      // 提交
      submit: {
        // 新建合同
        tContract: {
          // 合同编码
          conId: '',
          // 合同名称
          conName: '',
          // 编辑人
          conContacts: '',
          // 医院责任人
          resPerson: '',
          // 医院责任人下拉框

          // 合同类型
          conType: this.conType,
          // 联系人
          maintPeople: '',
          // 联系人电话
          maintPhone: '',
          // 签约期限
          conTerm: '',
          // 合同总金额
          totalAmount: '',
          // 合同优先级
          conPriority: '',
          // 说明
          comments: '',
          // 判断问卷名称
          queName: '',
          // 起止时间
          dateStart: ''
        },
        // 合同条款
        tClause: [],
        // 问卷
        tQuestionnaire: {
          // 问卷id
          queId: '',
          // 问卷名称
          queName: '请从问卷列表中选择'
        },
        // 新建问卷
        tProblem: {
          // 编辑者
          editor: '',
          // 问卷名称
          queName: '',
          // 问卷类型
          queType: '',
          // 问卷问题组
          proProblem: []
        }
      },
      // 问卷
      question: {
        // 列表加载
        listLoading: false,
        // 新建问卷弹框
        questionDialog: false,
        // 提交加载
        submitLoading: false,
        // 问卷列表
        list: [],
        // 问题详情数组
        problemsData: [],
        // 问题次序
        proOrder: 1,
        // 问题名称
        questionName: ''
      },
      // 问卷分页,列表
      pagination: {
        currentPage: 1,
        pageSize: 10,
        total: 0
      },
      // 新建合同判断
      contractRule: {
        conId: [
          { required: true, message: '请输入合同编码', trigger: 'blur' },
          { validator: checkContractIdExist, trigger: 'blur' }
        ],
        conName: [
          { required: true, message: '请输入合同名称', trigger: 'blur' }
        ],
        conContacts: [
          { required: true, message: '请输入合同编辑人', trigger: 'blur' }
        ],
        resPerson: [
          { required: true, message: '请输入院方责任人', trigger: 'blur' }
        ],
        conPriority: [
          { required: true, message: '请选择合同优先级', trigger: 'blur' }
        ],
        // 联系人
        maintPeople: [
          { required: true, message: '请输入联系人', trigger: 'blur' }
        ],
        maintPhone: [
          { required: true, message: '请输入联系人电话', trigger: 'blur' },
          { message: '请输入正确的固定电话或手机号', pattern: phoneReg }
        ],
        conTerm: [
          { required: true, validator: conTermChange, trigger: 'blur' }
        ],
        totalAmount: [
          { required: true, validator: totalAmountChange, trigger: 'blur' }
        ],
        queName: [
          { required: true, message: '请选择或新建问卷', trigger: 'blur' }
        ],
        dateStart: [
          { required: true, message: '请选择起止时间', trigger: 'blur' }
        ]
      }
    }
  },
  watch: {
    // 判断起止日期
    startDateToEnd(v) {
      if (v && v[0]) {
        this.submit['tContract']['dateStart'] = v[0]
      } else {
        this.submit['tContract']['dateStart'] = ''
      }
    }
  },
  created() {},
  async mounted() {
    this.findContractResPerson()
    this.getQuestionNaireList()
  },
  methods: {
    // 表格隔行颜色
    tableStripeCallBack,
    // 删除内容
    deleteRow(index, rows) {
      rows.splice(index, 1)
    },
    // 添加问题名称
    addQuestionName() {
      if (Object.is(this.question.questionName, '')) {
        this.$message({
          message: '问题名称不能为空！',
          type: 'error'
        })
        return
      }
      this.submit['tProblem']['proProblem'].push({
        proOrder: Number(this.question.proOrder++),
        proProblem: this.question.questionName.trim(),
        tAnswer: [
          {
            ansOrder: 1,
            ansAnswer: '是'
          },
          {
            ansOrder: 2,
            ansAnswer: '否'
          }
        ]
      })
      this.question.questionName = ''
      // console.log(this.submit['tProblem'])
    },
    // 撤销新建问卷弹框
    createQueHandle(id, queName) {
      // console.log(id, queName)
      this.submit['tQuestionnaire']['queId'] = id
      this.submit['tQuestionnaire']['queName'] = queName
      this.submit['tContract']['queName'] = queName
      this.submit['tProblem'][ 'queName'] = queName
      this.getQuestionNaireList()
    },
    // 责任人下拉框
    async findContractResPerson() {
      try {
        const r = await findContractResPerson()
        this.resPersonData = r['data']
        // console.log(r['data'])
      } catch (e) {
        console.log(e)
      }
    },
    // 问卷列表
    async getQuestionNaireList() {
      const params = {
        pageCurrent: this.pagination['currentPage'],
        pageSize: this.pagination['pageSize'],
        queType: this.conType
      }
      this.question['listLoading'] = true
      try {
        const r = await getQuestionnairesList(params)
        this.pagination['total'] = r['data']['rowCount']
        this.question['list'] = (r['data']['records']).reverse()
        // console.log(r['data']['records'])
      } catch (e) {
        console.log(e)
      } finally {
        this.question['listLoading'] = false
        this.$refs.table.bodyWrapper.scrollTop = 0
      }
    },
    // 查找问题
    async findQuetsion(row, expanded) {
      try {
        const params = {
          queId: row['queId']
        }
        // console.log(row, expanded)
        const r = await getQuestionnaireDetailsByQueId(params)
        this.question['problemsData'] = r['data']['problems']
        // console.log(r['data'])
      } catch (e) {
        console.log(e)
      }
    },
    // 问卷分页
    currentChange(targetPage) {
      this.pagination['currentPage'] = targetPage
      this.getQuestionNaireList()
    },
    // 分页跳转
    handleSizeChange(size) {
      this.pagination['pageSize'] = size
      this.pagination['currentPage'] = 1
      this.getQuestionNaireList()
    },
    // 选择合同问卷
    selectQuestionName(index, rows) {
      this.submit['tContract']['queName'] = rows[index].queName
      this.submit['tQuestionnaire']['queName'] = rows[index].queName
      this.submit['tQuestionnaire']['queId'] = rows[index].queId
    },
    // 新建合同提交
    async subMission(v) {
      this.submit.tContract['dateStart'] = this.startDateToEnd[0]
      this.submit.tContract['dateEnd'] = this.startDateToEnd[1]
      // console.log(this.submit)
      try {
        const flag = await this.$refs['contractRule'].validate()
        if (flag) {
          this.contractLoading = true
          this.uploadData.delete('tContract')
          this.uploadData.delete('tClause')
          this.uploadData.delete('tQuestionnaire')
          this.uploadData.append(
            'tContract',
            JSON.stringify(this.submit.tContract)
          )
          this.uploadData.append(
            'tClause',
            JSON.stringify(this.submit.tClause)
          )
          this.uploadData.append(
            'tQuestionnaire',
            JSON.stringify(this.submit.tQuestionnaire)
          )
          await getNewContract({ data: this.submit })
          this.$message({
            message: '合同创建成功！',
            type: 'success'
          })
          this.empty()
        }
        // console.log(r['data'])
      } catch (e) {
        console.log(e)
      } finally {
        this.contractLoading = false
      }
    },
    // 文件上传
    async uploadFunc(v) {
      this.uploadData.delete('file')
      this.uploadData.append('file', v['file'])
    },
    // 提交后清空
    empty() {
      this.startDateToEnd = []
      this.$refs['contractRule'].resetFields()
    }
  }
}
</script>

<style scoped>
.el-row {
  margin-bottom: 20px;
}

.el-col {
  border-radius: 4px;
}

.el-input {
  width: 80%;
}

.el-pagination{
  margin-top: 30px;
}

.bg-purple {
  background: #d3dce6;
}

.grid-content {
  border-radius: 4px;
  min-height: 36px;
  line-height: 36px;
}

.submit{
  margin-top: 25%;
}
</style>
