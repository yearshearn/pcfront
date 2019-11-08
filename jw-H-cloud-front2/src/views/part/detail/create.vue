<template style="height:100%">
  <el-container style="padding:20px">
    <el-header>
      <el-row :gutter="20">
        <el-col>
          <el-button @click="$router.go(-1)">返回</el-button>
        </el-col>
      </el-row>
    </el-header>
    <el-main>
      <el-card>
        <el-form
          ref="ruleForm"
          :rules="rules"
          :model="ruleForm"
          label-position="right"
          label-width="120px"
        >
          <el-row :gutter="15">
            <el-col :span="6">
              <el-form-item label="备件编号:" prop="code">
                <el-input v-model="ruleForm.code" placeholder="请输入备件编号"/>
              </el-form-item>
            </el-col>
            <el-col :offset="3" :span="6">
              <el-form-item label="备件名称:" prop="name">
                <el-input v-model="ruleForm.name" placeholder="请输入备件名称"/>
              </el-form-item>
            </el-col>
            <el-col :offset="3" :span="6">
              <el-form-item label="单价:" prop="costUnitStd">
                <el-input v-model="ruleForm.costUnitStd" placeholder="请输入单价" @blur="onBlur"/>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="15">
            <el-col :span="6">
              <el-form-item label="备件类别:" prop="category" >
                <el-select
                  v-model="ruleForm.category"
                  style="width:100%"
                  placeholder="请选择"
                  clearable
                >
                  <el-option
                    v-for="item in conTypesArrL"
                    :key="item.ptCatId"
                    :label="item.name"
                    :value="item.ptCatId"/>
                </el-select>
              </el-form-item>
            </el-col>

            <el-col :offset="3" :span="6">
              <el-form-item label="单位:" prop="unitsOrder">
                <el-input v-model="ruleForm.unitsOrder" placeholder="请输入单位"/>
              </el-form-item>
            </el-col>
            <el-col :span="6" :offset="3">
              <el-form-item label="规格型号:" prop="modelNo">
                <el-input v-model="ruleForm.modelNo" placeholder="请输入规格型号"/>
              </el-form-item>
            </el-col>

          </el-row>

          <el-row :gutter="15">
            <el-col :span="6">
              <el-form-item label="最低保有量:" prop="qtyMinHand">
                <el-input v-model="ruleForm.qtyMinHand" placeholder="请输入最低保有量"/>
              </el-form-item>
            </el-col>
            <el-col :span="6" :offset="3">
              <el-form-item label="可用数量:" prop="qtyOnHand">
                <el-input v-model="ruleForm.qtyOnHand" placeholder="请输入可用"/>
              </el-form-item>
            </el-col>
            <el-col :span="6" :offset="3">
              <el-form-item label="备件供应商:" prop="vendors" >
                <Supp
                  :supp-data="ruleForm['vendors']"
                  :clear-form-validate-by-prop="clearFormValidateByProp"
                  :update-supp="updateSupp"/>

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
import { lengthReg, lenReg, unitLengthReg } from '@/utils/validate/reg'
import {
  createPart, // 新增备件
  modifyPart, // 修改备件
  optionPartType, // 选择备件类型接口
  checkPartName, // 检查备件名称接口
  checkPartCode, // 检查备件编码接口
  findPart // 备件信息详情接口
} from '@/api/part'
import Supp from './dialog/supp'
export default {
  name: 'PartTypeCreate',
  components: { Supp },
  filters: {},
  props: {},
  data() {
    // 限制价格的值
    const priceChange = (rule, value, callback) => {
      const regular = /^\d+\.{1}\d{2}$/
      if (!value && value < 9999999999) {
        callback(new Error('单价不能为空或0'))
      }

      if (!regular.test(value)) {
        callback(new Error('单价只能输入2位小数和一个点'))
      }
      callback()
    }
    // 检查备件名称
    const checkNameData = async(rule, value, callback) => {
      if (this.ruleForm.partId) {
        try {
          const data = {
            name: this.ruleForm.name,
            partId: this.ruleForm.partId
          }
          const r = await checkPartName(data)
          console.log(r)

          if (r.data.is_success === false) {
            callback(new Error('备件名称已经存在'))
          }
        } catch (e) {
          callback(new Error('网络故障，请稍后重试'))
        }
      } else {
        try {
          const data = {
            name: this.ruleForm.name
          }
          const r = await checkPartName(data)

          if (r.data.is_success === false) {
            callback(new Error('备件名称已经存在'))
          }
        } catch (e) {
          callback(new Error('网络故障，请稍后重试'))
        }
      }
      // 修改
    }
    // 检查备件编码
    const checkCodeData = async(rule, value, callback) => {
      if (this.ruleForm.partId) {
        try {
          const data = {
            code: this.ruleForm.code,
            partId: this.ruleForm.partId
          }
          const r = await checkPartCode(data)

          if (r.data.is_success === false) {
            callback(new Error('备件编码已经存在'))
          }
        } catch (e) {
          callback(new Error('网络故障，请稍后重试'))
        }
      } else {
        try {
          const data = {
            code: this.ruleForm.code
          }
          const r = await checkPartCode(data)

          if (r.data.is_success === false) {
            callback(new Error('备件编码已经存在'))
          }
        } catch (e) {
          callback(new Error('网络故障，请稍后重试'))
        }
      }
    }
    return {
      suppliersTypesArrL: [],
      conTypesArrL: [],
      ruleForm: {
        category: '',
        code: '',
        type: '',
        name: '',
        unitsOrder: '',
        vendors: [],
        modelNo: '',
        costUnitStd: '',
        qtyMinHand: '',
        qtyOnHand: ''
      },
      hash: {},
      rules: {
        category: [
          { required: true, message: '请选择备件类别' }
        ],
        name: [
          { required: true, message: '请输入备件名称' },
          { pattern: lengthReg, message: '长度不能超过25个汉字或格式不正确' },
          { validator: checkNameData, trigger: 'blur' }
        ],
        code: [
          { required: true, message: '请输入备件编号' },
          { pattern: lenReg, message: '长度不能超过50个英文或者数字' },
          { validator: checkCodeData, trigger: 'blur' }
        ],
        costUnitStd: [
          { required: true, message: '单价必须保留两位小数' },
          { validator: priceChange, trigger: 'blur' }
        ],
        unitsOrder: [
          { required: true, message: '请输入备件单位' },
          { pattern: unitLengthReg, message: '长度不能超过10个汉字或者英文' }
        ],
        // modelNo: [
        //   { pattern: /^[a-zA-Z0-9]{0,100}$/, message: '长度不能超过100个字母或者数字' }
        // ],
        qtyMinHand: [
          { pattern: /^\d+$/, message: '只能输入数字' }
        ],
        qtyOnHand: [
          { pattern: /^\d+$/, message: '只能输入数字' }
        ]
      }
    }
  },
  computed: {},
  created() {
    this.getType()
    this.getData()
  },
  async mounted() {},
  methods: {
    onBlur(el) {
      this.ruleForm.costUnitStd = Number(this.ruleForm.costUnitStd).toFixed(2)
    },
    clearFormValidateByProp(prop) {
      this.$refs['ruleForm'].clearValidate(prop)
    },
    updateSupp(v) {
      this.ruleForm['vendors'] = v
    },
    async getData() {
      if (this.$route.params.id === undefined) {
        return
      }
      try {
        const params = {
          partId: this.$route.params.id
        }
        const result = await findPart(params)

        if (this.$route.params.id) {
          this.ruleForm.partId = result.data.partId
          this.ruleForm.name = result.data.name
          this.ruleForm.code = result.data.code.trim()
          this.ruleForm.costUnitStd = Number(result.data.costUnitStd).toFixed(2)
          this.ruleForm.modelNo = result.data.modelNo
          this.ruleForm.type = result.data.type
          this.ruleForm.vendors = result.data.vendors
          this.ruleForm.unitsOrder = result.data.unitsOrder.trim()
          this.ruleForm.category = result.data.category
          this.ruleForm.qtyMinHand = result.data.qtyMinHand
          this.ruleForm.qtyOnHand = result.data.qtyOnHand
        }
      } catch (err) {
        console.log(err)
      } finally {
        // console.log(1)
      }
    },
    // 备件类型列表
    async getType() {
      try {
        const result = await optionPartType()
        console.log(result)
        this.conTypesArrL = result.data
        result.data.forEach((item) => {
          this.hash[item.ptCatId] = item.name
        })
      } catch (err) {
        console.log(err)
      } finally {
        console.log(1)
      }
    },
    async submit() {
      var vendors
      // 为了拿到下拉框里面的Id对应的name值,传给后台
      this.ruleForm.type = this.hash[this.ruleForm.category]
      // debugger
      if (this.$route.params.id) {
        console.log(this.$route.params.id + '修改页面')
        /** 修改 */
        //   this.getData()
        try {
          const checkData = await this.$refs['ruleForm'].validate()
          vendors = []
          if (this.ruleForm['vendors']) {
            this.ruleForm['vendors'].forEach((item, index) => {
              vendors.push({
                'vnId': item.vnId,
                'state': item.state,
                'vnPtNum': item.vnPtNum,
                'leadTime': item.leadTime })
            })
          }
          if (checkData) {
            const body = {
              name: this.ruleForm.name,
              modelNo: this.ruleForm.modelNo,
              code: this.ruleForm.code,
              unitsOrder: this.ruleForm.unitsOrder,
              costUnitStd: this.ruleForm.costUnitStd,
              type: this.ruleForm.type,
              category: this.ruleForm.category,
              vendors: vendors,
              partId: this.ruleForm.partId,
              qtyOnHand: this.ruleForm.qtyOnHand,
              qtyMinHand: this.ruleForm.qtyMinHand
            }
            console.log(body)
            await modifyPart(body)
            this.$message({
              message: '修改成功',
              type: 'success'
            })
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
          if (checkData) {
            vendors = []
            if (this.ruleForm['vendors']) {
              this.ruleForm['vendors'].forEach((item, index) => {
                vendors.push({
                  'vnId': item.vnId,
                  'state': item.state,
                  'vnPtNum': this.ruleForm.code,
                  'leadTime': item.leadTime })
              })
            }
            const body = {
              name: this.ruleForm.name,
              code: this.ruleForm.code,
              unitsOrder: this.ruleForm.unitsOrder,
              costUnitStd: this.ruleForm.costUnitStd,
              vendors: vendors,
              type: this.ruleForm.type,
              category: this.ruleForm.category,
              qtyOnHand: this.ruleForm.qtyOnHand,
              qtyMinHand: this.ruleForm.qtyMinHand
            }
            await createPart(body)
            this.$message({
              message: '创建成功',
              type: 'success'
            })
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
    }
  }
}
</script>
<style>
</style>
