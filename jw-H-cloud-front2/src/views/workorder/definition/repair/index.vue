<template>
  <el-container>
    <el-header>
      <el-row>
        <el-col :span="6">
          <el-button
            @click="edit('create')"
          >新增维修</el-button>
        </el-col>
      </el-row>
    </el-header>
    <el-main>
      <el-card>
        <el-form>
          <el-table
            v-loading="repair['loading']"
            :data="gridData"
            element-loading-text="获取列表中">
            <el-table-column label="序号" width="80" align="center" type="index"/>
            <el-table-column property="repType" label="维修类型" align="center"/>
            <el-table-column property="comments" label="维修类型说明" align="center"/>
            <el-table-column property="date" label="创建时间" width="200" align="center"/>
            <el-table-column property="state" label="状态" align="center"/>
            <el-table-column label="操作" align="center">
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  @click="edit('edit', scope.row)"
                >编辑
                </el-button>
                <el-button
                  type="danger"
                  @click="disUse(scope.row, scope.$index)"
                >停用</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-form>
      </el-card>
    </el-main>
  </el-container>
</template>

<script>

export default {
  components: { },
  filters: {
  },
  props: {

  },
  data() {
    return {
      gridData: [
        {
          date: '2016-05-02',
          repType: '维修',
          comments: '上海市普陀区金沙江路 1518 弄',
          state: '启用'
        }, {
          date: '2016-05-04',
          repType: '巡修',
          comments: '上海市普陀区金沙江路 1518 弄',
          state: '启用'
        }, {
          date: '2016-05-01',
          repType: '抢修',
          comments: '上海市普陀区金沙江路 1518 弄',
          state: '启用'
        }, {
          date: '2016-05-03',
          repType: '巡检',
          comments: '上海市普陀区金沙江路 1518 弄',
          state: '启用'
        }
      ],
      // 维修类型
      repair: {
        // 列表等待
        loading: false
      }
    }
  },
  computed: {

  },
  created() {

  },
  async mounted() {

  },
  methods: {
    // 编辑
    edit(state, row) {
      // console.log(row, state)
      const params = {}
      if (Object.is(state, 'edit')) {
        params['repairType'] = row['repType']
        params['comments'] = row['comments']
      }
      if (Object.is(state, 'create')) {
        params['repairType'] = 1
        params['comments'] = 1
      }
      this.$router.push({
        name: 'workorderDefinitionRepairCreate',
        params: params
      })
    },
    // 停用/启用
    disUse(row, index) {
      console.log('启用', index)
    }
  }
}
</script>

<style lang="scss" scoped>
.el-container{
  padding:30px;
}
</style>
