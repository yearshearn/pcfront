<template style="height:100%">
  <el-card>
    <el-form
      ref="form"
      :rules="purchaseRule"
      :model="purchase"
      label-width="100px"
      label-position="right">
      <el-row :gutter="15">
        <el-col :span="8">
          <el-form-item label="目标仓库:">
            <el-input
              v-model="purchase['targetWareHouse']"
              readonly/>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="备件名称:" prop="partName">
            <el-select
              v-model="purchase['partName']"
              clearable
              filterable
              placeholder="请选择或输入关键字"
              @change="getQtyOnHand">
              <el-option
                v-for="item in purchase['partNameData']"
                :key="item.partId"
                :label="item.name"
                :value="item.partId + '|' + item.qtyOnHand"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="可用数量:" prop="qtyOnHand">
            {{ purchase['qtyOnHand'] + '个' }}
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="数量:" prop="number">
            <el-input
              v-model.number="purchase['number']"
              placeholder="请输入数量"
              clearable/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="15">
        <el-col :span="8">
          <el-form-item label="单价:" prop="price">
            <el-input
              v-model="purchase['price']"
              placeholder="请输入单价"
              clearable/>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="供应商:" prop="supplier">
            <el-select
              v-model="purchase['supplier']"
              clearable
              filterable
              placeholder="请选择或输入关键字">
              <el-option
                v-for="item in purchase['supplierData']"
                :key="item.vnId"
                :label="item.company"
                :value="item.vnId"/>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col align="center">
          <el-button
            plain
            class="save"
            type="primary"
            @click="submit">提交</el-button>
        </el-col>
      </el-row>
    </el-form>
  </el-card>
</template>

<script>
import {
  mainPart,
  optionSupplier,
  purchasePart
} from '@/api/part'

export default {
  components: { },
  filters: {
  },
  props: {
    typeId: {
      type: String,
      default: ''
    }
  },
  data() {
    const numberChange = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('数量不能为空或0'))
      }
      if (!Number.isInteger(value)) {
        console.log(value)
        callback(new Error('请输入数字值'))
      }
      callback()
    }
    const priceChange = (rule, value, callback) => {
      const regular = /^\d{0,4}(\.\d{0,2})?$/g
      if (!value || Object.is(value, '0')) {
        return callback(new Error('数量不能为空或0'))
      }
      if (!regular.test(value)) {
        return callback(new Error('单价只能输入2位小数和一个点'))
      }
      callback()
    }
    return {
      purchase: {
        // 备件名称
        partName: '',
        // 可用数量
        qtyOnHand: 0,
        // 数量
        number: '',
        // 单价
        price: '',
        // 供应商
        supplier: '',
        // 目标仓库
        targetWareHouse: '爱玛客备件仓库',
        // 供应商下拉框
        supplierData: [],
        // 主仓库备件下拉框
        partNameData: []
      },
      // 表单验证
      purchaseRule: {
        partName: [
          { required: true, message: '请输入或选择备件名称', trigger: 'blur' }
        ],
        number: [
          { required: true, validator: numberChange, trigger: 'blur' }
        ],
        price: [
          { required: true, validator: priceChange, trigger: 'blur' }
        ],
        supplier: [
          { required: true, message: '请输入或选择供应商', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {

  },
  created() {

  },
  async mounted() {
    this.mainPart()
    this.getSupplier()
  },
  methods: {
    // 可用数量
    getQtyOnHand() {
      this.purchase['qtyOnHand'] = this.purchase['partName'].split('|')[1]
      // console.log(this.purchase['partName'])
    },
    // 主仓库备件
    async mainPart() {
      try {
        const r = await mainPart()
        this.purchase['partNameData'] = r['data']
        // console.log(r['data'])
      } catch (e) {
        console.log(e)
      } finally {
        () => {}
      }
    },
    // 供应商
    async getSupplier() {
      try {
        const r = await optionSupplier()
        this.purchase['supplierData'] = r['data']
        // console.log(r['data'])
      } catch (e) {
        console.log(e)
      } finally {
        () => {}
      }
    },
    // 提交
    async submit() {
      try {
        await this.$refs['form'].validate()
        const data = {
          vnId: this.purchase['supplier'],
          parts: [
            {
              partId: this.purchase['partName'].split('|')[0],
              qty: this.purchase['number'],
              costUnitStd: this.purchase['price']
            }
          ]
        }
        await purchasePart(data)
        this.$message({
          message: '采购成功！',
          type: 'success'
        })
        this.$refs['form'].resetFields()
      } catch (e) {
        console.log(e)
      } finally {
        this.mainPart()
      }
    }
  }
}
</script>

<style scoped>
  .el-card {
    height: 700px;
  }

  .el-input {
    width: 65%;
  }

  .el-select{
    width: 65%;
  }

  .save{
    margin-top: 25%;
  }
</style>
