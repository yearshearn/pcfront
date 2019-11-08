<template style="height:100%">
  <el-container style="padding:30px">
    <el-header>
      <el-button @click="$router.go(-1)">返回</el-button>
    </el-header>
    <el-main style="margin-top:-15px">
      <el-card
        v-loading="isLoading"
        style="padding-top:15px">
        <el-form
          ref="form"
          :model="formData"
          :rules="canEdit?formRules:{}"
          :disabled="!canEdit"
          label-width="120px">
          <el-row>
            <el-col :span="8">
              <el-form-item label="地点:" prop="position">
                <el-cascader
                  :options="enumerationVal['building']"
                  :props="props"
                  v-model="formData.position"
                  style="width:85%" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="维修类型:" prop="repairType">
                <el-select
                  v-model="formData.repairType"
                  disabled
                  style="width:85%"
                  placeholder="请选择">
                  <el-option
                    v-for="item in enumerationVal['repairTypeOptions']"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"/>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="所属设备:" prop="eqId">
                <el-input
                  v-model="formData.eqId"
                  style="max-width:85%"/>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="指派给到:" prop="cfId">
                <el-select
                  v-model="formData.cfId"
                  style="width:85%"
                  placeholder="请选择">
                  <el-option
                    v-for="item in enumerationVal['cfIdOptions']"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"/>
              </el-select></el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="提出问题者:" prop="requestor">
                <el-input
                  v-model="formData.requestor"
                  style="max-width:85%"/>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="优先级:" prop="priority">
                <el-select
                  v-model="formData.priority"
                  style="width:85%"
                  placeholder="请选择">
                  <el-option
                    v-for="item in enumerationVal['priorityOptions']"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"/>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="问题类型:" prop="probType">
                <el-select
                  v-model="formData.probType"
                  style="width:85%"
                  placeholder="请选择">
                  <el-option
                    v-for="item in enumerationVal['probTypeOptions']"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"/>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="是否返修:" prop="rework">
                <el-switch
                  v-model="formData.rework"
                  active-value="是"
                  inactive-value="否"
                  style="max-width:85%"
                  active-text="是"
                  inactive-text="否"/>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="16">
              <el-form-item label="说明:">
                <el-input
                  v-model="formData.description"
                  :autosize="{minRows:7}"
                  resize="none"
                  type="textarea"/>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="附加文档:">
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
                  :on-progress="progressHandler"
                  :action="uploadUrl"
                  :before-upload="beforeUpload"
                  :limit="5"
                  :on-exceed="exceedHandler"
                  class="upload-demo">
                  <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
                  <el-button v-if="modeType === 'edit'" style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传到服务器</el-button>
                  <el-button v-if="modeType === 'edit'" size="small" type="primary" @click="downloadAll">下载全部</el-button>
                </el-upload>
                <!-- <el-input
                  v-model="formData.document"
                  style="max-width:85%"/> -->
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <el-row v-if="modeType === 'create' " align="center">
          <el-col :span="24" style="text-align:center">
            <el-button type="primary" @click="onSubmit">创建</el-button>
          </el-col>
        </el-row>
        <el-row v-if="modeType === 'edit' /* && canEditFlag*/" align="center">
          <el-col :span="24" style="text-align:center">
            <el-button v-if="canEdit" type="primary" @click="onSubmit">保存</el-button>
            <el-button v-if="!canEdit" type="primary" @click="changeCanEdit(true)">修改</el-button>
            <el-button v-if="canEdit" type="primary" @click="cancelEdit">取消</el-button>
          </el-col>
        </el-row>
      </el-card>

    </el-main>
  </el-container>

</template>

<script>
import { customUploadSuccessHandler } from '@/utils'
import { canEditFlag } from '@/utils/buttonRole/workorder'
import { getAllBuildingDataById } from '@/api/enumeration'
import {
  getWorkorderDetails,
  createWorkorder,
  updateWorkorder,
  getCfList
} from '@/api/workorder/list'

import {
  repairType as repairTypeOptions,
  priority as priorityOptions
} from '@/utils/enumerationList/workorder'
import { getToken } from '@/utils/auth'
import { getFileList, removeFile } from '@/api/utils'
// import { transformBuildingData } from '@/utils/dataTransform'
import { mapGetters } from 'vuex'

import {
  getProblemOptions
} from '@/api/enumeration'

export default {
  components: { },
  filters: {
  },
  props: {
    modeType: {
      type: String,
      default: 'create'
    }
  },
  data() {
    return {
      position: [],
      inUpload: false,
      fileListLength: 0,
      waitUploadFileListLength: 0,
      uploadFileList: [],
      fileList: [],
      enumerationVal: {
        repairTypeOptions,
        priorityOptions,
        probTypeOptions: [],
        building: [],
        cfIdOptions: []
      },
      props: {
        label: 'name',
        lazy: true,
        async lazyLoad(node, resolve) {
          const { data } = node
          // if (level === 0) {
          //   return resolve([])
          // }
          // if (!data) return resolve([])
          if (data && data.children && data.children.length !== 0) {
            return resolve([])
          }
          const params = {
          }
          if (data) {
            params['blId'] = data['blId'] || ''
            params['flId'] = data['flId'] || ''
          }
          try {
            const r = await getAllBuildingDataById(params)
            const targetData = []
            for (const item of r.data) {
              const temp = {
                blId: item['blId'] || '',
                flId: item['flId'] || '',
                rmId: item['rmId'] || '',
                name: item['name'] || '未命名',
                leaf: item['leaf'],
                children: item['children'] || []
              }
              temp['value'] = temp['rmId'] || temp['flId'] || temp['blId']
              targetData.push(temp)
            }
            resolve(targetData)
          } catch (e) {
            console.log(e)
            resolve([])
          }
        }
      },
      canEditFlag,
      canEdit: true,
      isLoading: false,
      wrId: '',
      formData: {
        probType: '',
        position: [],
        repairType: '维修',
        eqId: '',
        cfId: '',
        requestor: '',
        priority: '',
        rework: '',
        document: '',
        description: '',
        wrStatus: ''
      },
      formRules: {
        position: [
          { required: true, message: '请输入位置信息' }
        ],
        repairType: [
          { required: true, message: '请选择维修类型' }
        ],
        eqId: [
          { required: false, message: '请选择所属设备' }
        ],
        cfId: [
          { required: true, message: '请选择指派给谁' }
        ],
        requestor: [
          { required: true, message: '请填写提交人' }
        ],
        priority: [
          { required: true, message: '请选择优先级' }
        ],
        rework: [
          { required: false, message: '请选择是否返修' }
        ]
      }
    }
  },
  computed: {
    baseUrl() {
      return process.env.BASE_API
    },
    ...mapGetters([
      'name'
    ]),
    buildingOptions() {
      return []
    },
    uploadUrl() {
      const id = this.wrId
      console.log('com:', id)
      return `${this.baseUrl}/wr/uploadFile?projectName=wr&projectId=${this.wrId}&author=${this.name}&authorization=${getToken()}`
    }
  },
  watch: {
    formData: {
      deep: true,
      handler(v) {
      }
    },
    position(v) {
      console.log(v)
    }
  },
  created() {

  },
  async mounted() {
    // this.getAllBuildingData()
    if (this.modeType === 'edit') {
      this.editInit()
    }
    this.getCfList()
    this.getProblemOptions()
  },
  methods: {
    async getProblemOptions() {
      try {
        const params = {
          pageSize: 9999
        }
        const r = await getProblemOptions(params)
        this.enumerationVal['probTypeOptions'] = r['data'].map(i => {
          return {
            label: i['name'],
            value: i['id']
          }
        })
        console.log(r)
      } catch (e) {
        this.enumerationVal['probTypeOptions'] = []
        console.log(e)
      }
    },
    errorHandler(err, file, fileList) {
      console.log(err)
      this.$message({
        message: '网络故障，请稍后重试！',
        type: 'error'
      })
      this.isLoading = false
    },
    progressHandler(event, file, fileList) {
      console.log(event)
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
    exceedHandler() {
      this.$message({
        message: '最多上传五个文件！',
        type: 'error'
      })
    },
    downloadAll() {
      if (this.fileListLength !== 0) {
        const body = this.uploadFileList[0]['response'] ? this.uploadFileList[0]['response']['data'] : this.fileList[0]
        window.open(`${this.baseUrl}/wr/downFile?projectName=${body['projectName']}&projectId=${body['projectId']}&authorization=${getToken()}`)
      }
      // if (this.fileList.length > 0) {
      //   window.open(`${this.baseUrl}/jwkjPublicService/downFile?projectName=${this.fileList[0]['projectName']}&projectId=${this.fileList[0]['projectId']}&authorization=${getToken()}`)
      // }
    },
    onRemoveHandler(file, fileList) {
      this.fileListLength = fileList.filter(i => {
        return i['status'] === 'success'
      }).length
      this.uploadFileList = fileList
    },
    changeHandler(file, fileList) {
      const fileName = file['name']
      this.fileListLength = fileList.filter(i => {
        return i['status'] === 'success'
      }).length
      this.uploadFileList = fileList
      this.waitUploadFileListLength = fileList.length
      for (const fileKey in fileList) {
        if (fileList[fileKey]['name'] === fileName && fileList[fileKey] !== file) {
          this.changeFileList(fileList, fileKey, file, 'repleace')
          break
        }
      }
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
    clearFilesHandler() {
      this.$refs['upload'].clearFiles()
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
    async clickFile(file) {
      console.log(file)
    },
    async getFileList() {
      if (!this.wrId) {
        return
      }
      const params = {
        projectId: this.wrId,
        projectName: 'wr'
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
      // const flag = fileList.every(item => {
      //   return item['status'] === 'success' || item['customStatus'] === 'uploaded'
      // })
      // if (flag) {
      //   this.$message({
      //     message: '上传成功！',
      //     type: 'success'
      //   })
      //   this.getFileList()
      // }
    },
    customUpload(...arr) {
      console.log(arr)
    },
    async getCfList() {
      try {
        const r = await getCfList()
        this.enumerationVal['cfIdOptions'] = r['data'].map(i => {
          return {
            label: i['userName'],
            value: i['userId']
          }
        })
        console.log(this.enumerationVal)
      } catch (e) {
        console.log(e)
      }
    },
    async submitUpload() {
      this.$refs.upload.submit()
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
    // async getAllBuildingData(data) {
    //   try {
    //     const r = await getAllBuildingDataById()
    //     this.enumerationVal['building'] = transformBuildingData(r.data)
    //   } catch (e) {
    //     console.log(e)
    //   } finally {
    //     console.log(1)
    //   }
    // },
    async cancelEdit() {
      try {
        await this.editInit()
      } catch (e) {
        console.log(e)
      } finally {
        this.changeCanEdit(false)
        this.$refs['form'].clearValidate()
      }
    },
    changeCanEdit(flag) {
      this.canEdit = flag
    },
    createWrHandler() {
      this.$message({
        message: '创建成功！',
        type: 'success'
      })
      this.$refs['form'].resetFields()
      this.$refs['upload'].clearFiles()
      this.formData['description'] = ''
      this.isLoading = false
    },
    async onSubmit() {
      this.isLoading = true
      try {
        await this.$refs['form'].validate()
        const formData = JSON.parse(JSON.stringify(this.formData))
        const data = {
          'description': formData['description'],
          'eqId': formData['eqId'],
          'blId': formData['position'][0] || '',
          'flId': formData['position'][1] || '',
          'rmId': formData['position'][2] || '',
          'probType': formData['probType'],
          'priority': formData['priority'],
          'repairType': formData['repairType'],
          'requestor': formData['requestor'],
          'cfId': formData['cfId'],
          'rework': formData['rework'],
          'status': '',
          'workTeamId': '',
          'dateRequested': '',
          'dateCompleted': ''
        }
        // return console.log(data1)
        // const data = {
        //   position: formData['position'],
        //   repairType: formData['repairType'],
        //   eqId: formData['eqId'],
        //   cfId: formData['cfId'],
        //   requestor: formData['requestor'],
        //   priority: formData['priority'],
        //   rework: formData['rework'],
        //   document: formData['document'],
        //   description: formData['description']
        // }
        let r
        if (this.modeType === 'create') {
          r = await createWorkorder(data)
          this.wrId = r['data']['wrId']

          if (this.waitUploadFileListLength === 0) {
            this.createWrHandler()
          } else {
            setTimeout(this.submitUpload, 100)
          }
        } else {
          data['wrId'] = this.wrId
          data['wrStatus'] = formData['wrStatus']
          r = await updateWorkorder(data)
          this.$message({
            message: '更新成功！',
            type: 'success'
          })
          this.isLoading = false
        }
      } catch (e) {
        this.isLoading = false
        console.log(e)
      }
    },
    transformData(data) {
      const target = data.map(i => {
        const r = {
          blId: i['blId'] || '',
          flId: i['flId'] || '',
          rmId: i['rmId'] || '',
          name: i['name'] || '未命名',
          leaf: i['leaf'],
          children: i['children'] ? this.transformData(i['children']) : []
        }
        r['value'] = r['rmId'] || r['flId'] || r['blId']
        return r
      })
      return target
    },
    async getDetails() {
      this.isLoading = true
      try {
        const params = {
          wrId: this.wrId
        }
        const r = await getWorkorderDetails(params)
        const targetData = this.transformData(r['data']['position'])
        console.log(targetData)
        this.wrId = r['data']['wr']['wrId']
        this.enumerationVal['building'] = targetData
        if (r['data']['wr']['blId']) this.formData['position'].push(r['data']['wr']['blId'])
        if (r['data']['wr']['flId']) this.formData['position'].push(r['data']['wr']['flId'])
        if (r['data']['wr']['rmId']) this.formData['position'].push(r['data']['wr']['rmId'])
        // this.formData['position'] = r['data']['position']
        this.formData['repairType'] = r['data']['wr']['repairType']
        this.formData['eqId'] = r['data']['wr']['eqId']
        this.formData['cfId'] = r['data']['wr']['cfId']
        this.formData['requestor'] = r['data']['wr']['requestor']
        this.formData['probType'] = r['data']['wr']['probType']
        this.formData['priority'] = r['data']['wr']['priority']
        this.formData['rework'] = r['data']['wr']['rework']
        this.formData['document'] = r['data']['wr']['document']
        this.formData['description'] = r['data']['wr']['description']
        this.formData['wrStatus'] = r['data']['wr']['wrStatus']
        console.log(this.formData)
      } catch (e) {
        console.log(e)
      } finally {
        this.isLoading = false
      }
    },
    editInit() {
      this.wrId = this.$route.params['wrId']
      this.canEdit = false
      this.getDetails()
      this.getFileList()
    }
  }
}
</script>

