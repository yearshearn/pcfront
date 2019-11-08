<template style="height:100%">
  <el-container style="padding-left:30px;padding-top:15px">
    <el-main>
      <el-row>
        <el-col :span="24"><el-button type="" @click="back">返回</el-button></el-col>
      </el-row>
      <el-row v-loading="isLoading">
        <el-col :span="24">
          <el-card style="margin-top:15px;padding-top:15px">
            <el-form
              ref="form"
              :rules="formRules"
              :model="form"
              style="min-height:600px"
              label-position="left"
              label-width="120px">
              <el-form-item label="角色名称：" prop="roleName">
                <el-input v-model="form.roleName" style="max-width:350px"/>
              </el-form-item>
              <el-form-item label="角色简介：">
                <el-input
                  v-model="form.comments"
                  :autosize="{
                    minRows:3
                  }"
                  maxlength="250"
                  show-word-limit
                  resize="none"
                  type="textarea"
                  style="max-width:650px"/>
              </el-form-item>
              <el-form-item label="基本权限：">
                <el-row>
                  <el-col :span="2">
                    <el-checkbox
                      :indeterminate="isBaseIndeterminate"
                      v-model="baseRoleCheckAll"
                      @change="baseRoleHandleCheckAllChange">
                      全选
                    </el-checkbox>
                  </el-col>
                  <el-col :span="16">
                    <el-checkbox-group
                      v-model="form.permissionList"
                      @change="baseRoleHandleCheckChange">
                      <el-checkbox
                        v-for="(item, index) in permissionList"
                        :label="item['urlId']"
                        :key="index"
                      >
                        {{ item['urlName'] }}
                      </el-checkbox>
                    </el-checkbox-group>
                  </el-col>
                </el-row>
              </el-form-item>
              <el-form-item label="状态：">
                <el-switch
                  v-model="form.state"
                  :active-value="1"
                  :inactive-value="0"
                  active-text="启用"
                  inactive-text="禁用"/>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="onSubmit">保存</el-button>
                <el-button @click="getDetails">重置</el-button>
              </el-form-item>
            </el-form>
          </el-card>
        </el-col>
      </el-row>
    </el-main>
  </el-container>

</template>

<script>
// import { permissionList, operationRoleArr } from '@/utils/enumerationList/ums'
import {
  getPermissionList as getPermissionListFunc,
  getRoleDetails,
  updateRole } from '@/api/mis/ums/role'
export default {
  filters: {
  },
  data() {
    return {
      // isEdited: false,
      isLoading: true,
      permissionList: [],
      roleId: '',
      title: '创建账号',
      isBaseIndeterminate: false,
      baseRoleCheckAll: false,
      isOperationIndeterminate: false,
      operationRoleCheckAll: false,
      form: {
        roleName: '',
        comments: '',
        permissionList: [],
        state: 0
      },
      formRules: {
        roleName: [
          { required: true, message: '请输入角色名' }
        ]
      }
    }
  },
  watch: {
  },
  created() {
    this.roleId = this.$route.params['roleId']
    this.getDetails()
  },
  async mounted() {
    this.getPermissionList()
  },
  methods: {
    back() {
      this.$router.go(-1)
    },
    async getDetails() {
      this.isLoading = true
      try {
        // 如果没有修改
        const params = {
          roleId: this.roleId
        }
        const r = await getRoleDetails(params)
        // roleName: '',
        // comments: '',
        // permissionList: [],
        // state: 0
        const data = r['data']
        this.form['roleName'] = data['role']['roleName']
        this.form['comments'] = data['role']['description']
        this.form['permissionList'] = data['urls'].map(item => item['urlId'])
        this.form['state'] = data['role']['state']
        this.setCheckAllState()
        // this.isEdited = false
      } catch (e) {
        console.log(e)
      } finally {
        this.isLoading = false
      }
    },
    setCheckAllState() {
      const checkedCount = this.form['permissionList'].length
      this.baseRoleCheckAll = checkedCount === this.permissionList.length
      this.isBaseIndeterminate = checkedCount > 0 && checkedCount < this.permissionList.length
    },
    async onSubmit() {
      this.isLoading = true
      try {
        await this.$refs['form'].validate()
        const data = {
          roleId: this.roleId,
          roleName: this.form['roleName'],
          description: this.form['comments'],
          state: this.form['state'],
          urls: this.form['permissionList']
        }
        // return console.log(data)
        await updateRole(data)
        this.$message({
          message: '修改成功！',
          type: 'success'
        })
      } catch (e) {
        console.log(e)
      } finally {
        this.isLoading = false
      }
    },
    async getPermissionList() {
      try {
        const r = await getPermissionListFunc()
        this.permissionList = r['data']
      } catch (e) {
        console.log(e)
      } finally {
        this.setCheckAllState()
      }
    },
    // 操作权限 全选状态发生改变
    // operationRoleHandleCheckAllChange(v) {
    //   this.form['checkedOperationRole'] = v ? this.operationRoleArr : []
    //   this.isOperationIndeterminate = false
    // },
    // 基础权限 全选状态发生改变
    baseRoleHandleCheckAllChange(v) {
      if (v) {
        console.log(this.permissionList.map(v => v['urlId']))
      }
      this.form['permissionList'] = v ? this.permissionList.map(v => v['urlId']) : []
      this.isBaseIndeterminate = false

      // this.baseRoleCheckAll = true
    },
    // 操作权限 多选框状态发生改变
    // operationRoleHandleCheckChange(v) {
    //   const checkedCount = v.length
    //   this.operationRoleCheckAll = checkedCount === this.operationRoleArr.length
    //   this.isOperationIndeterminate = checkedCount > 0 && checkedCount < this.operationRoleArr.length
    // },
    // 基础权限 多选框状态发生改变
    baseRoleHandleCheckChange(v) {
      const checkedCount = v.length
      console.log(checkedCount, this.permissionList.length)
      this.baseRoleCheckAll = checkedCount === this.permissionList.length
      this.isBaseIndeterminate = checkedCount > 0 && checkedCount < this.permissionList.length
    }
  }
}
</script>

