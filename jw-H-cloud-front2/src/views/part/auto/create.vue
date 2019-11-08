<template style="height:100%">
  <el-container style="padding: 20px">
    <el-header>
      <el-row :gutter="20">
        <el-col>
          <el-button @click="$router.go(-1)">返回</el-button>
        </el-col>
      </el-row>
    </el-header>
    <el-main>
      <el-card>
        <el-form
          ref="ruleForm"
          :rules="rules"
          :model="ruleForm"
          label-position="right"
          label-width="110px"
        >
          <el-row :gutter="15">
            <el-col :span="6">
              <el-form-item label="备件编码:" prop="code">
                <el-input v-model="ruleForm.code" placeholder="请输入备件编码"/>
                <!-- <el-button>231</el-button> -->
              </el-form-item>
            </el-col>
            <el-col :offset="2" :span="6">
              <el-form-item label="备件名称:" prop="name">
                <el-input v-model="ruleForm.name" placeholder="请输入备件名称"/>
              </el-form-item>
            </el-col>
            <el-col :offset="2" :span="6">
              <el-form-item label="备件类别:" prop="category">
                <el-input v-model="ruleForm.category" placeholder="请输入备件类别"/>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="15">
            <el-col :span="6">
              <el-form-item label="备件类型:" prop="type">
                <el-input v-model="ruleForm.type" placeholder="请输入备件类型"/>
                <!-- <el-button>231</el-button> -->
              </el-form-item>
            </el-col>
            <el-col :offset="2" :span="6">
              <el-form-item label="单价:" prop="cost">
                <el-input v-model="ruleForm.cost" placeholder="请输入单价"/>
              </el-form-item>
            </el-col>
            <el-col :offset="2" :span="6">
              <el-form-item label="单位:" prop="unit">
                <el-input v-model="ruleForm.unit" placeholder="请输入单位"/>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="15">
            <el-col :span="6">
              <el-form-item label="备件供应商:" prop="supplier">
                <el-input v-model="ruleForm.supplier" placeholder="请输入备件供应商"/>
              </el-form-item>
            </el-col>
            <el-col :offset="2" :span="6">
              <el-form-item label="安全保有量:" prop="safe">
                <el-input v-model="ruleForm.safe" placeholder="请输入安全保有量"/>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col align="center">
              <el-form-item>
                <el-button type="primary" class="save" @click="submit('ruleForm')">保存</el-button>
                <el-button @click="resetForm('ruleForm')">重置</el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-card>
    </el-main>
  </el-container>
</template>

<script>
export default {
  name: 'PartAutoCreate',
  components: {},
  filters: {},
  props: {},
  data() {
    const validate = (rule, value, callback) => {
      if (value === '') {
        this.$message({
          message: rule.field + '为必填项',
          type: 'error'
        })
        callback(new Error(rule.field + '为必填项'))
      } else {
        callback()
      }
      console.log(validate)
    }
    return {
      ruleForm: {
        category: '',
        code: 1,
        cost: 0,
        name: '',
        safe: 0,
        supplier: '',
        type: '',
        unit: ''
      },
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
    this._getParams()
  },
  async mounted() {},
  methods: {
    _getParams() {
      const { name, code } = this.$route.params
      this.ruleForm.code = code
      this.ruleForm.name = name
    },
    async submit(formName) {
      const valid = this.$refs[formName].validate()

      if (valid) {
        console.log('submit')
      } else {
        console.log('err')
      }
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    }
  }
}
</script>

<style>
</style>
