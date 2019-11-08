<template>
  <div>
    <el-dialog
      :visible="editorDialog"
      :title="titleName"
      :before-close="closeDialog"
      center>
      <el-form
        ref="invoiceRule"
        :rules="invoiceRule"
        :model="invoice"
        label-width="80px"
        label-position="right">
        <el-row :gutter="15">
          <el-col :span="12">
            <el-form-item label="发票号码:" prop="pipelineNum">
              <el-input v-model="invoice['pipelineNum']" clearable placeholder="请输入发票号码"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="金额:" prop="amount">
              <el-input v-model="invoice['amount']" clearable placeholder="请输入金额"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="15">
          <el-col :span="12">
            <el-form-item label="备注:" prop="description">
              <el-input
                :autosize="{ minRows: 3, maxRows: 3}"
                v-model="invoice['description']"
                type="textarea"
                resize="none"
                placeholder="请输入备注"
                maxlength="150"
                show-word-limit/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="附件:">
              <el-upload
                ref="upload"
                :on-change="changeHandler"
                :file-list="fileList"
                :on-remove="onRemoveHandler"
                :on-success="successHandler"
                :on-error = "errorHandler"
                :auto-upload="false"
                :before-remove="removeHandler"
                :on-preview="handlePreview"
                :action="uploadUrl"
                :before-upload="beforeUpload"
                :limit="5"
                :on-exceed="exceedHandler"
                class="upload-demo">
                <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
                <el-button
                  v-if="uploadShow"
                  :disabled="uploadDisabled"
                  style="margin-left: 20px;"
                  size="small"
                  type="success"
                  @click="submitUpload">上传文件</el-button>
                <el-button
                  v-if="uploadShow"
                  :disabled="fileDisabled"
                  size="small"
                  type="primary"
                  @click="downloadContractFile(invoice['invoiceId'])">下载</el-button>
              </el-upload>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="45">
          <el-col :span="12" align="right">
            <el-button type="primary" @click="save">{{ Object.is(titleName,'新增') ? '创建' : '保存' }}</el-button>
          </el-col>
          <el-col :span="12">
            <el-button @click="remove">清除</el-button>
          </el-col>
        </el-row>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import {
  findInvoiceById,
  checkInsertAmount,
  checkUpdateAmount,
  checkPipelineNumExist
} from '@/api/contract'

import { mapGetters } from 'vuex'

import { customUploadSuccessHandler } from '@/utils'

import { getFileList, removeFile } from '@/api/utils'

import { getToken } from '@/utils/auth'

import {
  insertInvoice,
  updateInvoice
} from '@/api/contract'

export default {
  props: {
    // 合同id
    conId: {
      type: String,
      default: ''
    },
    // 标题
    titleName: {
      type: String,
      default: ''
    },
    // 弹框显示
    editorDialog: {
      type: Boolean,
      default: false
    },
    // 发票号码
    invoiceId: {
      type: String,
      default: ''
    },
    // 关闭
    closeDialog: {
      type: Function,
      default: null
    },
    // 获取列表
    invoiceList: {
      type: Function,
      default: null
    }
  },
  data() {
    // 发票号码
    const pipelineNumChange = (rule, value, callback) => {
      const regular = /^\d{0,10}?$/g
      if (!value) {
        return callback(new Error('请输入发票号码'))
      }
      if (!Number.isInteger(Number(value))) {
        callback(new Error('请输入整数值'))
      }
      if (!regular.test(value)) {
        return callback(new Error('发票号码长度不能超过10位'))
      }
      callback()
    }
    // 发票号码是否存在
    const checkPipelineNumName = async(rule, value, callback) => {
      try {
        const data = {}
        if (Object.is(this.titleName, '新增')) {
          data['pipelineNum'] = this.invoice['pipelineNum']
        } else {
          data['invoiceId'] = parseFloat(this.invoiceId)
          data['pipelineNum'] = this.invoice['pipelineNum']
        }
        const r = await checkPipelineNumExist(data)
        if (r['data'] === 1) {
          callback()
        } else {
          callback(new Error('发票编码已存在'))
        }
      } catch (e) {
        callback(new Error('网络故障，请稍后重试'))
      }
    }
    // 金额
    const amountChange = (rule, value, callback) => {
      const regular = /^\d{0,8}(\.\d{0,2})?$/g
      const number = /^-?\d*\.?\d*$/g
      const values = ['', '0.00']
      if (!number.test(value) || values.includes(value)) {
        callback(new Error('金额不能为空,且只能输入数字值'))
      }
      if (!regular.test(value)) {
        return callback(new Error('金额只能输入2位小数和一个点'))
      }
      callback()
    }
    // 金额是否超出
    const checkAmountChange = async(rule, value, callback) => {
      try {
        const data = {
          conId: this.conId,
          invoiceId: parseFloat(this.invoiceId),
          amount: String(this.invoice['amount'])
        }
        let r = {}
        if (this.titleName === '编辑') {
          r = await checkUpdateAmount(data)
          // console.log(r['data'])
        }
        if (this.titleName === '新增') {
          r = await checkInsertAmount(data)
          // console.log(r['data'])
        }
        if (r['data'] === 0) {
          return callback(new Error('金额超出合同总金额!'))
        }
      } catch (error) {
        callback(new Error('网络故障，请稍后重试'))
      }
    }
    return {
      inUpload: false,
      uploadDisabled: true,
      fileDisabled: false,
      uploadShow: false,
      fileListLength: 0,
      waitUploadFileListLength: 0,
      unloadInvoiceId: null,
      uploadFileList: [],
      fileList: [],
      invoice: {},
      // 提交验证
      invoiceRule: {
        // 发票号码
        pipelineNum: [
          { validator: pipelineNumChange, trigger: 'blur' },
          { validator: checkPipelineNumName, trigger: 'blur' }
        ],
        // 金额
        amount: [
          { validator: amountChange, trigger: 'blur' },
          { validator: checkAmountChange, trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    ...mapGetters([
      'name',
      'realName',
      'userId'
    ]),
    baseUrl() {
      return process.env.BASE_API
    },
    uploadUrl() {
      return `${this.baseUrl}/wr/uploadFile?projectName=invoice&projectId=${this.unloadInvoiceId}&author=${this.name}&authorization=${getToken()}`
    }
  },
  watch: {
    editorDialog() {
      if (this.editorDialog === true && this.titleName === '编辑') {
        this.unloadInvoiceId = this.invoiceId
        this.uploadShow = true
        this.getFindInvoiceById()
      } else {
        this.uploadShow = false
        this.invoice = {}
      }
    }
  },
  created() {},
  async mounted() {
  },
  methods: {
    changeHandler(file, fileList) {
      const fileName = file['name']
      this.fileListLength = fileList.filter(i => {
        return i['status'] === 'success'
      }).length
      this.uploadFileList = fileList
      this.waitUploadFileListLength = fileList.length
      if (this.waitUploadFileListLength !== 0) {
        this.uploadDisabled = false
      }
      for (const fileKey in fileList) {
        if (fileList[fileKey]['name'] === fileName && fileList[fileKey] !== file) {
          this.changeFileList(fileList, fileKey, file, 'repleace')
          break
        }
      }
    },
    onRemoveHandler(file, fileList) {
      this.fileListLength = fileList.filter(i => {
        return i['status'] === 'success'
      }).length
      this.uploadFileList = fileList
    },
    createWrHandler() {
      this.$message({
        message: '上传成功！',
        type: 'success'
      })
      this.fileDisabled = false
      this.$refs['upload'].clearFiles()
    },
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
    exceedHandler() {
      this.$message({
        message: '最多上传五个文件！',
        type: 'error'
      })
    },
    errorHandler(err, file, fileList) {
      console.log(err)
      this.$message({
        message: '网络故障，请稍后重试！',
        type: 'error'
      })
    },
    async getFileList() {
      if (!this.invoiceId) {
        return
      }
      const params = {
        projectId: this.invoiceId,
        projectName: 'invoice'
      }
      const r = await getFileList(params)
      this.fileList = r['data'].map(i => {
        return {
          name: i['fileName'],
          projectId: i['projectId'],
          projectName: i['projectName']
        }
      })
      this.uploadFileList = this.fileList
      this.fileListLength = this.fileList.length
    },
    async changeFileList(fileList, index, file, state) {
      try {
        await this.$confirm(`检测到同名文件：${file['name']}，是否替换？`, '提示', {
          confirmButtonText: '是',
          cancelButtonText: '否',
          type: 'warning'
        })
        fileList.pop()
        fileList.splice(index, 1, file)
      } catch (e) {
        fileList.pop()
        console.log(e)
      }
    },
    async successHandler(res, file, fileList) {
      if (this.modeType === 'edit') {
        try {
          await customUploadSuccessHandler(res)
          this.$message({
            message: `${file['name']}上传成功！`,
            type: 'success'
          })
        } catch (e) {
          file['status'] = 'ready'
          file['customStatus'] = 'uploaded'
          this.$message({
            message: `${file['name']}上传失败！原因：${e.msg}`,
            type: 'error'
          })
          console.log(e)
        }
      } else {
        const flag = fileList.every(item => {
          return item['status'] === 'success'
        })
        if (flag) {
          this.createWrHandler()
        }
      }
    },
    async removeHandler(file) {
      try {
        if (file['projectName'] && file['projectId']) {
          const params = {
            projectName: file['projectName'],
            projectId: file['projectId'],
            fileName: file['name']
          }
          await removeFile(params)
          this.$message({
            message: '删除成功！',
            type: 'success'
          })
        }
      } catch (e) {
        return Promise.reject()
      }
      try {
        if (file['response']) {
          const data = file['response']['data']
          if (data['projectName'] && data['projectId']) {
            const params = {
              projectName: data['projectName'],
              projectId: data['projectId'],
              fileName: file['name']
            }
            await removeFile(params)
            this.$message({
              message: '删除成功！',
              type: 'success'
            })
          }
        }
      } catch (e) {
        return Promise.reject()
      }
    },
    async handlePreview(file) {
      if (file['projectName'] && file['projectId']) {
        window.open(`${this.baseUrl}/wr/downFile?projectName=${file['projectName']}&projectId=${file['projectId']}&fileName=${file['name']}`)
      }
      if (file['response']) {
        const data = file['response']['data']
        window.open(`${this.baseUrl}/wr/downFile?projectName=${data['projectName']}&projectId=${data['projectId']}&fileName=${data['fileName']}`)
      }
    },
    // 上传
    async submitUpload() {
      this.$refs.upload.submit()
    },
    // 下载附件
    async downloadContractFile(invoiceId) {
      try {
        window.open(`${process.env.BASE_API}/wr/downFile?projectName=invoice&projectId=${this.invoiceId}&author=${this.name}&authorization=${getToken()}`)
      } catch (e) {
        console.log(e)
      } finally {
        () => {}
      }
    },
    // 获取详情
    async getFindInvoiceById() {
      try {
        const params = {
          invoiceId: this.invoiceId
        }
        const r = await findInvoiceById(params)
        this.invoice = r['data']
        if (this.invoice['fileList'].length === 0) {
          this.fileDisabled = true
        } else {
          this.fileDisabled = false
        }
        // console.log(r['data']['fileList'].length)
      } catch (error) {
        console.log(error)
      }
    },
    // 保存
    async save() {
      try {
        await this.$refs['invoiceRule'].validate()
        const data = {
          conId: this.conId,
          requestor: this.userId,
          amount: this.invoice['amount'],
          pipelineNum: this.invoice['pipelineNum'],
          description: this.invoice['description']
        }
        if (Object.is(this.titleName, '编辑')) {
          data['invoiceId'] = parseFloat(this.invoiceId)
        }
        let message = ''
        if (Object.is(this.titleName, '新增')) {
          message = '新增'
          const r = await insertInvoice(data)
          this.unloadInvoiceId = r['data']['invoiceId']
          if (this.waitUploadFileListLength !== 0) {
            // console.log(this.waitUploadFileListLength)
            setTimeout(this.submitUpload, 1000)
          }
        }
        if (Object.is(this.titleName, '编辑')) {
          message = '编辑'
          await updateInvoice(data)
        }
        this.$message({
          message: message + '成功！',
          type: 'success'
        })
        this.closeDialog()
        this.invoiceList()
      } catch (error) {
        console.log(error)
      } finally {
        () => {}
      }
    },
    // 清除
    remove() {
      this.$refs['invoiceRule'].resetFields()
    }
  }
}
</script>

<style>

</style>
