<template style="height:100%">
  <el-card>
    <el-form
      ref="supplierRule"
      :rules="supplierRule"
      :model="supplier"
      label-width="100px"
      label-position="right">
      <el-row :gutter="15">
        <el-col :span="8">
          <el-form-item label="源仓库:">
            <el-input
              v-model="supplier['sourceWareHouse']"
              readonly/>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="备件名称:" prop="partName">
            <el-select
              v-model="supplier['partName']"
              clearable
              filterable
              placeholder="请选择或输入关键字"
              @change="getQtyOnHand">
              <el-option
                v-for="item in supplier['partNameData']"
                :key="item.partId"
                :label="item.name"
                :value="item.partId + '|' + item.qtyOnHand"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="可用数量:" prop="qtyOnHand">
            {{ supplier['qtyOnHand'] + '个' }}
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="数量:" prop="number">
            <el-input
              v-model.number="supplier['number']"
              placeholder="请输入数量"
              clearable/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="15">
        <el-col :span="8">
          <el-form-item label="单价:" prop="price">
            <el-input
              v-model="supplier['price']"
              placeholder="请输入单价"
              clearable/>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="供应商:" prop="supplier">
            <el-select
              v-model="supplier['supplier']"
              clearable
              filterable
              placeholder="请选择或输入关键字">
              <el-option
                v-for="item in supplier['supplierData']"
                :key="item.vnId"
                :label="item.company"
                :value="item.vnId"
              />
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
  supplierBack,
  optionSupplier
} from '@/api/part'

export default {
  components: { },
  filters: {
  },
  props: {
    id: {
      type: String,
      default: ''
    }
  },
  data() {
    const numberChange = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('数量不能为空或0'))
      }
      setTimeout(() => {
        if (!Number.isInteger(value)) {
          console.log(value)
          callback(new Error('请输入数字值'))
        } else {
          if (value > this.supplier['qtyOnHand']) {
            callback(new Error('不能大于可用数量'))
          } else {
            callback()
          }
        }
      }, 100)
    }
    const priceChange = (rule, value, callback) => {
      const regular = /^\d{0,4}(\.\d{0,3})?$/g
      if (!value || Object.is(value, '0')) {
        return callback(new Error('单价不能为空或0'))
      }
      if (!regular.test(value)) {
        return callback(new Error('单价只能输入2位小数和一个点'))
      }
      callback()
    }
    return {
      supplier: {
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
        // 供应商下拉框
        supplierData: [],
        // 备件名称下拉框
        partNameData: [],
        //  源仓库
        sourceWareHouse: '爱玛客备件仓库'
      },
      // 表单验证
      supplierRule: {
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
      this.supplier['qtyOnHand'] = this.supplier['partName'].split('|')[1]
      // console.log(this.supplier['partName'])
    },
    // 主仓库备件
    async mainPart() {
      try {
        const r = await mainPart()
        this.supplier['partNameData'] = r['data']
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
        this.supplier['supplierData'] = r['data']
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
        const supplierFlag = await this.$refs['supplierRule'].validate()
        if (supplierFlag) {
          const data = {
            vnId: this.supplier['supplier'],
            parts: [
              {
                partId: this.supplier['partName'].split('|')[0],
                qty: this.supplier['number']
              }
            ]
          }
          await supplierBack(data)
          this.$message({
            message: '退供应商成功！',
            type: 'success'
          })
          this.$refs['supplierRule'].resetFields()
        }
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
