<template>
  <el-container>
    <el-header>
      <el-row>
        <el-col :span="6">
          <el-button
            @click="edit('create')"
          >新增问题</el-button>
        </el-col>
      </el-row>
    </el-header>
    <el-main>
      <el-card>
        <el-form>
          <el-table
            v-loading="problem['loading']"
            :data="gridData"
            element-loading-text="获取列表中">
            <el-table-column label="序号" width="80" align="center" type="index"/>
            <el-table-column property="proType" label="问题类型" align="center"/>
            <el-table-column property="comments" label="问题类型说明" align="center"/>
            <el-table-column property="classification" label="问题分类" align="center"/>
            <el-table-column property="date" label="创建时间" width="200" align="center"/>
            <el-table-column label="操作" width="300" align="center">
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  @click="edit('edit', scope.row)"
                >编辑
                </el-button>
                <el-button
                  type="danger"
                  @click="use('stop')"
                >停用</el-button>
                <el-button
                  type="success"
                  @click="use('enable')"
                >启用</el-button>
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
          proType: 'BA故障',
          comments: '上海市普陀区金沙江路 1518 弄',
          classification: '其他维护'
        }, {
          date: '2016-05-04',
          proType: '电源故障',
          comments: '上海市普陀区金沙江路 1518 弄',
          classification: '其他维护'
        }, {
          date: '2016-05-01',
          proType: '小家电故障',
          comments: '上海市普陀区金沙江路 1518 弄',
          classification: '定期维护'
        }, {
          date: '2016-05-03',
          proType: '其他故障',
          comments: '上海市普陀区金沙江路 1518 弄',
          classification: '应需维护'
        }
      ],
      // 问题类型
      problem: {
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
      console.log(row, state)
      const params = {}
      if (Object.is(state, 'edit')) {
        params['problemType'] = row['proType']
        params['comments'] = row['comments']
        params['classification'] = row['classification']
      }
      if (Object.is(state, 'create')) {
        params['problemType'] = 1
        params['comments'] = 1
        params['classification'] = 1
      }
      this.$router.push({
        name: 'workorderDefinitionProblemCreate',
        params: params
      })
    },
    // 停用/启用
    use(state) {
      if (Object.is(state, 'stop')) {
        console.log('停用')
      }
      if (Object.is(state, 'enable')) {
        console.log('启用')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.el-container{
  padding:30px;
}
</style>
