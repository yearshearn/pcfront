<template>
  <div>
    <el-table
      :data="longTermData"
      fit
      stripe
      style="width:100%;margin:20px 0 28px 0;"
    >
      <el-table-column width="80" align="center" type="index" label="问题编码"/>
      <el-table-column align="center" prop="workContent" label="工作内容"/>
      <el-table-column align="center" prop="insDed" label="检查/扣分"/>
      <el-table-column width="80" align="center" prop="score" label="标准分"/>
      <el-table-column width="80" align="center" label="操作 ">
        <template slot-scope="scope">
          <el-button
            circle
            type="danger"
            icon="el-icon-delete"
            @click.native.prevent="deleteRow(scope.$index, longTermData)"
          />
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  // 子组件通过props来接收数据:
  props: {
    'longTermData': {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
    }
  },
  created() {},
  async mounted() {},
  methods: {
    // 删除内容
    deleteRow(index, rows) {
      rows.splice(index, 1)
    }
  }
}
</script>

<style scoped>
</style>
