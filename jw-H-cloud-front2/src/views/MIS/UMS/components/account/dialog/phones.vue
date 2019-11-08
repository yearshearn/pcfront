<template style="height:100%">
  <div>
    <el-button type="primary" @click="showPhonesDialog">请填写</el-button>
    <el-dialog
      :visible="phonesDialogFalg"
      :before-close="closePhonesDialog"
      title="请填写手机号"
      width="40%"
      center>
      <el-form
        ref="form"
        :model="phones"
        label-width="140px"
      >
        <el-row>
          <el-col :span="16">
            <el-form-item
              :rules="[
                { required: true, message: '请输入主要手机号'},
                { pattern: phoneReg , message: '请输入正确的手机号'}
              ]"
              label="主要联系方式："
              prop="main">
              <el-input v-model="phones['main']"/>
            </el-form-item>
          </el-col>
          <el-col :span="6" :offset="2">
            <el-button
              style="margin-bottom:10px"
              type="primary"
              @click="addPhone">添加备用手机号</el-button>
          </el-col>
        </el-row>
        <el-row
          v-for="(item, index) in phones['spare']"
          :key="index"
          style="margin-top:15px">
          <el-col :span="16">
            <el-form-item
              :label="`备用联系方式${index + 1}：`"
              :prop="'spare.' + index + '.phone'"
              :rules="{
                required: false,pattern: phoneReg , message: '请输入正确的手机号'
            }">
              <el-input v-model="item['phone']"/>
            </el-form-item>
          </el-col>
          <el-col :span="6" :offset="2">
            <el-button
              style="margin-bottom:10px"
              type="danger"
              size="mini"
              @click="deletePhone(index)">删除
            </el-button>
          </el-col>

        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closePhonesDialog">取 消</el-button>
        <el-button :disabled="isUpload" type="primary" @click="updateDeptHandler">确 定</el-button>
      </span>

    </el-dialog>
  </div>
</template>

<script>
import { phoneReg } from '@/utils/validate/reg'
export default {
  filters: {

  },
  props: {
    defaultValue: {
      type: Array,
      default: null
    },
    clearFormValidateByProp: {
      type: Function,
      default: null
    },
    updateHandler: {
      type: Function,
      default: null
    }
  },
  data() {
    const phones = this.initPhonesData()
    const oldData = JSON.stringify(phones)
    return {
      oldData,
      phones,
      phoneReg,
      isUpload: false,
      phonesDialogFalg: false
    }
  },
  computed: {
  },
  watch: {
    defaultValue: {
      deep: true,
      handler(v, o) {
        this.phones = this.initPhonesData()
      }
    },
    phonesDialogFalg(v) {
      if (v) {
        this.clearFormValidateByProp('phonesFlag')
      }
    }

  },
  created() {
  },
  async mounted() {
  },
  methods: {
    filteSparePhones() {
      this.phones['spare'] = this.phones['spare'].filter(i => {
        return i['phone'] !== ''
      })
    },
    initPhonesData() {
    //   console.log(this.defaultValue)
      if (!this.defaultValue) {
        return {
          main: '',
          spare: []
        }
      }
      const sourceData = JSON.parse(JSON.stringify(this.defaultValue))
      const data = {
        main: '',
        spare: []
      }
      for (const item of sourceData) {
        if (item['isMain'] === 1) {
          data['main'] = item['phone']
        } else {
          data['spare'].push({
            phone: item['phone']
          })
        }
      }
      this.oldData = JSON.stringify(data)
      return data
    },
    transformDataToServer() {
      const sourceData = JSON.parse(JSON.stringify(this.phones))
      const mainPhoneNumber = sourceData['main']
      const data = [
        { phone: sourceData['main'], isMain: 1 }
      ]
      if (sourceData['spare'].length !== 0) {
        const tmpArr = []
        for (const item of sourceData['spare']) {
          const flag = tmpArr.some(i => {
            return i['phone'] === item['phone']
          })
          // console.log(tmpArr)
          if (item['phone'] !== mainPhoneNumber && !flag) {
            tmpArr.push(item['phone'])
            data.push({
              phone: item['phone'],
              isMain: 0
            })
          }
        }
      }
      return data
    },
    deletePhone(i) {
      this.phones['spare'].splice(i, 1)
    },
    addPhone() {
      if (this.phones['spare'].length >= 2) {
        this.$message({
          message: '最多添加两个备用手机号！',
          type: 'error'
        })
        return
      }
      this.phones['spare'].push({ phone: '' })
    },
    async closePhonesDialog() {
      this.phonesDialogFalg = false
      this.isUpload = false
      this.phones = JSON.parse(this.oldData)
    },
    async showPhonesDialog() {
      this.phonesDialogFalg = true
    },
    async updateDeptHandler() {
      try {
        await this.$refs['form'].validate()
        this.filteSparePhones()
        this.oldData = JSON.stringify(this.phones)
        const data = this.transformDataToServer()
        this.updateHandler(data)
        this.closePhonesDialog()
      } catch (e) {
        console.log(e)
      }
    }
  }
}
</script>

