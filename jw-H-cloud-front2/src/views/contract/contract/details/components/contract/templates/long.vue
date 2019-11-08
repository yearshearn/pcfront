<template style="height:100%">
  <el-container>
    <el-main height="95%">
      <el-form
        v-loading="detaileLoading"
        ref="ruleForm"
        :model="contractDetails"
        :rules="canEdit ? formRule :{}"
        label-width="150px"
        label-position="right">
        <el-row>
          <el-col :span="6" >
            <el-form-item label="合同编码：" prop="conId">
              <el-input v-model="contractDetails['conId']" disabled style="width:85%"/>
            </el-form-item>
          </el-col>
          <el-col :span="6" >
            <el-form-item label="合同名称：" prop="conName">
              <el-input v-model="contractDetails['conName']" :readonly = "!canEdit" style="width:85%"/>
            </el-form-item>
          </el-col>

          <el-col :span="6" >
            <el-form-item label="医院责任人：" prop="resPerson">
              <el-select
                :readonly = "!canEdit"
                v-model="contractDetails['resPerson']"
                style="width:85%"
                placeholder="请选择责任人">
                <el-option
                  v-for="item in resPersonData"
                  :disabled="!canEdit"
                  :key="item.userId"
                  :label="item.userName"
                  :value="item.userId"/>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6" >
            <el-form-item label="合同类型：" prop="conType">
              <el-select v-model="contractDetails['conType']" disabled style="width:85%" >
                <el-option
                  v-for="item in conTypesArr"
                  :disabled="!canEdit"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"/>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6" >
            <el-form-item label="合同优先级：">
              <el-select v-model="contractDetails['conPriority']" :readonly = "!canEdit" style="width:85%">
                <el-option
                  v-for="(item,key) in conPriorityArr"
                  :disabled="!canEdit"
                  :key="key"
                  :label="item.label"
                  :value="item.value"/>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6" >
            <el-form-item label="签约期限(年)：" prop="conTerm">
              <el-select v-model="contractDetails['conTerm']" :readonly = "!canEdit" style="width:85%">
                <el-option
                  v-for="(item,key) in termTimeArr"
                  :disabled="!canEdit"
                  :key="key"
                  :label="item.label"
                  :value="item.value"/>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6" >
            <el-form-item label="合同联系人：" prop="maintPeople">
              <el-input v-model="contractDetails['maintPeople']" :readonly = "!canEdit" style="width:85%"/>
            </el-form-item>
          </el-col>
          <el-col :span="6" >
            <el-form-item label="联系人电话：" prop="maintPhone">
              <el-input v-model="contractDetails['maintPhone']" :readonly = "!canEdit" style="width:85%"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="问卷名称：" prop="queName">
              <el-input
                v-model="contractDetails['queName']"
                readonly
                style="width:85%"
              >
                <SelectQuestionDialog slot="append" :can-edit="canEdit" :select-callback="selectHandler" :con-type="conType"/>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8" >
            <el-form-item label="起止时间：" prop="dateStart">
              <el-input v-show="false" v-model="contractDetails['dateStart']"/>
              <el-date-picker
                v-model="startAndEndTime"
                :readonly = "!canEdit"
                :picker-options="contractStartPicker"
                value-format="yyyy-MM-dd"
                style="width:85%"
                type="daterange"
                range-separator="-"
                start-placeholder="开始月份"
                end-placeholder="结束月份"/>
            </el-form-item>
          </el-col>
          <el-col :span="2" >
            <el-upload
              :disabled="!canEdit"
              :http-request="uploadFunc"
              :before-upload="beforeUpload"
              :show-file-list="false"
              class="upload-demo"
              action="占位">
              <el-button :disabled="!canEdit" :loading="isUploading" size="small" type="primary">
                {{ isUploading?"上传中":"点击上传" }}
              </el-button>
            </el-upload>
          </el-col>
          <el-col :span="2">
            <el-button :disabled="!contractDetails['file']" size="small" type="primary" @click="downloadContractFile">下载附件</el-button>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">
            <el-form-item label="合同编辑人：">
              <el-input v-model="contractDetails['conContacts']" :readonly = "!canEdit" style="width:85%"/>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="合同总金额:" prop="totalAmount">
              <el-input
                v-model="contractDetails['totalAmount']"
                :readonly = "!canEdit"
                style="width:85%"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="说明：">
              <el-input v-model="contractDetails['comments']" :readonly = "!canEdit" :autosize="{minRows:7}" resize="none" type="textarea"/>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row v-if="editRoleFlag()">
          <el-col v-if="!canEdit && contractDetails['conStatus']!=='AI'" :span="2">
            <el-button :disabled="contractDetails['conStatus']=='AI'" @click="changeCanEdit">修改</el-button>
          </el-col>
          <el-col v-if="canEdit" :span="4">
            <el-button @click="cancelSave">取消</el-button>
            <el-button type="primary" @click="save">保存</el-button>
          </el-col>
        </el-row>
      </el-form>
    </el-main>
  </el-container>
</template>

<script>
import { editRoleFlag } from '@/utils/buttonRole/contract'
import { phoneReg } from '@/utils/validate/reg'
import { getToken } from '@/utils/auth'
// api接口
import {
  getContractDetails,
  findContractResPerson,
  updateContractDetails,
  uploadContractFile
} from '@/api/contract'
// 引入模板
import {
  default as SelectQuestionDialog
} from '@/views/contract/contract/details/components/questionnaire/selectQuestionDialog'
// 过滤器
import { dateFormat } from '@/filter'
// 模拟枚举值列表
import {
  conTypesArr,
  conPriorityArr,
  conStatusArr,
  termTimeArr
} from '@/utils/enumerationList/contract'
// import { getList } from '@/api/table'
// 验证方法
import {
// validateContractID,
// validateContractName
} from '@/utils/validate/contract'

import { default as permission } from '@/directive/permission'

export default {
  directives: { permission },
  components: { SelectQuestionDialog },
  filters: {
    dateFormat
  },
  props: {
    conType: {
      type: String,
      default: ''
    }
  },
  data() {
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
      editRoleFlag,
      formRule: {
        conId: [
          { required: true, message: '请输入合同编码' }
          // { required: true, type: 'array', trigger: 'blur', message: '测试' }
        ],
        conName: [
          { required: true, message: '请输入合同名称', trigger: 'change' }
        ],
        maintPeople: [
          { required: true, message: '请输入合同联系人' }
        ],
        maintPhone: [
          { required: true, message: '请输入联系人电话' },
          { message: '请输入正确的手机号', pattern: phoneReg }
        ],
        resPerson: [
          { required: true, message: '请输入医院联系人' }
        ],
        conType: [
          { required: true, message: '请选择合同类型' }
        ],
        conTerm: [
          { required: true, message: '请选择签约期限' }
        ],
        totalAmount: [
          { required: true, validator: totalAmountChange, trigger: 'change' }
        ],
        conStatus: [
          { required: true, message: '请选择合同状态' }
        ],
        queName: [
          { required: true, message: '请绑定问卷' }
        ],
        dateStart: [
          { required: true, message: '请选择起止时间' }
        ]
      },
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
      isUploading: false,
      conTypesArr,
      conPriorityArr,
      conStatusArr,
      termTimeArr,
      detaileLoading: true,
      startAndEndTime: null,
      contractDetails: {},
      resPersonData: [],
      canEdit: false
    }
  },
  watch: {
    startAndEndTime(v) {
      if (v && v[0]) {
        this.contractDetails['dateStart'] = v[0]
      } else {
        this.contractDetails['dateStart'] = ''
      }
    }
  },
  created() {
  },
  async mounted() {
    this.getDetails()
    this.findContractResPerson()
  },
  methods: {
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
    async downloadContractFile() {
      try {
        window.open(`${process.env.BASE_API}/contract/downFile?conId=${this.contractDetails['conId']}&authorization=${getToken()}`)
      } catch (e) {
        console.log(e)
      } finally {
        console.log('download ok')
      }
    },
    // 上传文件前判断文件大小，不得超过100M
    beforeUpload(file) {
      const fileSize = file.size / 1024 / 1024 < 100
      if (!fileSize) {
        this.$message({
          message: '上传文件大小不能超过 100MB!',
          type: 'warning'
        })
      }
      return fileSize
    },
    async uploadFunc(v) {
      this.isUploading = true
      try {
        const data = new FormData()
        data.append('conId', this.contractDetails['conId'])
        data.append('file', v['file'])
        await uploadContractFile(data)
        this.$message({
          message: '上传成功！',
          type: 'success'
        })
        // console.log(r)
      } catch (e) {
        console.log(e)
      } finally {
        this.isUploading = false
      }
    },
    changeCanEdit() {
      this.canEdit = !this.canEdit
    },
    cancelSave() {
      this.clearValidate()
      this.canEdit = false
      this.getDetails()
    },
    async getDetails() {
      this.detaileLoading = true
      try {
        const r = await getContractDetails(this.$route.params['cid'])
        this.contractDetails = r['data']
        if (!r['data']['dateStart'] || !r['data']['dateEnd']) {
          this.startAndEndTime = []
        } else {
          this.startAndEndTime = [r['data']['dateStart'], r['data']['dateEnd']]
        }
      } catch (e) {
        console.log(e)
      } finally {
        this.detaileLoading = false
      }
    },
    async save() {
      this.detaileLoading = true
      try {
        const flag = await this.$refs['ruleForm'].validate()
        if (flag) {
          this.contractDetails['dateStart'] = this.startAndEndTime[0]
          this.contractDetails['dateEnd'] = this.startAndEndTime[1]
          delete this.contractDetails['file']
          await updateContractDetails(this.contractDetails)
          // this.changeCanEdit()
          this.$store.commit('SET_QUES_DATA_REFRESH_FLAG', true)
          this.$message({
            message: '更新成功！',
            type: 'success'
          })
          this.canEdit = false
          this.getDetails()
          this.clearValidate()
        }
      } catch (e) {
        console.log(e)
      } finally {
        this.detaileLoading = false
      }
    },
    clearValidate() {
      this.$refs['ruleForm'].clearValidate()
    },
    selectHandler(v) {
      // console.log(v['queId'], v['queName'])
      this.contractDetails['queId'] = v['queId']
      this.contractDetails['queName'] = v['queName']
    }
  }
}
</script>

