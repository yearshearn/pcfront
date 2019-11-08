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
      <el-form ref="checkData" :rules="checkData" :model="question" label-position="left" label-width="100px">
        <el-card>
          <el-row :gutter="25">
            <el-col :span="6">
              <el-form-item label="工种名称:" prop="name">
                <el-input v-model="question.name" placeholder="请输入工种名称" clearable/>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="工种说明:" prop="description">
                <el-input v-model="question.description" placeholder="请输入工种说明" clearable/>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="工作小时:" prop="hour" >
                <el-input-number :controls="false" v-model="question.hour" placeholder="请输入工作小时" clearable />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="25">
            <el-col :span="6">
              <el-form-item label="小时费率:" prop="hourlyRate">
                <el-input-number :controls="false" v-model="question.hourlyRate" placeholder="请输入小时费率" clearable />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="加班费率:" prop="overtimeRate" >
                <el-input-number :controls="false" v-model.number="question.overtimeRate" placeholder="请输入加班费率" clearable/>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="双倍费率:" prop="doubleRate">
                <el-input-number :controls="false" v-model.number="question.doubleRate" placeholder="请输入双倍费率" clearable/>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col>
              <el-form-item label="问题类型:" >
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
                  <el-col :span="16">
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

</style>
<script>
import {
// createdTypeWork
  typeWorkCheckBox, // 问题类型多选框
  typeWorkFind, // 工种详情
  chekProfessionName, // 检查工种是否存在
  createdTypeWork, // 添加工种
  modifyTypeWork// 修改工种
} from '@/api/mechanic/mechainc'

export default {
  data() {
    const checkPoblemTypes = async(rule, value, callback) => {
      if (this.paramsDatas) {
        try {
          const params = {
            id: this.paramsDatas.id
          }
          const r = await typeWorkFind(params)
          this.id = r['data'].id
        } catch (e) {
          console.log(e)
        }
        try {
          const params = {
            id: this.id,
            name: this.question.name
          }
          const r = await chekProfessionName(params)
          if (Object.is(r['data']['is_success'], true)) {
            callback()
          } else {
            callback(new Error('问题类型已经存在'))
          }
        } catch (e) {
          callback(new Error('网络故障，请稍后重试'))
        }
      }
    }
    const hourMax = async(rul, value, callback) => {
      if (this.question.hour > 24) {
        this.question.hour = '24'
      }
      if (this.question.hour < 0) {
        this.question.hour = '0'
      }
    }
    const overtimeRateMax = async(rul, value, callback) => {
      if (this.question.overtimeRate > 24) {
        this.question.overtimeRate = '24'
        // console.log(this.question.overtimeRate)
      }
      if (this.question.overtimeRate < 0) {
        this.question.overtimeRate = '0'
      }
    }
    const doubleRateMax = async(rul, value, callback) => {
      if (this.question.doubleRate > 24) {
        this.question.doubleRate = '24'
        // console.log(this.question.doubleRate)
      }

      if (this.question.doubleRate < 0) {
        this.question.doubleRate = '0'
      }
    }
    const hourlyRateMax = async(rul, value, callback) => {
      if (this.question.hourlyRate > 24) {
        this.question.hourlyRate = '24'
        // console.log(this.question.hourlyRate)
      }
      if (this.question.hourlyRate < 0) {
        this.question.hourlyRate = '0'
      }
    }
    return {
      isLoading: false,
      isBaseIndeterminate: false,
      baseRoleCheckAll: false,
      permissionList: [],
      question: {
        name: '', // 工种名称
        hour: 0, // 每天工作小时
        description: '', // 说明
        hourlyRate: 0, // 小时费率
        overtimeRate: 0, // 加班费率
        doubleRate: 0 // 双倍费率
      },
      option: {
        permissionList: []
      },
      checkData: {
        name: [
          { required: true, message: '请输入工种名称', trigger: 'blur' },
          { validator: checkPoblemTypes, trigger: 'blur' }
        ],
        hour: [
          { required: true, message: '请输入每天工作小时', trigger: 'blur' },
          { validator: hourMax, trigger: 'blur' }
        ],
        description: [
          { required: true, message: '请输入工种说明', trigger: 'blur' }
        ],
        hourlyRate: [
          { required: true, message: '请输入小时费率', trigger: 'blur' },
          { validator: hourlyRateMax, trigger: 'blur' }
        ],
        overtimeRate: [
          { required: true, message: '请输入加班费率', trigger: 'blur' },
          { validator: overtimeRateMax, trigger: 'blur' }
        ],
        doubleRate: [
          { required: true, message: '请输入双倍加班费率', trigger: 'blur' },
          { validator: doubleRateMax, trigger: 'blur' }
        ]
      },
      paramsDatas: [],
      olderData: {},
      id: '',
      Professions: [],
      Length: []
    }
  },
  async mounted() {
    // console.log(this.paramsDatas)
    this.getdata()
  },
  methods: {
    back() {
      if (this.paramsDatas) {
        if ((JSON.stringify(this.question) !== JSON.stringify(this.olderData)) ||
         (this.Length.sort().toString() !== this.option.permissionList.sort().toString())) {
          this.$confirm('此操作将返回上一页，数据还未保存, 是否继续返回?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.$router.go(-1)
          }).catch(() => {
          // this.$message({
          // })
          })
        } else {
          this.$router.go(-1)
        }
      } else {
        if (this.question.name !== '' || this.question.hour !== 0 ||
         this.question.description !== '' || this.question.hourlyRate !== 0 ||
         this.question.overtimeRate !== 0 || this.question.doubleRate !== 0) {
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
    async getdata() {
      this.paramsDatas = JSON.parse(window.sessionStorage.getItem('paramsData'))
      if (this.paramsDatas) {
        this.question.name = this.paramsDatas.name
        this.question.description = this.paramsDatas.description
        this.question.hour = this.paramsDatas.hour
        this.question.hourlyRate = this.paramsDatas.hourlyRate
        this.question.overtimeRate = this.paramsDatas.overtimeRate
        this.question.doubleRate = this.paramsDatas.doubleRate
        this.olderData.name = this.paramsDatas.name
        this.olderData.hour = this.paramsDatas.hour
        this.olderData.description = this.paramsDatas.description
        this.olderData.hourlyRate = this.paramsDatas.hourlyRate
        this.olderData.overtimeRate = this.paramsDatas.overtimeRate
        this.olderData.doubleRate = this.paramsDatas.doubleRate
      }
      try {
        // 工种详情
        const params = {
          id: this.paramsDatas.id
        }
        const r = await typeWorkFind(params)
        this.option.permissionList = r['data'].problemTypes.map(item => item.id)
        this.Length = this.option.permissionList
        this.setCheckAllState()
      } catch (e) {
        console.log(e)
      } finally {
        console.log()
      }
      try {
        // 获取选框内容
        const r = await typeWorkCheckBox()
        this.permissionList = r['data']
        // this.setCheckAllState()
      } catch (e) {
        console.log(e)
      } finally {
        this.setCheckAllState()
      }
    },
    async clear() {
      if (this.paramsDatas) {
        this.paramsDatas.hour = this.question.hour
        this.paramsDatas.hourlyRate = this.question.hourlyRate
        this.paramsDatas.overtimeRate = this.question.overtimeRate
        this.paramsDatas.doubleRate = this.question.doubleRate
        this.paramsDatas.name = this.question.name
        this.paramsDatas.description = this.question.description
        this.olderData.name = this.paramsDatas.name
        this.olderData.hour = this.paramsDatas.hour
        this.olderData.description = this.paramsDatas.description
        this.olderData.hourlyRate = this.paramsDatas.hourlyRate
        this.olderData.overtimeRate = this.paramsDatas.overtimeRate
        this.olderData.doubleRate = this.paramsDatas
        window.sessionStorage.setItem('paramsData', JSON.stringify(this.paramsDatas))
        this.getdata()
      } else {
        this.question.hour = 0
        this.question.hourlyRate = 0
        this.question.overtimeRate = 0
        this.question.doubleRate = 0
        this.question.name = ''
        this.question.description = ''
        // this.option.permissionList = []
        try {
        // 获取选框内容
          const r = await typeWorkCheckBox()
          this.permissionList = r['data']
        // this.setCheckAllState()
        } catch (e) {
          console.log(e)
        } finally {
          this.baseRoleHandleCheckAllChange()
        }
      }

      // this.paramsDatas = null
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
        if (this.paramsDatas) {
          if ((JSON.stringify(this.question) !== JSON.stringify(this.olderData)) ||
          (this.Length.sort().toString() !== this.option.permissionList.sort().toString())) {
            // console.log(this.option.permissionList)
            // console.log((this.paramsDatas.problemTypes))
            // return
            try {
              await this.$refs['checkData'].validate()
              this.isLoading = true
              const body = {
                problemTypes: this.Professions,
                name: this.question.name,
                description: this.question.description,
                hour: this.question.hour,
                hourlyRate: this.question.hourlyRate,
                overtimeRate: this.question.overtimeRate,
                doubleRate: this.question.doubleRate,
                id: this.id
              }
              await modifyTypeWork(body)
              this.$message({
                message: '工种修改成功',
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
              hour: this.question.hour,
              hourlyRate: this.question.hourlyRate,
              overtimeRate: this.question.overtimeRate,
              doubleRate: this.question.doubleRate,
              description: this.question.description,
              problemTypes: this.Professions
            }
            await createdTypeWork(body)
            this.$message({
              message: '工种新增成功',
              type: 'success'
            })
            this.clear()
          } catch (e) {
            console.log(e)
          } finally {
            this.isLoading = false
            this.setCheckAllState()
          }
        }
      } else {
        this.$confirm('请先选定问题类型再提交', '提示', {
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
