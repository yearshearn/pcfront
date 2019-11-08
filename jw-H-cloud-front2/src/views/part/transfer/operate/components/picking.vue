<template>
  <el-card>
    <el-form
      ref="pickingRule"
      :rules="pickingRule"
      :model="picking"
      label-width="100px"
      label-position="right">
      <el-row :gutter="15">
        <el-col :span="8">
          <el-form-item label="源仓库:" prop="sourceWarehouse">
            <el-input
              v-model="picking['sourceWarehouse']"
              readonly/>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="备件名称:" prop="partName">
            <el-select
              v-model="picking['partName']"
              clearable
              filterable
              placeholder="请选择或输入关键字"
              @change="getQtyOnHand">
              <el-option
                v-for="item in picking['partNameData']"
                :key="item.partId"
                :label="item.name"
                :value="item.partId + '|' + item.qtyOnHand"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="可用数量:" prop="qtyOnHand">
            {{ picking['qtyOnHand'] + '个' }}
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="目标仓库:" prop="targetWareHouse">
            <el-select
              v-model="picking['targetWareHouse']"
              clearable
              filterable
              placeholder="请选择或输入关键字">
              <el-option
                v-for="item in picking['targetData']"
                :key="item.ptStoreLocId"
                :label="item.ptStoreLocName"
                :value="item.ptStoreLocId"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="15">
        <el-col :span="8">
          <el-form-item label="数量:" prop="number">
            <el-input
              v-model.number="picking['number']"
              placeholder="请输入数量"
              clearable/>
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
  receivePart,
  mainPart,
  mechanicOptions
} from '@/api/part/index'

export default {
  components: {},
  filters: {},
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
      setTimeout(() => {
        if (!Number.isInteger(value)) {
          callback(new Error('请输入数字值'))
        } else {
          if (value > this.picking['qtyOnHand']) {
            callback(new Error('不能大于可用数量'))
          } else {
            callback()
          }
        }
      }, 100)
    }
    return {
      picking: {
        // 备件名称
        partName: '',
        // 可用数量
        qtyOnHand: 0,
        // 数量
        number: '',
        // 源仓库
        sourceWarehouse: '爱玛客备件仓库',
        // 目标仓库
        targetWareHouse: '',
        // 目标仓库下拉框
        targetData: [],
        // 备件名称下拉框
        partNameData: []
      },
      // 领料判断
      pickingRule: {
        partName: [
          { required: true, message: '请输入或选择备件名称', trigger: 'blur' }
        ],
        number: [
          { required: true, validator: numberChange, trigger: 'blur' }
        ],
        targetWareHouse: [
          { required: true, message: '请输入或选择目标仓库', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
  },
  created() {},
  async mounted() {
    this.mainPart()
    this.mechanicOptions()
  },
  methods: {
    // 可用数量
    getQtyOnHand() {
      this.picking['qtyOnHand'] = this.picking['partName'].split('|')[1]
      // console.log(this.picking['partName'])
    },
    // 主仓库备件
    async mainPart() {
      try {
        const r = await mainPart()
        this.picking['partNameData'] = r['data']
        // console.log(r['data'])
      } catch (e) {
        console.log(e)
      } finally {
        () => {}
      }
    },
    // 个人仓库
    async mechanicOptions() {
      try {
        const r = await mechanicOptions()
        this.picking['targetData'] = r['data']
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
        const pickingFlag = await this.$refs['pickingRule'].validate()
        if (pickingFlag) {
          const data = {
            partId: this.picking['partName'].split('|')[0],
            transQuantity: this.picking['number'],
            ptStoreLocTo: this.picking['targetWareHouse']
          }
          await receivePart(data)
          this.$message({
            message: '领料成功！',
            type: 'success'
          })
          this.$refs['pickingRule'].resetFields()
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
