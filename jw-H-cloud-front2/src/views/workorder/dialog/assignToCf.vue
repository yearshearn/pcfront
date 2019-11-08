<template>
  <el-dialog
    :visible="showFlag"
    :before-close="closeHandle"
    width="25%"
    title="指派技工">
    <div style="min-height:auto">
      <el-form
        ref="form"
        :rules="formRule"
        :model="form"
        label-width="80px">
        <el-form-item label="技工：" prop="cfId">
          <el-select v-model="form.cfId" placeholder="请选择">
            <el-option
              v-for="item in cfOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"/>
          </el-select>
        </el-form-item>
      </el-form>

    </div>
    <div slot="footer" class="dialog-footer">
      <el-button @click="closeHandle">取 消</el-button>
      <el-button type="primary" @click="assign">指派</el-button>
    </div>
  </el-dialog>
</template>
<script>
import {
  getCfList,
  assignToCf } from '@/api/workorder/list'
export default {
  props: {
    cfId: {
      type: String,
      default: ''
    },
    // 关闭
    closeDialog: {
      type: Function,
      default: null
    },
    wrStatus: {
      type: String,
      default: ''
    },
    // 是否显示
    showFlag: {
      type: Boolean,
      default: false
    },
    wrId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      form: {
        cfId: ''
      },
      formRule: {
        cfId: [
          { required: true, message: '请选择技工' }
        ]
      },
      cfOptions: [

      ]
    }
  },
  computed: {

  },
  watch: {
    showFlag(v) {
      if (v) {
        this.init()
      }
    }
  },
  created() {
  },
  async mounted() {
    this.init()
  },
  methods: {
    async assign() {
      try {
        await this.$refs['form'].validate()
        // const data = JSON.parse(this.form['cfId'])
        // await this.$confirm(`是否将工单（${this.wrId}）分配给 ${data['label']}`, '提示', {
        //   confirmButtonText: '确定',
        //   cancelButtonText: '取消',
        //   type: 'warning'
        // })
        const body = {
          cfId: this.form['cfId'],
          wrId: this.wrId
        }
        await assignToCf(body)
        this.$message({
          message: '指派成功！',
          type: 'success'
        })
        this.$refs['form'].resetFields()
        this.closeDialog(true)
      } catch (e) {
        console.log(e)
      }
    },
    async init() {
      this.form['cfId'] = this.cfId
      this.getCfList()
    },
    async getCfList() {
      try {
        const r = await getCfList()
        this.cfOptions = r['data'].map(i => {
          return {
            label: i['userName'],
            value: i['userId'],
            custom: JSON.stringify({
              label: i['userName'],
              value: i['userId']
            })
          }
        })
        // console.log(r)
      } catch (e) {
        console.log(e)
      }
    },
    // 关闭弹框
    closeHandle() {
      if (this.$refs['form']) {
        this.$refs['form'].resetFields()
      }
      this.closeDialog(false)
    }
  }
}
</script>

<style scoped>

</style>
