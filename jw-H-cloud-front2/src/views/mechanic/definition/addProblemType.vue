<template>
  <el-container>
    <el-header>
      <el-row>
        <el-col>
          <el-button type="" @click="back">返回</el-button>
        </el-col>
      </el-row>
    </el-header>
    <el-main>
      <el-form ref="checkData" :rules="checkData" :model="question" label-position="left" label-width="100px">
        <el-card>
          <el-row :gutter="25">
            <el-col :span="8">
              <el-form-item label="问题分类:" prop="sortId">
                <el-select v-model="question.sortId" placeholder="请选择">
                  <el-option
                    v-for="item in classData"
                    :key="item.name"
                    :label="item.name"
                    :value="item.id"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="问题类型:" prop="name">
                <el-input v-model="question.name" placeholder="请输入问题类型" clearable/>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="25">
            <el-col :span="8">
              <el-form-item label="类型说明:" prop="description">
                <el-input v-model="question.description" placeholder="请输入类型说明" clearable />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="预估小时：" prop="predictHour">
                <el-input-number :controls="false" v-model="question.predictHour" placeholder="请输入预估工时" clearable/>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col>
              <el-form-item label="定义工种">
                <el-row>
                  <el-col :span="2">
                    <el-checkbox
                      :indeterminate="isBaseIndeterminate"
                      v-model="baseRoleCheckAll"
                      @change="baseRoleHandleCheckAllChange"
                    >
                      全选
                    </el-checkbox>
                  </el-col>
                  <el-col>
                    <el-checkbox-group
                      v-model="option.permissionList"
                      @change="baseRoleHandleCheckChange"
                    >
                      <el-checkbox
                        v-for="(item,index) in permissionList"
                        :label="item['id']"
                        :key="index"
                      >
                        {{ item.name }}
                      </el-checkbox>
                    </el-checkbox-group>
                  </el-col>
                </el-row>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col align="center">
              <el-form-item >
                <el-button
                  v-loading="isLoading"
                  type=""
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
.el-alert{
  bottom:400px;
}
</style>
<script>
import {
  addProblemClass, // 添加问题类型
  problemClassModify, // 修改问题分类
  problemOptions, // 问题分类选项下拉框
  checkPoblemClass, // 检查问题类型是否存在
  checkBtn, // 工种关联的checkbook
  problemClassFind // 获取问题类型的详情
} from '@/api/mechanic/mechainc'
export default {
  data() {
    // 判断问题分类是否存在
    const checkPoblemTypes = async(rule, value, callback) => {
      if (this.getData) {
        // 修改
        try {
          const params = {
            id: this.getData.id
          }
          const r = await problemClassFind(params)
          this.id = r['data'].sortId
        } catch (e) {
          console.log(e)
        } finally {
          console.log()
        }
        try {
          const data = {
            name: this.question.name,
            sortId: this.id,
            id: this.getData.id
          }
          const r = await checkPoblemClass(data)
          if (Object.is(r['data']['is_success'], true)) {
            callback()
          } else {
            callback(new Error('问题类型已经存在'))
          }
        } catch (e) {
          callback(new Error('网络故障，请稍后重试'))
        }
      } else {
        // 添加
        if (this.question.sortId !== '') {
          try {
            const data = {
              name: this.question.name,
              sortId: this.question.sortId
            }
            const r = await checkPoblemClass(data)
            if (Object.is(r['data']['is_success'], true)) {
              callback()
            } else {
              callback(new Error('问题类型已经存在'))
            }
          } catch (e) {
            callback(new Error('网络故障，请稍后重试'))
          }
        } else {
          this.$confirm('请先选择问题分类', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            // this.$router.go(-1)
          }).catch(() => {
            console.log()
          })
        }
      }
    }
    const hourMax = async(rul, value, callback) => {
      if (this.question.predictHour > 24) {
        this.question.predictHour = '24'
      }
      if (this.question.predictHour < 0) {
        this.question.predictHour = '0'
      }
    }
    return {
      isLoading: false,
      isBaseIndeterminate: false,
      baseRoleCheckAll: false,
      permissionList: [],
      question: {
        name: '',
        description: '',
        predictHour: '',
        sortId: ''
      },
      option: {
        permissionList: []
      },
      classData: [],
      checkData: {
        name: [{ required: true, message: '请输入问题类型', trigger: 'blur' },
          { validator: checkPoblemTypes, trigger: 'blur' }
        ],
        description: [{ required: true, message: '请输入类型说明', trigger: 'blur' }],
        sortId: [{ required: true, message: '请选择问题分类', trigger: 'blur' }],
        predictHour: [{ required: true, message: '请输入工时', trigger: 'blur' },
          { validator: hourMax, trigger: 'blur' }]
      },
      olderData: {},
      workerProblem: [],
      id: '',
      Professions: [],
      getData: [],
      Length: []
    }
  },
  async mounted() {
    this.getdata()
  },
  created() {
  },
  methods: {
    back() {
      if (this.getData) {
        if ((JSON.stringify(this.question) !== JSON.stringify(this.olderData)) ||
        (this.Length.sort().toString() !== this.option.permissionList.sort().toString())) {
          this.$confirm('此操作将返回上一页，数据还未保存, 是否继续返回?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.$router.go(-1)
          }).catch(() => {
            console.log()
          })
        } else {
          this.$router.go(-1)
        }
      } else {
        if (this.question.name !== '' || this.question.sortId !== '' ||
         this.question.predictHour !== 0 || this.question.description !== '') {
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
      window.sessionStorage.removeItem('paramsData')
    },
    async  clear() {
      if (this.getData) {
        this.getData.description = this.question.description
        this.getData.name = this.question.name
        this.getData.predictHour = this.question.predictHour
        this.getData.sortId = this.question.sortId
        this.olderData.name = this.getData.name
        this.olderData.description = this.getData.description
        this.olderData.predictHour = this.getData.predictHour
        this.olderData.sortId = this.getData.sortId
        window.sessionStorage.setItem('paramsData', JSON.stringify(this.getData))
        this.getdata()
      } else {
        this.question.description = ''
        this.question.name = ''
        this.question.predictHour = 0
        this.question.sortId = ''
        try {
        // 获取选框
          const r = await checkBtn()
          this.permissionList = r['data']
        } catch (e) {
          console.log(e)
        } finally {
          this.baseRoleHandleCheckAllChange()
        }
      }
    },
    // 获取数据
    async getdata() {
      this.getData = JSON.parse(window.sessionStorage.getItem('paramsData'))
      if (this.getData) {
        this.olderData.name = this.getData.name
        this.olderData.description = this.getData.description
        this.olderData.predictHour = this.getData.predictHour
        this.olderData.sortId = this.getData.sortId
        this.question.name = this.getData.name
        this.question.description = this.getData.description
        this.question.predictHour = this.getData.predictHour
        this.question.sortId = this.getData.sortId
        try {
          this.isLoading = true
          const params = {
            id: this.getData.id
          }
          const r = await problemClassFind(params)
          this.option.permissionList = r['data'].professions.map(item => item.id)
          this.Length = this.option.permissionList
          this.setCheckAllState()
        } catch (e) {
          console.log(e)
        } finally {
          console.log()
          this.isLoading = false
        }
      }
      try {
        const r = await problemOptions()
        this.classData = r['data']
      } catch (e) {
        console.log(e)
      }
      try {
        // 获取选框
        const r = await checkBtn()
        this.permissionList = r['data']
      } catch (e) {
        console.log(e)
      } finally {
        this.setCheckAllState()
      }
    },
    // 选框内容
    setCheckAllState() {
      const checkedCount = this.option.permissionList.length
      this.baseRoleCheckAll = checkedCount === this.permissionList.length
      this.isBaseIndeterminate = checkedCount > 0 && checkedCount < this.permissionList.length
    },
    async save() {
      if (this.option.permissionList.length !== 0) {
        this.Professions = []
        this.option.permissionList.map((item) => {
          const temp = {}
          temp.id = item
          this.Professions.push(temp)
        })
        if (this.getData) {
          if ((JSON.stringify(this.question) !== JSON.stringify(this.olderData)) ||
           (this.Length.sort().toString() !== this.option.permissionList.sort().toString())) {
            try {
              await this.$refs['checkData'].validate()
              this.isLoading = true
              const body = {
                professions: this.Professions,
                name: this.question.name,
                predictHour: this.question.predictHour,
                description: this.question.description,
                id: this.getData.id,
                sortId: this.id
              }
              await problemClassModify(body)
              this.$message({
                message: '问题类型修改成功',
                type: 'success'
              })
              this.clear()
            } catch (e) {
              console.log(e)
            } finally {
              this.isLoading = false
              this.setCheckAllState()
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
          try {
            await this.$refs['checkData'].validate()
            this.isLoading = true
            const body = {
              name: this.question.name,
              state: 0,
              predictHour: this.question.predictHour,
              description: this.question.description,
              professions: this.Professions,
              sortId: this.question.sortId
            }
            await addProblemClass(body)
            this.$message({
              message: '问题类型新增成功',
              type: 'success'
            })
            this.clear()
            // this.getdata()
          } catch (e) {
            console.log(e)
          } finally {
            this.isLoading = false
            this.setCheckAllState()
          }
        }
      } else {
        this.$confirm('请先选定工种再提交', '提示', {
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
    },

    // 基础权限 全选状态发生改变
    baseRoleHandleCheckAllChange(v) {
      this.option.permissionList = v ? this.permissionList.map(v => v.id) : []
      this.isBaseIndeterminate = false
    },
    // 基础权限 全选状态发生改变
    baseRoleHandleCheckChange(v) {
      const checkedCount = v.length
      this.baseRoleCheckAll = checkedCount === this.permissionList.length
      this.isBaseIndeterminate = checkedCount > 0 && checkedCount < this.permissionList.length
    }
  }
}
</script>
