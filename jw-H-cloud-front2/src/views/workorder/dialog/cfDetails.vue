<template style="height:100%">
  <el-dialog
    :visible="dialogVisibleFlag"
    :before-close="closeDialog"
    :fullscreen="false"
    :title="cfName"
    width="60%"
    @open="goTop">
    <div
      class="dialogHeight">
      <el-backtop v-show="false" ref="goTop" :bottom="1" :right="1" target=".dialogHeight"/>

      <el-card
        v-loading="loading"
        shadow="never"
        style="margin-top:5px">
        <div slot="header" class="clearfix">
          <b style="color:#002040">工作请求历史</b>
        </div>
        <el-table
          :data="wrData"
          max-height="500"
          style="width: 100%">
          <el-table-column
            prop="cfId"
            align="center"
            show-overflow-tooltip
            label="技工"
            width="180"/>
          <el-table-column
            prop="dateAssigned"
            align="center"
            label="排程日期"
            width="240"/>
          <el-table-column
            prop="name"
            label="已分配工时"
            align="center"
            width="90"/>
          <el-table-column
            prop="hoursStraight"
            label="实际小时"
            align="center"
            width="90"/>
          <el-table-column
            prop="hoursTotal"
            label="总小时数"
            align="center"
            width="90"/>
          <el-table-column
            prop="name"
            align="center"
            width="90"
            label="双倍工时"/>
          <el-table-column
            prop="name"
            label="加班小时"
            align="center"
            width="90"/>
          <el-table-column
            prop="dateStart"
            align="center"
            label="开始日期"
            width="240"/>
          <el-table-column
            prop="dateEnd"
            align="center"
            label="完成日期"
            width="240"/>
          <el-table-column
            width="130"
            prop="status"
            align="center"
            label="技工状态"/>
          <!--<el-table-column
            prop="wrStatus"
            align="center"
            width="150"
            label="工单状态"/>-->
          <el-table-column
            prop="comments"
            show-overflow-tooltip
            align="center"
            label="备注"/>
        </el-table>
      </el-card>
      <el-card
        v-loading="loading"
        shadow="never">
        <div slot="header" class="clearfix">
          <b style="color:#002040">备件</b>
        </div>
        <el-table
          :data="partData"
          max-height="500"
          style="width: 100%">
          <el-table-column
            prop="partName"
            align="center"
            label="备件名称"
            show-overflow-tooltip
            min-width="50"/>
          <el-table-column
            prop="qtyActual"
            align="center"
            min-width="50"
            label="使用数量"/>
        </el-table>
      </el-card>
      <el-card
        v-loading="loading"
        shadow="never"
        style="margin-top:5px">
        <div slot="header" class="clearfix">
          <b style="color:#002040">文件上传情况</b>
        </div>
        <el-upload
          ref="upload"
          :on-preview="handlePreview"
          :file-list="fileList"
          :on-error="handleError"
          :on-remove="onRemoveHandler"
          :before-remove="removeHandler"
          :auto-upload="false"
          :on-change="changeHandler"
          :on-success="handleSuccess"
          :action="uploadUrl"
          :limit="5"
          :on-exceed="exceedHandler"
          class="upload-demo">
          <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
          <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传到服务器</el-button>
          <el-button size="small" type="primary" @click="downloadAll">下载全部</el-button>
          <!--<el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传到服务器</el-button>
          <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div> -->
        </el-upload>
      </el-card>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click = "closeDialog">关闭</el-button>
    </span>
  </el-dialog>

</template>

<script>
import { getToken } from '@/utils/auth'
import { getCfLogByWrId } from '@/api/workorder/list'
import { customUploadSuccessHandler } from '@/utils'
import { mapGetters } from 'vuex'
import {
  removeFile
} from '@/api/utils'
export default {
  filters: {

  },
  props: {
    cfName: {
      type: String,
      default: ''
    },
    wrId: {
      type: String,
      default: ''
    },
    cfId: {
      type: String,
      default: ''
    },
    dialogVisibleFlag: {
      type: Boolean,
      default: false
    },
    closeCfDialog: {
      type: Function,
      default: null
    }
  },
  data() {
    // const tableData = []
    // for (let i = 0; i < 5; i++) {
    //   tableData.push({
    //     date: '2016-05-02',
    //     name: '王小虎',
    //     address: '上海市普陀区金沙江路 1518 弄'
    //   })
    // }
    return {
      isChanged: false,
      fileListLength: 0,
      uploadFileList: [],
      wrData: [],
      partData: [],
      loading: true,
      fileList: [
      ]
      // tableData
    }
  },
  computed: {
    ...mapGetters([
      'name'
    ]),
    baseUrl() {
      return process.env.BASE_API
    },
    uploadUrl() {
      // return this.baseUrl + '/contract/uploadFile?authorization=' + getToken()
      // return `http://192.168.0.100:9083/jwkjPublicService/uploadFile?projectName=wr&projectId=${this.wrId}&author=${this.name}&authorization=${getToken()}`
      return `${this.baseUrl}/wr/uploadFile?projectName=wr&projectId=${this.wrId}&author=${this.name}&authorization=${getToken()}`
    }
  },
  watch: {
    dialogVisibleFlag(v) {
      if (v && this.wrId !== '') {
        console.log(this.cfName)
        this.dataInit()
      }
    }
  },
  created() {
  },
  async mounted() {
    this.dataInit()
  },
  methods: {
    exceedHandler() {
      this.$message({
        message: '最多上传五个文件！',
        type: 'error'
      })
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
    downloadAll() {
      if (this.fileListLength !== 0) {
        const body = this.uploadFileList[0]['response'] ? this.uploadFileList[0]['response']['data'] : this.fileList[0]
        window.open(`${this.baseUrl}/wr/downFile?projectName=${body['projectName']}&projectId=${body['projectId']}&authorization=${getToken()}`)
      }
    },
    onRemoveHandler(file, fileList) {
      this.isChanged = true
      this.fileListLength = fileList.filter(i => {
        return i['status'] === 'success'
      }).length
      this.uploadFileList = fileList
    },
    changeHandler(file, fileList) {
      this.isChanged = true
      const fileName = file['name']
      this.fileListLength = fileList.filter(i => {
        return i['status'] === 'success'
      }).length
      this.uploadFileList = fileList
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
    async dataInit() {
      try {
        this.loading = true
        if (!this.wrId) {
          return
        }
        const params = {
          wrId: this.wrId
        }
        const r = await getCfLogByWrId(params)
        this.fileList = r['data']['fileList'].map(i => {
          i['name'] = i['fileName']
          return i
        })
        this.uploadFileList = this.fileList
        this.fileListLength = this.fileList.length
        this.wrData = r['data']['wrcf']
        this.partData = r['data']['wrpt']
        console.log(r)
      } catch (e) {
        console.log(e)
      } finally {
        this.loading = false
      }
    },
    goTop() {
      // 如果需要打开后返回顶部再解开 一个就好
      // this.$refs['goTop'] && this.$refs['goTop'].scrollToTop() // this.$refs['goTop'].handleClick()
    },
    async handleSuccess(res, file, fileList) {
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
    },
    handleError(...arr) {
      console.log(arr)
    },
    submitUpload() {
      this.$refs.upload.submit()
    },
    handlePreview(file) {
      if (file['projectName'] && file['projectId']) {
        window.open(`${this.baseUrl}/wr/downFile?projectName=${file['projectName']}&projectId=${file['projectId']}&fileName=${file['name']}&authorization=${getToken()}`)
      }
      if (file['response']) {
        const data = file['response']['data']
        window.open(`${this.baseUrl}/wr/downFile?projectName=${data['projectName']}&projectId=${data['projectId']}&fileName=${data['fileName']}&authorization=${getToken()}`)
      }
    },
    closeDialog() {
      // this.goTop()
      this.$refs['upload'].clearFiles()
      this.closeCfDialog(this.isChanged)
      this.isChanged = false
    }
  }
}
</script>
<style>
  .dialogHeight{
    max-height:600px;
    overflow:auto
  }
</style>

