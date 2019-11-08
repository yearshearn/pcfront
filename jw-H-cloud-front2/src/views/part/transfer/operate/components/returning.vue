<template>
  <el-card>
    <el-form
      ref="returnRule"
      :rules="returnRule"
      :model="returning"
      label-width="100px"
      label-position="right">
      <el-row :gutter="15">
        <el-col :span="8">
          <el-form-item label="源仓库:" prop="sourceWareHouse">
            <el-select
              v-model="returning['sourceWareHouse']"
              filterable
              placeholder="请选择或输入关键字"
              @change="partListStore">
              <el-option
                v-for="item in returning['sourceData']"
                :key="item.ptStoreLocId"
                :label="item.ptStoreLocName"
                :value="item.ptStoreLocId"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="备件名称:" prop="partName">
            <el-select
              v-model="returning['partName']"
              clearable
              filterable
              placeholder="请选择或输入关键字"
              @change="getQtyOnHand">
              <el-option
                v-for="item in returning['partNameData']"
                :key="item.partId"
                :label="item.name"
                :value="item.partId + '|' + item.qtyOnHand "
              />
            </el-select>
          </el-form-item>
          <el-form-item label="可用数量:" prop="qtyOnHand">
            {{ returning['qtyOnHand'] + '个' }}
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="目标仓库:">
            <el-input
              v-model="returning['targetWareHouse']"
              readonly/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="15">
        <el-col :span="8">
          <el-form-item label="数量:" prop="number">
            <el-input
              v-model.number="returning['number']"
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
  recedePart,
  mechanicOptions,
  partListStore
} from '@/api/part'

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
          if (value > this.returning['qtyOnHand']) {
            callback(new Error('不能大于可用数量'))
          } else {
            callback()
          }
        }
      }, 100)
    }
    return {
      returning: {
        // 备件名称
        partName: '',
        // 可用数量
        qtyOnHand: 0,
        // 数量
        number: '',
        // 目标仓库
        targetWareHouse: '爱玛客备件仓库',
        // 源仓库
        sourceWareHouse: '',
        // 源仓库下拉框
        sourceData: [],
        // 备件名称下拉框
        partNameData: []
      },
      // 退料判断
      returnRule: {
        partName: [
          { required: true, message: '请输入或选择备件名称', trigger: 'blur' }
        ],
        number: [
          { required: true, validator: numberChange, trigger: 'blur' }
        ],
        sourceWareHouse: [
          { required: true, message: '请输入或选择源仓库', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
  },
  created() {},
  async mounted() {
    this.mechanicOptions()
  },
  methods: {
    // 原仓库
    async mechanicOptions() {
      try {
        const r = await mechanicOptions()
        this.returning['sourceData'] = r['data']
        // console.log(r['data'])
      } catch (e) {
        console.log(e)
      } finally {
        () => {}
      }
    },
    // 备件名称
    async partListStore() {
      this.returning['partName'] = ''
      this.returning['qtyOnHand'] = 0
      try {
        const params = {
          storeId: this.returning['sourceWareHouse']
        }
        const r = await partListStore(params)
        this.returning['partNameData'] = r['data']
        // console.log(r['data'])
      } catch (e) {
        console.log(e)
      } finally {
        () => {}
      }
    },
    // 可用数量
    getQtyOnHand() {
      this.returning['qtyOnHand'] = this.returning['partName'].split('|')[1]
    },
    // 提交
    async submit() {
      try {
        const returnFlag = await this.$refs['returnRule'].validate()
        if (returnFlag) {
          const data = {
            ptStoreLocId: this.returning['sourceWareHouse'],
            parts: [
              {
                partId: this.returning['partName'].split('|')[0],
                qtyOnHand: this.returning['number']
              }
            ]
          }
          await recedePart(data)
          this.$message({
            message: '退料成功！',
            type: 'success'
          })
          this.$refs['returnRule'].resetFields()
        }
      } catch (e) {
        console.log(e)
      } finally {
        () => {}
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
