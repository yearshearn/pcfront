<template style="height:100%">
  <el-container style="padding: 20px">
    <el-header>
      <el-row :gutter="20">
        <el-col>
          <el-button @click="back">返回</el-button>
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
          label-width="120px"
        >
          <el-row>
            <el-col :span="6">
              <el-form-item label="备件类别:" prop="name">
                <el-input v-model="ruleForm.name" style="width:300px" placeholder="请输入备件类别名称"/>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col>
              <el-form-item label="类别描述:" prop="description">
                <el-input
                  v-model="ruleForm.description"
                  :autosize="{
                    minRows:3
                  }"
                  placeholder="请输入详细描述"
                  maxlength="250"
                  show-word-limit
                  resize="none"
                  type="textarea"
                  style="max-width:650px"/>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col align="center">
              <el-form-item>
                <el-button type="primary" class="save" @click="submit">保存</el-button>
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
import { lengthReg } from '@/utils/validate/reg'
import {
  createPartType, // 添加备件类型
  modifyPartType, // 修改备件类型
  findPartType, // 备件类型详情
  checkPartType // 检查备件类型
} from '@/api/part'
export default {
  name: 'PartTypeCreate',
  components: {},
  filters: {},
  props: {},
  data() {
    // 判断类型名称是否存在
    const checkName = async(rule, value, callback) => {
      if (this.ruleForm.id) {
        try {
          const params = {
            name: this.ruleForm.name,
            ptCatId: this.ruleForm.id
          }
          const r = await checkPartType(params)
          if (r.data.is_success === false) {
            console.log(r.data.is_success)
            callback(new Error('备件类别已经存在'))
          }
        } catch (e) {
          callback(new Error('网络故障，请稍后重试'))
        }
      } else {
        try {
          const params = {
            name: this.ruleForm.name
          }
          const r = await checkPartType(params)
          if (r.data.is_success === false) {
            console.log(r.data.is_success)
            callback(new Error('备件类别已经存在'))
          }
        } catch (e) {
          callback(new Error('网络故障，请稍后重试'))
        }
      }
    }
    return {
      ruleForm: {
        state: '',
        name: '',
        id: '',
        description: ''
      },
      rules: {
        name: [
          { required: true, message: '请输入备件类别名称' },
          { pattern: lengthReg, message: '长度不能超过25个汉字' },
          { validator: checkName, trigger: 'blur' }
        ]
      }

    }
  },
  computed: {},
  created() {},
  async mounted() {
    this.getData()
  },
  methods: {
    // 返回按钮
    back() {
      this.$router.go(-1)
    },
    async getData() {
      if (this.$route.params.id === undefined) {
        return
      } else {
        try {
          const params = {
            ptCatId: this.$route.params.id
          }
          const result = await findPartType(params)
          if (this.$route.params.id) {
            this.ruleForm.id = result.data.ptCatId
            this.ruleForm.name = result.data.name
            this.ruleForm.state = result.data.state
            this.ruleForm.description = result.data.description
          }
        } catch (err) {
          console.log(err)
        } finally {
          console.log('备件类型')
        }
      }
    },
    async submit() {
      if (this.$route.params.id) {
        console.log(this.$route.params.id + '修改页面')
        /** 修改 */
        //   this.getData()
        try {
          const checkData = await this.$refs['ruleForm'].validate()
          if (checkData) {
            const body = {
              name: this.ruleForm.name,
              ptCatId: this.ruleForm.id,
              description: this.ruleForm.description,
              state: this.ruleForm.state
            }
            await modifyPartType(body)
            this.$message({
              message: '修改成功',
              type: 'success'
            })
            // this.ruleForm.name = ''
          }
        } catch (e) {
          console.log(e)
        } finally {
          this.isLoading = false
        }
      } else {
        /** 创建 */
        try {
          const checkData = await this.$refs['ruleForm'].validate()
          if (checkData) {
            const body = {
              name: this.ruleForm.name,
              description: this.ruleForm.description,
              state: 0
            }
            await createPartType(body)
            this.$message({
              message: '创建成功',
              type: 'success'
            })
            // this.ruleForm.name = ''
          }
        } catch (e) {
          console.log(e)
        } finally {
          this.isLoading = false
        }
      }
    },
    resetForm(ruleForm) {
      console.log(ruleForm)
      this.$refs[ruleForm].resetFields()
    }
  }
}
</script>

<style>
</style>
