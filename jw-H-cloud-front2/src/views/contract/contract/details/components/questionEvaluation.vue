<template>
  <div>
    <el-form
      ref="evaluationRule"
      :rules="evaluationRule"
      :model="evaluation"
    >
      <el-row :gutter="15">
        <el-col :span="6" :offset="2">
          <el-form-item label="问卷名称:" label-width="90">
            <el-input v-model="details['queName']" readonly style="width:70%"/>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="考核日期" prop="assessDate">
            <el-select
              v-if="!evaluate"
              v-model="evaluation['assessDate']"
              placeholder="请选择考核日期"
              no-data-text="无考核日期"
              clearable
              @change="assessDateHistory"
            >
              <el-option
                v-for="(item,index) in details['dates']"
                :key="index"
                :label="item ? item.split(' ')[0] : ''"
                :value="item ? item : ''"
              />
            </el-select>
            <el-date-picker
              v-if="evaluate"
              v-model="evaluation['assessDate']"
              :picker-options="pickerOptions"
              value-format="yyyy-MM-dd"
              type="date"
              placeholder="请选择考核日期"
            />
          </el-form-item>
        </el-col>
        <div v-if="canEvaluationFlag()">
          <el-col v-if="longType" :span="8">
            <el-button type="primary" plain @click="evaluates">{{ !evaluate ? '评 价' : '取 消' }}</el-button>
          </el-col>
        </div>
      </el-row>
      <el-row :gutter="15">
        <el-col :offset="4" :span="12">
          <el-form-item label="问卷备注:" label-width="120">
            <el-input
              :autosize="{ minRows: 5, maxRows: 5}"
              v-model="details['comments']"
              readonly
              style="width:80%"
              type="textarea"
              resize="none"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-table
        v-loading="detailLoading"
        :data="details['problems']"
        :summary-method="getSummaries"
        :row-style="tableStripeCallBack"
        fit
        border
        show-summary
        element-loading-text="数据加载中..."
        style="width:100%;margin:20px 0 28px 0;">
        <el-table-column width="80" align="center" type="index" label="问题编码"/>
        <el-table-column
          v-if="regularType"
          width="800"
          align="center"
          prop="proProblem"
          label="问题名称"
        />
        <el-table-column v-if="regularType" align="center" label="问题答案">
          <template slot-scope="{row}">
            {{ row['ansAnswer'] }}
          </template>
        </el-table-column>
        <el-table-column
          v-if="longType"
          align="center"
          prop="workContent"
          label="工作内容"
        />
        <el-table-column
          v-if="longType"
          align="center"
          prop="insDed"
          label="检查/扣分"
        />
        <el-table-column
          v-if="longType"
          width="80"
          align="center"
          prop="score"
          label="标准分"
        />
        <el-table-column
          v-if="scoreGetJudge"
          width="130"
          align="center"
          prop="scoreGet"
          label="得分"
        >
          <template slot-scope="{row}">
            <el-form-item style="margin: 0 auto">
              <el-input-number
                v-model.number="row['scoreGet']"
                :disabled="!evaluate"
                :controls="false"
                clearable
                style="width:60%"/>
            </el-form-item>
          </template>
        </el-table-column>
      </el-table>
    </el-form>
    <el-row v-if="submitShow && canEvaluationFlag()">
      <el-col align="right">
        <el-button type="primary" @click="submit">提 交</el-button>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { canEvaluationFlag } from '@/utils/buttonRole/contract'

import { tableStripeCallBack } from '@/utils/style'

import {
  getQuestionnaireDetailsByConId,
  getAssessmentHistoryByDate,
  answerQuestionnaire,
  findAssessDate,
  getContractPerformanceByConId
} from '@/api/contract'

import { mapGetters } from 'vuex'

export default {
  // 子组件通过props来接收数据:
  props: {
    conType: {
      type: String,
      default: ''
    },
    refreshEvaTableData: {
      type: Function,
      default: null
    }
  },
  data() {
    // 判断考核日期
    const checkAssessDate = async(rule, value, callback) => {
      try {
        const data = {
          queId: this.details['queId'],
          assessDate: this.evaluation['assessDate']
        }
        const r = await findAssessDate(data)
        if (r['data'] === 0) {
          callback()
        } else {
          callback(new Error('考核日期已存在'))
        }
      } catch (e) {
        callback(new Error('网络故障，请稍后重试'))
      }
    }
    return {
      canEvaluationFlag,
      // 禁用当前日期后的日期
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now()
        }
      },
      evaluation: {
        // 考核日期
        assessDate: ''
      },
      // 评价
      evaluate: false,
      // 考核表
      details: [],
      // 考核表等待
      detailLoading: false,
      // 新建合同判断
      evaluationRule: {
        assessDate: [
          { required: true, message: '请选择考核日期', trigger: 'blur' },
          { validator: checkAssessDate, trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    ...mapGetters([
      'queDataRefreshFlag'
    ]),
    // 长期类型
    longType() {
      if (Object.is(this.conType, '长期')) {
        return true
      }
      return false
    },
    // 定期类型
    regularType() {
      if (Object.is(this.conType, '定期')) {
        return true
      }
      return false
    },
    // 得分判断
    scoreGetJudge() {
      if (Object.is(this.conType, '长期') && this.evaluate || !Object.is(this.evaluation['assessDate'], '')) {
        return true
      }
      return false
    },
    // 提交显示
    submitShow() {
      if (Object.is(this.conType, '长期') && this.evaluate) {
        return true
      }
      return false
    }
  },
  watch: {
    queDataRefreshFlag(v) {
      if (v) {
        this.getDetails()
      }
    }
  },
  created() {},
  async mounted() {
    this.getDetails()
  },
  methods: {
    // 表格隔行颜色
    tableStripeCallBack,
    // 查看问卷详情
    async getDetails() {
      const data = {
        conId: this.$route.params['cid'],
        assessDate: this.evaluation['assessDate']
      }
      try {
        const r = await getQuestionnaireDetailsByConId(data)
        this.details = r['data']
        // console.log(r['data'])
      } catch (e) {
        console.log(e)
      } finally {
        this.$store.commit('SET_QUES_DATA_REFRESH_FLAG', false)
      }
    },
    // 评价
    evaluates() {
      this.evaluate = !this.evaluate
      this.evaluation['assessDate'] = ''
      if (this.details) {
        for (const item of this.details['problems']) {
          item.scoreGet = ''
        }
      }
      this.getDetails()
    },
    // 自定义合计
    getSummaries(param) {
      const { columns, data } = param
      const sums = []
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '总分'
          return
        }
        if (data) {
          const values = data.map(item => Number(item[column.property]))
          if (!values.every(value => isNaN(value))) {
            sums[index] = values.reduce((prev, curr) => {
              const value = Number(curr)
              if (!isNaN(value)) {
                return prev + curr
              } else {
                return prev
              }
            }, 0)
            const subscript = [3, 4]
            if (subscript.includes(index)) {
              if (Object.is(this.details['queType'], '长期')) {
                sums[index] = sums[index].toFixed(1)
              }
              if (Object.is(this.details['queType'], '定期')) {
                console.log(column)
                sums[index] = (sums[index] / this.details['problems'].length).toFixed(0)
              }
            }
            sums[index] += ' 分'
          } else {
            sums[index] = ''
          }
        }
      })
      // console.log(sums)
      return sums
    },
    // 考核历史
    async assessDateHistory() {
      const data = {
        assessDate: this.evaluation['assessDate'],
        conId: this.$route.params['cid']
      }
      try {
        const r = await getAssessmentHistoryByDate(data)
        this.details = r['data']
        this.details['problems'].map((item) => {
          if (Object.is(item.ansAnswer, '是')) {
            item.scoreGet = 100
          }
          if (Object.is(item.ansAnswer, '否')) {
            item.scoreGet = 0
          }
        })
        // console.log(this.details['queType'])
      } catch (e) {
        console.log(e)
      }
    },
    // 提交
    async submit() {
      const answers = []
      this.details['problems'].map((item) => {
        answers.push({
          proId: item.proId,
          scoreGet: Number(item.scoreGet)
        })
      })
      const data = {
        assessDate: this.evaluation['assessDate'],
        queId: this.details['queId'],
        version: this.details['version'],
        conId: this.$route.params['cid'],
        answers: answers
      }
      try {
        const evaluationFlag = await this.$refs['evaluationRule'].validate()
        if (evaluationFlag) {
          await answerQuestionnaire(data)
          this.$message({
            message: '问卷评价成功！',
            type: 'success'
          })
          this.evaluates()
          this.getDetails()
          this.refreshEvaTableData()
          // console.log(r['data'], this.details['problems'])
        }
      } catch (e) {
        console.log(e)
      } finally {
        await getContractPerformanceByConId(this.$route.params['cid'])
      }
    }
  }
}
</script>

<style scoped>
</style>
