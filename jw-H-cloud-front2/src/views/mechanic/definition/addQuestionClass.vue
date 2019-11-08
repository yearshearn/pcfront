<template>
  <el-container>
    <el-header>
      <el-row>
        <el-col>
          <el-button type="" @click="back">
            返回
          </el-button>
        </el-col>
      </el-row>
    </el-header>
    <el-main>
      <el-form ref="rules" :rules="rules" :model="question" label-position="left" label-width="100px">
        <el-card>
          <el-row :gutter="25">
            <el-col :span="6">
              <el-form-item label="问题分类:" prop="name">
                <el-input v-model="question.name" placeholder="请输入问题分类" clearable/>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="分类说明:" prop="description" >
                <el-input v-model="question.description" placeholder="请输入问题分类说明" clearable/>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col align="center">
              <el-form-item >
                <el-button
                  v-loading="isLoading"
                  type=""
                  class="save"
                  @click.native.prevent="save">{{ isLoading ? '保存中' : '保 存' }}</el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-card>
      </el-form>
    </el-main>
  </el-container>
</template>
<style>
.el-row {
  margin-bottom: 20px;
}

.el-col {
  border-radius: 4px;
}
.save{
  margin-top: 35%;
}
</style>
<script>
import {
  problemTypeadd, // 添加问题分类
  problemTypeModify, // 修改问题分类
  checkPoblemType, // 检查分类是否存在
  findIdData// 问题分类详情
} from '@/api/mechanic/mechainc'

export default {
  data() {
    // 判断问题分类是否存在
    const checkPoblemTypes = async(rule, value, callback) => {
      if (this.getData) {
        // 修改
        try {
          const data = {
            name: this.question.name,
            id: this.getData.id
          }
          const r = await checkPoblemType(data)
          if (Object.is(r['data']['is_success'], true)) {
            callback()
          } else {
            callback(new Error('问题分类已经存在'))
          }
        } catch (e) {
          callback(new Error('网络故障，请稍后重试'))
        }
      } else {
        // 添加
        try {
          const data = {
            name: this.question.name
          }
          console.log(data)
          const r = await checkPoblemType(data)
          if (Object.is(r['data']['is_success'], true)) {
            callback()
          } else {
            callback(new Error('问题分类已经存在'))
          }
        } catch (e) {
          callback(new Error('网络故障，请稍后重试'))
        }
      }
    }
    return {
      isLoading: false,
      question: {
        name: '',
        description: ''
      },
      rules: {
        name: [
          { required: true, message: '请输入分类', trigger: 'blur' },
          { validator: checkPoblemTypes, trigger: 'blur' }
        ],
        description: [{ required: true, message: '请输入说明', trigger: 'blur' }]
      },
      olderData: {},
      id: ''
    }
  },
  async mounted() {
    this.getdata()
  },
  methods: {
    back() {
      if (this.getData) {
        if (JSON.stringify(this.question) !== JSON.stringify(this.olderData)) {
          this.$confirm('此操作将返回上一页，数据还未保存, 是否继续返回?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.$router.go(-1)
          }).catch((e) => {
            console.log(e)
          })
        } else {
          this.$router.go(-1)
        }
      } else {
        if (this.question.name !== '' || this.question.description !== '') {
          this.$confirm('此操作将返回上一页，数据还未保存, 是否继续返回?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.$router.go(-1)
          }).catch((e) => {
            console.log(e)
          })
        } else {
          this.$router.go(-1)
        }
      }
      // this.$router.go(-1)
      window.sessionStorage.removeItem('paramsData')
    },
    async getdata() {
      this.getData = JSON.parse(window.sessionStorage.getItem('paramsData'))
      try {
        const params = {
          id: this.getData.id
        }
        const r = await findIdData(params)
        if (this.getData) {
          this.question.name = r.data.name
          this.question.description = r.data.description
          this.olderData.name = r.data.name
          this.olderData.description = r.data.description
          this.id = r.data.id
        }
      } catch (e) {
        console.log(e)
      }
    },
    async save() {
      if (this.getData) {
        if (JSON.stringify(this.question) !== JSON.stringify(this.olderData)) {
        /** 修改 */
        // this.getdata()
          try {
            const checkData = await this.$refs['rules'].validate()
            this.isLoading = true
            if (checkData) {
              const body = {
                name: this.question.name,
                state: 1,
                description: this.question.description,
                id: this.id
              }
              await problemTypeModify(body)
              this.$message({
                message: '修改成功',
                type: 'success'
              })
              this.clear()
            }
          } catch (e) {
            console.log(e)
          } finally {
            this.isLoading = false
          }
        } else {
          this.$confirm('没有修改，请修改后再保存', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            console.log()
          }).catch(() => {
            // this.$message({
            // })
          })
        }
      } else {
        /** 创建 */
        try {
          const checkData = await this.$refs['rules'].validate()
          this.isLoading = true
          if (checkData) {
            const body = {
              name: this.question.name,
              state: 1,
              description: this.question.description
            }
            await problemTypeadd(body)
            this.$message({
              message: '创建成功',
              type: 'success'
            })
            this.clear()
          }
        } catch (e) {
          console.log(e)
        } finally {
          this.isLoading = false
        }
      }
    },
    clear() {
      if (this.getData) {
        this.getData.name = this.question.name
        this.getData.description = this.question.description
        window.sessionStorage.setItem('paramsData', JSON.stringify(this.getData))
        this.getdata()
      } else {
        this.question.name = ''
        this.question.description = ''
      }
    }
  }
}
</script>
