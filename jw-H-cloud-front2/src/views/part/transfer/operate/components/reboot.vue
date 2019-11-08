<template>
  <el-card>
    <el-form
      ref="rebootRule"
      :rules="rebootRule"
      :model="reboot"
      label-width="100px"
      label-position="right">
      <el-row :gutter="15">
        <el-col :span="8">
          <el-form-item label="源仓库:" prop="sourceWareHouse">
            <el-select
              v-model="reboot['sourceWareHouse']"
              clearable
              filterable
              placeholder="请选择或输入关键字">
              <el-option
                v-for="item in reboot['targetData']"
                :key="item.ptStoreLocId"
                :label="item.ptStoreLocName"
                :value="item.ptStoreLocId"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="目标仓库:" prop="partName">
            <el-input
              v-model="reboot['targetWareHouse']"
              readonly/>
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
  withdrawing,
  mechanicOptions
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
    return {
      reboot: {
        // 源仓库
        sourceWareHouse: '',
        // 目标仓库
        targetWareHouse: '爱玛客备件仓库',
        // 目标仓库下拉框
        targetData: []
      },
      // 表单验证
      rebootRule: {
        sourceWareHouse: [
          { required: true, message: '请输入或选择源仓库', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {

  },
  created() {

  },
  async mounted() {
    this.mechanicOptions()
  },
  methods: {
    // 原仓库
    async mechanicOptions() {
      try {
        const r = await mechanicOptions()
        this.reboot['targetData'] = r['data']
        // console.log(r['data'])
      } catch (e) {
        console.log(e)
      } finally {
        () => {}
      }
    },
    // 提交
    async submit() {
      const rebootFlag = await this.$refs['rebootRule'].validate()
      if (rebootFlag) {
        try {
          const data = {
            storeId: this.reboot['sourceWareHouse']
          }
          await withdrawing(data)
          this.$message({
            message: '一键退库成功！',
            type: 'success'
          })
          this.$refs['rebootRule'].resetFields()
        } catch (e) {
          console.log(e)
        } finally {
          () => {}
        }
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
    margin-top: 33%;
  }
</style>
