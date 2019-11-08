<template>
  <div>
    <el-table
      :data="regularData"
      fit
      stripe
      style="width:100%;margin:20px 0 28px 0;"
    >
      <el-table-column width="80" align="center" type="index" label="问题编码"/>
      <el-table-column width="800" align="center" prop="proProblem" label="问题名称"/>
      <el-table-column align="center" label="问题答案">
        <template
          slot-scope="{row}"
        >{{ row.tAnswer[0].ansAnswer }} / {{ row.tAnswer[1].ansAnswer }}</template>
      </el-table-column>
      <el-table-column width="80" align="center" label="操作">
        <template slot-scope="scope">
          <el-button
            circle
            type="danger"
            icon="el-icon-delete"
            @click.native.prevent="deleteRow(scope.$index, regularData)"
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
    'regularData': {
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
      // console.log(rows)
    }
  }
}
</script>

<style scoped>

</style>
