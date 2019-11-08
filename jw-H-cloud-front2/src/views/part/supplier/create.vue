<template style="height:100%">
  <el-container style="padding:20px">
    <el-header :gutter="20">
      <el-row>
        <el-col >
          <el-button @click="supplierBack">返回</el-button>
        </el-col>
      </el-row>
    </el-header>
    <el-main >
      <el-card>
        <el-form
          ref="ruleForm"
          :rules="rules"
          :model="ruleForm"
          label-position="right"
          label-width="120px"
        >
          <el-row :gutter="15" >
            <el-col :span="6">
              <el-form-item label="供应商名称:" prop="company" >
                <el-input v-model="ruleForm.company" placeholder="请输入供应商名称" />
              </el-form-item>
            </el-col>
            <el-col :span="6" :offset="3">
              <el-form-item label="地址:" prop="address">
                <el-input
                  v-model="ruleForm.address"
                  maxlength="250"
                  show-word-limit
                  placeholder="请输入地址"/>
              </el-form-item>
            </el-col>
            <el-col :span="6" :offset="3">
              <el-form-item label="供应商类型:" prop="vendorType" >
                <el-select
                  v-model="ruleForm.vendorType"
                  style="width:100%"
                  placeholder="请选择"
                  clearable
                >
                  <el-option
                    v-for="item in conTypesArrL"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"/>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="15" >
            <el-col :span="6">
              <el-form-item label="联系人姓名:" prop="contact" >
                <el-input v-model="ruleForm.contact" placeholder="请输入姓名"/>
              </el-form-item>
            </el-col>
            <el-col :span="6" :offset="3">
              <el-form-item label="电话:" prop="phone">
                <el-input v-model="ruleForm.phone" placeholder="请输入电话"/>
              </el-form-item>
            </el-col>
            <el-col :span="6" :offset="3">
              <el-form-item label="备件:" prop="parts" >
                <Part
                  :part-data="ruleForm['parts']"
                  :clear-form-validate-by-prop="clearFormValidateByProp"
                  :update-part="updatePart"/>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="15" >
            <el-col :span="10" >
              <el-form-item label="供应商描述:" prop="description" >
                <el-input
                  v-model="ruleForm.description"
                  :autosize="{
                    minRows:3
                  }"
                  placeholder="请输入供应商描述"
                  maxlength="250"
                  show-word-limit
                  resize="none"
                  type="textarea"
                  style="max-width:650px"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col align="center">
              <el-form-item>
                <el-button type="primary" class="save" @click="submit">保存</el-button>
                <el-button @click="resetForm('ruleForm')">重置</el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-card>
    </el-main>
  </el-container>
</template>

<script>
import { phoneReg, lengthReg } from '@/utils/validate/reg'
import Part from './dialog/part'
import {
  modifyPartSupplier, // 修改备件供应商
  createPartSupplier, // 新增备件供应商
  findSupplier, // 备件供应商详情
  checkSupplierName, // 检查备件供应商名称
  optionPartSupplierType // 备件供应商选项
} from '@/api/part'
export default {
  name: 'PartSupplierCreate',
  components: { Part },
  filters: {},
  props: {},

  data() {
    // 检查供应商名称
    const checkNameData = async(rule, value, callback) => {
      if (this.ruleForm.vnId) {
        try {
          const params = {
            name: this.ruleForm.company,
            vnId: this.ruleForm.vnId
          }
          const r = await checkSupplierName(params)
          if (r.data.is_success === false) {
            // console.log(r.data.is_success)
            callback(new Error('供应商已经存在'))
          }
        } catch (e) {
          callback(new Error('网络故障，请稍后重试'))
        }
      } else {
        try {
          const params = {
            name: this.ruleForm.company
          }
          const r = await checkSupplierName(params)
          if (r.data.is_success === false) {
            // console.log(r.data.is_success)
            callback(new Error('供应商已经存在'))
          }
        } catch (e) {
          callback(new Error('网络故障，请稍后重试'))
        }
      }
    }

    return {
      conTypesArrL: [],
      ruleForm: {
        company: '', // 供应商名称
        address: '', // 地址
        vendorType: '', // 供应商类型
        contact: '', // 联系人姓名
        phone: '', // 电话
        description: '',
        parts: [],
        state: ''

      },

      hash: {},
      rules: {
        company: [
          { required: true, message: '请输入供应商名称' },
          { pattern: lengthReg, message: '请输入不超过25个的汉字' },
          { validator: checkNameData, trigger: 'blur' }
        ],
        address: [
          { required: true, message: '请输入地址', trigger: 'blur' }
        ],
        vendorType: [
          { required: true, message: '请输入供应商类型', trigger: 'blur' },
          { pattern: /^[a-zA-Z0-9]{0,32}$/, message: '请输入英文或者数字不超过32个' }
        ],
        contact: [
          { trigger: 'blur' },
          { pattern: /^[\u4e00-\u9fa5]{0,4}$/, message: '请输入不超过4个的汉字' }
        ],
        phone: [
          { required: true, message: '请输入手机号' },
          { pattern: phoneReg, message: '请输入正确的手机号', trigger: 'blur' }

        ]

      }
    }
  },
  computed: {},
  created() {},
  async mounted() {
    this.getData()
    this.getType()
  },
  methods: {
    clearFormValidateByProp(prop) {
      this.$refs['ruleForm'].clearValidate(prop)
    },
    updatePart(v) {
      this.ruleForm['parts'] = v
    },
    async getData() {
      if (this.$route.params.id === undefined) {
        return
      } else {
        try {
          const params = {
            vnId: this.$route.params.id
          }
          const result = await findSupplier(params)
          this.ruleForm.vnId = result.data.vnId
          this.ruleForm.company = result.data.company
          this.ruleForm.address = result.data.address
          this.ruleForm.contact = result.data.contact
          this.ruleForm.phone = result.data.phone
          this.ruleForm.vendorType = result.data.vendorType
          this.ruleForm.state = result.data.state
          this.ruleForm.description = result.data.description
          // var partIds = result.data.parts
          this.ruleForm.parts = result.data.parts.map(i => {
            return {
              'state': 1,
              'partId': i.partId,
              'vnPtNum': i.vnPtNum,
              'leadTime': i.leadTime ? Number(i.leadTime) : 0
            }
          })
          // console.log(partIds)
          // this.ruleForm.parts = []
          // if (partIds && partIds.length > 0) {
          //   partIds.forEach((item, index) => {
          //     if (item.state === 0) {
          //       this.ruleForm.parts.push(item)
          //     }
          //   })
          // }
          console.log(this.ruleForm)
        } catch (err) {
          console.log(err)
        } finally {
          // console.log(1)
        }
      }
    },
    async getType() {
      try {
        const result = await optionPartSupplierType()
        // console.log(result)
        this.conTypesArrL = result.data
        result.data.forEach((item) => {
          this.hash[item.vnId] = item.name
        })
      } catch (err) {
        console.log(err)
      } finally {
        // console.log(1)
      }
    },
    async submit() {
      var parts
      // this.ruleForm.vendorType = this.hash[this.ruleForm.partId]
      if (this.$route.params.id) {
        /** 修改 */
        //   this.getData()
        try {
          const checkData = await this.$refs['ruleForm'].validate()
          parts = []
          if (this.ruleForm['parts']) {
            this.ruleForm['parts'].forEach((item, index) => {
              parts.push({
                'state': 1,
                'partId': item.partId,
                'vnPtNum': item.vnPtNum,
                'leadTime': item.leadTime })
            })
          }
          if (checkData) {
            const body = {
              company: this.ruleForm.company,
              state: this.ruleForm.state,
              vendorType: this.ruleForm.vendorType,
              vnId: this.ruleForm.vnId,
              address: this.ruleForm.address,
              contact: this.ruleForm.contact,
              phone: this.ruleForm.phone,
              description: this.ruleForm.description,
              parts: parts
            }
            await modifyPartSupplier(body)
            this.$message({
              message: '修改成功',
              type: 'success'
            })
            // this.ruleForm.name = ''
          }
        } catch (e) {
          console.log(e)
        } finally {
          this.isLoading = false
        }
      } else {
        /** 创建 */
        try {
          const checkData = await this.$refs['ruleForm'].validate()
          parts = []
          if (this.ruleForm['parts']) {
            this.ruleForm['parts'].forEach((item, index) => {
              parts.push({
                'state': 1,
                'partId': item.partId,
                'vnPtNum': item.vnPtNum,
                'leadTime': item.leadTime })
            })
          }
          if (checkData) {
            const body = {
              company: this.ruleForm.company,
              state: 0,
              vendorType: this.ruleForm.vendorType,
              vnId: this.ruleForm.vnId,
              address: this.ruleForm.address,
              contact: this.ruleForm.contact,
              phone: this.ruleForm.phone,
              description: this.ruleForm.description,
              parts: parts
            }
            await createPartSupplier(body)
            this.$message({
              message: '创建成功',
              type: 'success'
            })
            // this.ruleForm.name = ''
          }
        } catch (e) {
          console.log(e)
        } finally {
          this.isLoading = false
        }
      }
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    supplierBack() {
      this.$router.go(-1)
    }
  }
}
</script>

<style>

</style>
