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
      <el-form ref="checkData" :rules="checkData" :model="group" label-position="left" label-width="100px">
        <el-card>
          <el-row :gutter="15">
            <el-col :span="8">
              <el-form-item label="工作组名称:" prop="name">
                <el-input v-model="group.name" placeholder="请输入工作组名称" clearable/>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="用户自分配:" prop="cfAssign">
                <el-select v-model="group.cfAssign" placeholder="请选择">
                  <el-option
                    v-for="item in data"
                    :key="item.value"
                    :label="item.name"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="15">
            <el-col :span="8">
              <el-form-item label="工作组说明:" prop="description" >
                <el-input v-model="group.description" placeholder="请输入工作组说明" clearable/>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="请选择主管:" prop="adminData" >
                <el-select v-model="group.adminData" placeholder="请选择">
                  <el-option
                    v-for="item in adminData"
                    :key="item.userId"
                    :label="item.userName"
                    :value="item.userId"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col>
              <el-form-item label="工作组人员:">
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
                        :label="item['userId']"
                        :key="index"
                      >
                        {{ item.userName }}
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
/* .save{
  margin-top: 30%;
} */

</style>
<script>
import {
  // workGroupOptions, // 工作组选项
  checkWorkGroupName, // 检查工作组id
  findWorkGroupById, // 工作组详情
  modifyWorkGroup, // 修改
  addWorkGroup, // 增加
  groupAdim, // 工作组负责人
  groupcf // 工作组技工
} from '@/api/mechanic/mechainc'
export default {
  data() {
    const checkPoblemTypes = async(rule, value, callback) => {
      if (this.paramsDatas) {
      // 修改
        try {
          const params = {
            id: this.paramsDatas.workTeamId
          }
          const r = await findWorkGroupById(params)
          this.id = r['data'].workTeamId // 返回主管id
          console.log(this.id)
        } catch (e) {
          console.log(e)
        }
        try {
          const params = {
            id: this.id,
            name: this.group.name
          }
          const r = await checkWorkGroupName(params)
          if (Object.is(r['data']['is_success'], true)) {
            callback()
          } else {
            callback(new Error('工作组已经存在'))
          }
        } catch (e) {
          callback(new Error('网络故障，请稍后重试'))
        }
      } else {
        // 新增
        try {
          const params = {
            name: this.group.name
          }
          const r = await checkWorkGroupName(params)
          if (Object.is(r['data']['is_success'], true)) {
            callback()
          } else {
            callback(new Error('工作组已经存在'))
          }
        } catch (e) {
          console.log(e)
        }
      }
    }
    return {
      isLoading: false,
      isBaseIndeterminate: false,
      baseRoleCheckAll: false,
      permissionList: [],
      option: {
        permissionList: []
      },
      group: {
        name: '',
        description: '',
        cfAssign: '',
        adminData: ''
      },
      data: [{ name: '是', value: 1 },
        { name: '否', value: 0 }],
      adminData: [],
      checkData: {
        name: [{ required: true, message: '请输入工作组名称', trigger: 'blur' },
          { validator: checkPoblemTypes, trigger: 'blur' }
        ],
        description: [{ required: true, message: '请输入工作组说明', trigger: 'blur' }],
        cfAssign: [{ required: true, message: '请选择是否自分配', trigger: 'blur' }]
        // adminData: [{ required: true, message: '请选择主管名称', trigger: 'blur' }]
      },
      olderData: {},
      id: '',
      name: '',
      cfId: '',
      workTeamId: '',
      Length: []
    }
  },
  async mounted() {
    this.paramsDatas = JSON.parse(window.sessionStorage.getItem('paramsData'))
    // console.log(this.paramsDatas)
    this.getData()
  },
  methods: {
    back() {
      if (this.paramsDatas) {
        // console.log(JSON.stringify(this.group))
        // console.log(JSON.stringify(this.olderData))
        if ((JSON.stringify(this.group) !== JSON.stringify(this.olderData)) ||
        ((this.Length.sort().toString() !== this.option.permissionList.sort().toString()))) {
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
        if (this.group.name !== '' || this.group.description !== '' ||
        this.group.cfAssign !== '' || this.group.adminData !== '') {
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
    async getData() {
      if (this.paramsDatas) {
        this.group.name = this.paramsDatas.name
        this.group.description = this.paramsDatas.description
        this.group.cfAssign = this.paramsDatas.cfAssign
        this.olderData.name = this.paramsDatas.name
        this.olderData.description = this.paramsDatas.description
        this.olderData.cfAssign = this.paramsDatas.cfAssign
        if (this.paramsDatas.users) { // 主管
          this.paramsDatas.users.map((item) => {
            if (item.isSup) {
              this.adminData.push(item.userName)
              this.group.adminData = item.cfId
              this.olderData.adminData = item.cfId
              this.cfId = item.cfId
            }
          })
        }
        // console.log(this.paramsDatas.users)
        this.workTeamId = this.paramsDatas.workTeamId
        // if (this.paramsDatas) {
        this.option.permissionList = this.paramsDatas.users.map(item => item.cfId)
        this.Length = this.option.permissionList
        this.setCheckAllState()
        // }
      }
      try {
        this.isLoading = true
        const r = await groupAdim()
        this.adminData = r['data']
        // this.permissionList = r['data']
        // if (this.paramsDatas) {
        //   this.option.permissionList = r['data'].map(item => item.userId)
        //   this.Length = this.option.permissionList
        //   this.setCheckAllState()
        // }
      } catch (e) {
        console.log(e)
      } finally {
        this.isLoading = false
      }
      try {
        this.isLoading = true
        const r = await groupcf()
        this.permissionList = r['data']
      } catch (e) {
        console.log(e)
      } finally {
        this.isLoading = false
      }
    },
    async save() {
      if (this.option.permissionList.length !== 0) {
        this.Professions = []
        this.option.permissionList.map((item) => {
          const temp = {}
          temp.cfId = item
          this.Professions.push(temp)
        })
        // console.log(this.Professions)
        const temp = []
        temp.push(this.group.adminData)
        // console.log(temp)
        // return
        if (this.paramsDatas) {
        // 修改
        // console.log(JSON.stringify(this.group))
        // console.log(JSON.stringify(this.olderData))
        // return
          if ((JSON.stringify(this.group) !== JSON.stringify(this.olderData)) ||
         (this.Length.sort().toString() !== this.option.permissionList.sort().toString())) {
            try {
              const cfAssign = (this.group.cfAssign === '是' ? '1' : '0')
              await this.$refs['checkData'].validate()
              this.isLoading = true
              const body = {
                name: this.group.name,
                id: this.id,
                description: this.group.description,
                cfAssign: cfAssign,
                sa: 0,
                supervises: temp,
                // users: [{
                //   cfId: this.cfId,
                //   isSup: 1
                // }]
                users: this.Professions,
                workTeamId: this.workTeamId
              }
              // console.log(body)
              // return
              await modifyWorkGroup(body)
              this.$message({
                message: '修改成功！',
                type: 'success'
              })
            } catch (e) {
              console.log(e)
            } finally {
              this.isLoading = false
              this.clear()
            }
          } else {
            this.$confirm('信息没有更改，请先更改再保存', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
            // this.$router.go(-1)
            }).catch((e) => {
              console.log(e)
            })
          }
        } else {
          try {
            const body = {
              name: this.group.name,
              description: this.group.description,
              cfAssign: this.group.cfAssign,
              supervises: temp,
              // users: [{
              //   cfId: this.cfId
              //   // isSup: 1
              // }]
              users: this.Professions
            }
            await addWorkGroup(body)
            this.$message({
              message: '创建成功！',
              type: 'success'
            })
          } catch (e) {
            console.log(e)
          } finally {
            this.isLoading = false
            this.clear()
          }
        }
      } else {
        this.$confirm('请先选定技工人员再提交', '提示', {
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
    clear() {
      this.group.name = ''
      this.group.description = ''
      this.group.cfAssign = ''
      this.group.adminData = ''
      this.adminData = []
      this.paramsDatas = null
      window.sessionStorage.removeItem('paramsData')
      this.baseRoleHandleCheckAllChange()
    },
    // 选框内容
    setCheckAllState() {
      const checkedCount = this.option.permissionList.length
      this.baseRoleCheckAll = checkedCount === this.permissionList.length
      this.isBaseIndeterminate = checkedCount > 0 && checkedCount < this.permissionList.length
    },
    // 基础权限 全选状态发生改变
    baseRoleHandleCheckAllChange(v) {
      this.option.permissionList = v ? this.permissionList.map(v => v.userId) : []
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
