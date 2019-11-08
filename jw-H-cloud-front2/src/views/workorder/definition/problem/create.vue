<template>
  <el-container>
    <el-header>
      <el-row>
        <el-col>
          <el-button @click="$router.back(-1)">返回</el-button>
        </el-col>
      </el-row>
    </el-header>
    <el-main>
      <el-row>
        <el-col>
          <el-card>
            <el-form
              ref="createRules"
              :rules="createRules"
              :model="create"
              style="min-height:600px"
              label-position="right"
              label-width="110px">
              <el-row :gutter="15">
                <el-col :span="6">
                  <el-form-item label="问题类型" prop="problemType">
                    <el-input v-model="create['problemType']" placeholder="请输入问题类型" clearable/>
                  </el-form-item>
                </el-col>
                <el-col :offset="3" :span="6">
                  <el-form-item label="问题类型说明" prop="comments">
                    <el-input v-model="create['comments']" placeholder="请输入问题类型说明" clearable/>
                  </el-form-item>
                </el-col>
                <el-col :offset="2" :span="6">
                  <el-form-item label="问题分类" prop="classification">
                    <el-select v-model="create['classification']" placeholder="请选择问题分类" clearable>
                      <el-option value="应需维护">应需维护</el-option>
                      <el-option value="定期维护">定期维护</el-option>
                      <el-option value="其他维护">其他维护</el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col align="center">
                  <el-button class="save" @click="save">保存</el-button>
                </el-col>
              </el-row>
            </el-form>
          </el-card>
        </el-col>
      </el-row>
    </el-main>
  </el-container>
</template>

<script>

export default {
  components: { },
  filters: {
  },
  data() {
    return {
      // 新增/修改
      create: {
        // 问题类型
        problemType: '',
        // 说明
        comments: '',
        // 问题分类
        classification: ''
      },
      createRules: {
        problemType: [
          { required: true, message: '请输入维修类型', trigger: 'blur' }
        ],
        comments: [
          { required: true, message: '请输入维修类型说明', trigger: 'blur' }
        ],
        classification: [
          { required: true, message: '请选择问题分类', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {

  },
  created() {
    this.routeParams()
  },
  async mounted() {
  },
  methods: {
    // 新建/编辑
    routeParams() {
      if (!Object.is(this.$route.params['problemType'], '1') && !Object.is(this.$route.params['problemType'], 1)) {
        // console.log(this.$route.params)
        this.create['problemType'] = this.$route.params['problemType']
        this.create['comments'] = this.$route.params['comments']
        this.create['classification'] = this.$route.params['classification']
      }
    },
    // 保存
    async save() {
      try {
        const createFlag = await this.$refs['createRules'].validate()
        if (createFlag) {
          if (!Object.is(this.$route.params['problemType'], 1)) {
            // await changeDept(this.create)
            this.$message({
              message: '修改成功！',
              type: 'success'
            })
            return
          }
          // await changeDept(this.create)
          this.$message({
            message: '新增成功！',
            type: 'success'
          })
        }
      } catch (e) {
        console.log(e)
      } finally {
        console.log(2)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.el-container {
  padding: 30px;
}

.save{
  margin-top: 40%;
}
</style>
