<template style="height:100%">
  <el-container style="padding-left:30px;padding-top:15px">
    <el-main
      v-loading="isUpload"
      element-loading-text="数据提交中...">
      <el-row>
        <el-col :span="24"><el-button type="" @click="back">返回</el-button></el-col>
      </el-row>
      <el-row>
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
              <el-form-item>
                <el-button type="primary" @click="onSubmit">立即创建</el-button>
                <el-button @click="reset">重置</el-button>
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
import { getPermissionList as getPermissionListFunc, addRole } from '@/api/mis/ums/role'
export default {
  filters: {
  },
  data() {
    return {
      isUpload: false,
      permissionList: [],
      title: '创建账号',
      isBaseIndeterminate: false,
      baseRoleCheckAll: false,
      isOperationIndeterminate: false,
      operationRoleCheckAll: false,
      form: {
        roleName: '',
        comments: '',
        permissionList: []
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
  },
  async mounted() {
    this.getPermissionList()
  },
  methods: {
    reset() {
      this.form = {
        roleName: '',
        comments: '',
        permissionList: []
      }
      this.isBaseIndeterminate = false
      this.baseRoleCheckAll = false
      this.$refs['form'].resetFields()
    },
    back() {
      this.$router.go(-1)
    },
    async onSubmit() {
      this.isUpload = true
      try {
        await this.$refs['form'].validate()
        const data = {
          'roleName': this.form['roleName'],
          'description': this.form['comments'],
          'state': '0',
          'urls': this.form['permissionList']
        }
        await addRole(data)
        this.$message({
          message: '角色创建成功！',
          type: 'success'
        })
      } catch (e) {
        console.log(e)
      } finally {
        this.isUpload = false
      }
    },
    async getPermissionList() {
      try {
        const r = await getPermissionListFunc()
        this.permissionList = r['data']
      } catch (e) {
        console.log(e)
      } finally {
        console.log()
      }
    },
    // 操作权限 全选状态发生改变
    // operationRoleHandleCheckAllChange(v) {
    //   this.form['checkedOperationRole'] = v ? this.operationRoleArr : []
    //   this.isOperationIndeterminate = false
    // },
    // 基础权限 全选状态发生改变
    baseRoleHandleCheckAllChange(v) {
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
      this.baseRoleCheckAll = checkedCount === this.permissionList.length
      this.isBaseIndeterminate = checkedCount > 0 && checkedCount < this.permissionList.length
    }
  }
}
</script>

