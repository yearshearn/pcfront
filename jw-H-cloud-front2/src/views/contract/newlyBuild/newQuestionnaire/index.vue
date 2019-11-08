<template>
  <div style="padding:20px">
    <el-form
      ref="questionRule"
      :rules="questionRule"
      :model="submit['tProblem']"
      label-position="right"
      label-width="90px"
    >
      <el-row :gutter="15">
        <el-col :span="8">
          <el-form-item label="问卷类型:" prop="queType">
            <el-select
              v-if="Object.is(queType, '')"
              v-model="submit['tProblem']['queType']"
              style="width:58%"
              placeholder="请选择问卷类型"
              clearable
              @change="changeQueType"
            >
              <el-option key="定期" label="定期" value="定期">定期</el-option>
              <el-option key="长期" label="长期" value="长期">长期</el-option>
            </el-select>
            <el-input v-else v-model="submit['tProblem']['queType']" style="width:58%" readonly/>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="问卷名称:" prop="queName">
            <el-input
              v-model="submit['tProblem']['queName']"
              placeholder="请输入问卷名称"
              clearable
              style="width:200px"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="15">
        <el-col v-if="regular" :span="6">
          <el-form-item label="问题名称:">
            <el-input
              v-model="question['questionName']"
              placeholder="请输入问题名称"
              clearable
              style="width:200px"
            />
          </el-form-item>
        </el-col>
        <el-col v-if="longTerm" :span="6">
          <el-form-item label="工作内容:">
            <el-input
              v-model="question['workContent']"
              placeholder="请输入工作内容"
              clearable
              style="width:200px"
            />
          </el-form-item>
        </el-col>
        <el-col v-if="longTerm" :span="6">
          <el-form-item label="检查/扣分:">
            <el-input
              v-model="question['insDed']"
              placeholder="请输入检查/扣分内容"
              clearable
              style="width:200px"
            />
          </el-form-item>
        </el-col>
        <el-col v-if="longTerm" :span="6">
          <el-form-item label="标准分:">
            <el-input-number
              v-model.number="question['score']"
              :min="0"
              :max="100"
              :controls="false"
              placeholder="请输入标准分值"
              clearable
              style="width:200px"
            />
          </el-form-item>
        </el-col>
        <el-col :span="6" align="center">
          <el-button
            v-if="addQuestion"
            plain
            type="primary"
            @click.native.prevent="addQuestionName"
          >新增问题</el-button>
        </el-col>
      </el-row>
      <el-row :gutter="15">
        <el-col :span="12">
          <el-form-item label="问卷备注:">
            <el-input
              v-model="submit['tProblem']['comments']"
              :autosize="{ minRows: 5, maxRows: 5}"
              placeholder="请输入备注"
              type="textarea"
              resize="none"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <!--监听子组件触发的事件,然后调用方法-->
      <RegularQuestion
        v-if="regular"
        :regular-data="submit['tProblem']['proProblem']"
      />
      <LongTermQuestion
        v-if="longTerm"
        :long-term-data="submit['tProblem']['proProblem']"
      />
      <el-row>
        <el-col :offset="22" :span="2" align="center">
          <el-button
            :loading="submitLoading"
            plain
            type="primary"
            @click.native.prevent="addQuestionNaire"
          >{{ submitName }}</el-button>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import { RegularQuestion, LongTermQuestion } from './templates'

import { getNewQuestionNaire } from '@/api/contract.js'

import { checkQuestionName } from '@/utils/validate/contract'

export default {
  // 公共组件
  components: {
    RegularQuestion,
    LongTermQuestion
  },
  props: {
    // 取消弹框
    closeDialog: {
      type: Function,
      default: null
    },
    // 问卷类型
    queType: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      // 提交加载中
      submitLoading: false,
      // 提交
      submit: {
        // 新建问卷
        tProblem: {
          // 问卷类型
          queType: '',
          // 问卷名称
          queName: '',
          // 问卷备注
          comments: '',
          // 问卷问题组
          proProblem: []
        }
      },
      // 问卷
      question: {
        // 问题次序
        proOrder: 1,
        // 问题名称
        questionName: '',
        // 工作内容
        workContent: '',
        // 检查/扣分
        insDed: '',
        // 标准分
        score: ''
      },
      // 新建问卷判断
      questionRule: {
        // 问卷类型
        queType: [
          { required: true, message: '请选择问卷类型', trigger: 'blur' }
        ],
        // 问卷名称
        queName: [
          { required: true, message: '请输入问卷名称', trigger: 'blur' },
          { validator: checkQuestionName, trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    // 提交名称
    submitName() {
      if (Object.is(this.submitLoading, true)) {
        return '提交中'
      }
      return '提交'
    },
    // 定期判断
    regular() {
      if (Object.is(this.submit['tProblem']['queType'], '定期')) {
        return true
      }
      return false
    },
    // 长期判断
    longTerm() {
      if (Object.is(this.submit['tProblem']['queType'], '长期')) {
        return true
      }
      return false
    },
    // 添加问题
    addQuestion() {
      if (!Object.is(this.submit['tProblem']['queType'], '')) {
        return true
      }
      return false
    }
  },
  created() {},
  async mounted() {
    if (this.queType) {
      this.submit['tProblem']['queType'] = this.queType
    }
  },
  methods: {
    // 问卷类型改变
    changeQueType() {
      this.submit['tProblem']['comments'] = ''
      this.submit['tProblem']['proProblem'] = []
    },
    // 添加问题名称
    addQuestionName() {
      if (Object.is(this.submit['tProblem']['queType'], '定期')) {
        if (Object.is(this.question['questionName'], '')) {
          this.$message({
            message: '问题名称不能为空！',
            type: 'error'
          })
          return
        }
        this.submit['tProblem']['proProblem'].push({
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
      }
      if (Object.is(this.submit['tProblem']['queType'], '长期')) {
        if (Object.is(this.question['workContent'], '')) {
          this.$message({
            message: '工作内容不能为空！',
            type: 'error'
          })
          return
        }
        if (Object.is(this.question['score'], '')) {
          this.$message({
            message: '标准分不能为空！',
            type: 'error'
          })
          return
        }
        this.submit['tProblem']['proProblem'].push({
          workContent: this.question['workContent'].trim(),
          insDed: this.question['insDed'].trim(),
          score: Number(this.question['score'])
        })
        this.question['workContent'] = ''
        this.question['insDed'] = ''
        this.question['score'] = ''
      }
      // console.log(this.submit['tProblem'])
    },
    // 新建问卷提交
    async addQuestionNaire() {
      try {
        for (const item of this.submit['tProblem']['proProblem']) {
          item['proOrder'] = Number(this.question['proOrder']++)
        }
        const questionFlag = await this.$refs['questionRule'].validate()
        if (questionFlag) {
          this.submitLoading = true
          const r = await getNewQuestionNaire(this.submit['tProblem'])
          // console.log(r)
          this.$message({
            message: '创建成功！',
            type: 'success'
          })
          if (this.closeDialog) {
            this.closeDialog(r['data'], this.submit['tProblem']['queName'])
          }
          this.$refs['questionRule'].resetFields()
          this.submit['tProblem']['proProblem'] = []
        }
        // console.log(r['data'])
      } catch (e) {
        console.log(e)
      } finally {
        this.submitLoading = false
      }
    }
  }
}
</script>

<style scoped>

</style>
