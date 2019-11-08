<template style="height:100%">
  <el-container style="padding: 20px">
    <el-main>
      <el-card>
        <el-table
          :data="tableData"
          border
          fit
          stripe
          highlight-current-row
          style="width: 100%"
          max-height="400px"
        >
          <el-table-column
            align="center"
            prop="name"
            show-overflow-tooltip
            label="备件名称" />
          <el-table-column
            align="center"
            prop="code"
            show-overflow-tooltip
            label="备件编码" />
          <el-table-column
            align="center"
            prop="type"
            show-overflow-tooltip
            label="备件类型" />
          <el-table-column
            align="center"
            prop="qtyMinHand"
            show-overflow-tooltip
            label="最小保有量" />
          <el-table-column
            align="center"
            prop="qtyOnHand "
            show-overflow-tooltip
            label="可用数量" />
          <el-table-column
            align="center"
            prop="costTotal"
            show-overflow-tooltip
            label="库存总价值" />
        </el-table>
      </el-card>
    </el-main>
  </el-container>
</template>

<script>
import { partInventory } from '@/api/part'
export default {
  name: 'PartInventoryList',
  components: {},
  filters: {},
  props: {},
  data() {
    //  const validate = (rule, value, callback) => {
    //    if (value === '') {
    //      this.$message({
    //        message: rule.field + '为必填项',
    //        type: 'error'
    //      })
    //      callback(new Error(rule.field + '为必填项'))
    //    } else {
    //      callback()
    //    }
    //  }
    return {
      ruleForm: {
        code: '1',
        name: ''
      },
      tableData: [],
      rules: {
        code: {
          required: true, message: '请输入仓库编码', trigger: 'blur'
        },
        name: {
          required: true, message: '请输入仓库名称', trigger: 'blur'
        }
      }
    }
  },
  computed: {},
  created() {
    this.getData()
  },
  async mounted() {},
  methods: {
    async getData() {
      try {
        const params = {
          mode: 0
        }
        const result = await partInventory(params)
        this.tableData = result.data.list
      } catch (e) {
        console.log(e)
      } finally {
        console.log(123)
      }
    }
  }
}
</script>

<style>
</style>
