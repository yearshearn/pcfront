<template style="height:100%">
  <el-container style="padding-left:30px;padding-top:15px">
    <el-main
      v-loading="isUpload"
      element-loading-text="数据提交中..."
    >
      <el-row>
        <el-col :span="24"><el-button @click="back">返回</el-button></el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-card style="margin-top:15px;padding-top:15px">
            <el-form
              ref="ruleForm"
              :model="form"
              :rules="formRules"
              style="min-height:600px"
              label-position="right"
              label-width="120px">
              <el-row>
                <el-col :span="8">
                  <el-form-item label="用户名：" prop="userName">
                    <el-input v-model="form.userName" style="max-width:85%"/>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="密码：" prop="userPwd">
                    <el-input v-model="form.userPwd" type="password" style="max-width:85%"/>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="8">
                  <el-form-item label="姓名：" prop="realName">
                    <el-input v-model="form.realName" style="max-width:85%"/>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="联系电话：" prop="phone">
                    <el-input
                      v-model="form.phone"
                      style="max-width:85%"/>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="8">
                  <el-form-item label="性别：" prop="gender">
                    <el-radio v-model="form.gender" :label="0" border>男</el-radio>
                    <el-radio v-model="form.gender" :label="1" border>女</el-radio>
                  </el-form-item>
                </el-col>
                <el-col :span="16">
                  <el-form-item
                    style="display:inline-block;max-width:100%"
                    label="是否为技工："
                    prop="roles">
                    <el-switch
                      v-model="form.isCf"
                      :active-value="1"
                      :inactive-value="0"
                      active-text="是"
                      inactive-text="否"
                      @change="isCfChanged"/>
                  </el-form-item>
                  <el-form-item
                    style="display:inline-block;width:30%"
                    label-width="30px"
                    prop="roles">
                    <el-select
                      v-if="form.isCf === 1"
                      v-model="form.professions"
                      style="width:80%"
                      clearable
                      filterable
                      multiple
                      placeholder="请选择">
                      <el-option
                        v-for="item in cfProfessionses"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id"/>
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="8">
                  <el-form-item label="所属部门：" prop="depts">
                    <Dept
                      :dept-data="form['depts']"
                      :clear-form-validate-by-prop="clearFormValidateByProp"
                      :update-dept="updateDept"/>
                    <el-checkbox-group
                      v-if="false"
                      v-model="form['depts']"/>
                    <el-card
                      v-if="exhibitionDeptData.length > 0"
                      id="customCard"
                      shadow="never"
                      class="box-card"
                      style="margin-top:5px;width:85%;font-size:12px;min-width:75px">
                      <div
                        v-for="(item,index) in exhibitionDeptData"
                        :key="index"
                      >
                        <el-divider v-if="index!==0"/>
                        <el-tooltip
                          :content="item['b'] + item['span']"
                          class="item"
                          effect="dark"
                          placement="top">
                          <div
                            style="overflow: hidden; text-overflow:ellipsis; white-space: nowrap;">
                            <span>
                              <i class="el-icon-check"/>&nbsp;
                              {{ item['b'] + item['span'] }}
                            </span>
                          </div>
                        </el-tooltip>
                      </div>
                    </el-card>
                  </el-form-item>
                </el-col>
                <el-col :span="8" >
                  <el-form-item v-loading="getRoleListHandlerFlag" label="角色组：" prop="roles">
                    <el-cascader
                      :options="options['group']"
                      v-model="form['roles']"
                      :props="{
                        multiple: true,
                        value:'groupId',
                        label:'groupName',
                        children:'options'
                      }"
                      style="width:85%"
                      collapse-tags
                      clearable/>
                    <!--<RoleGroup
                      :default-active="form['roles']"
                      :clear-form-validate-by-prop="clearFormValidateByProp"
                      :update-role-group="updateRoleGroup"/>
                    <el-checkbox-group
                      v-if="false"
                      v-model="form['roles']"/>-->
                    <el-card
                      v-if="form['roles'].length > 0"
                      id="customCard"
                      shadow="never"
                      class="box-card"
                      style="margin-top:5px;width:85%;font-size:12px;min-width:75px">
                      <div v-for="(item, index) in exhibitionGroupData" :key="index">
                        <el-divider v-if="index!==0"/>
                        <el-tooltip
                          :content="item"
                          class="item"
                          effect="dark"
                          placement="top">
                          <div
                            style="overflow: hidden; text-overflow:ellipsis; white-space: nowrap;">
                            <i class="el-icon-check"/>&nbsp;
                            {{ item }}
                          </div>
                        </el-tooltip>
                      </div>
                    </el-card>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="24">
                  <el-form-item>
                    <el-button type="primary" @click="onSubmit">立即创建</el-button>
                    <el-button @click="reset">重置</el-button>
                  </el-form-item>
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

import { addAccount, getRoleList } from '@/api/mis/ums/account'
import { getCfTypeList } from '@/api/enumeration'
import { Dept, RoleGroup, Phones } from './dialog'
import { phoneReg } from '@/utils/validate/reg'
import { departOptions } from '@/api/mis/dms/dmsList'
import { getRoleGroupTreeList as roleGroupTreeList } from '@/api/mis/ums/roleGroup'
import { expandArrayByTreeData } from '@/utils'
export default {
  components: {
    Dept,
    RoleGroup,
    Phones
  },
  filters: {
  },
  data() {
    return {
      cfProfessionses: [],
      map: {
        depart: {},
        group: {}
      },
      options: {
        group: []
      },
      formRules: {
        userName: [
          { required: true, message: '请输入用户名' }
          // { required: true, type: 'array', trigger: 'blur', message: '测试' }
        ],
        realName: [
          { required: true, message: '请输入真实姓名' }
        ],
        userPwd: [
          { required: false, message: '请输入密码' }
        ],
        phone: [
          { required: true, message: '请输入手机号' },
          { message: '请输入正确的手机号', pattern: phoneReg }
        ],
        depts: [
          { required: false, message: '请选择所属部门' }
        ],
        roles: [
          { required: false, message: '请选择角色组' }
        ],
        gender: [
          { required: true, message: '请选择性别' }
        ]
      },
      isUpload: false,
      props: {
        value: 'id',
        children: 'cities',
        label: 'label'
      },
      title: '创建账号',
      roleList: [],
      getRoleListHandlerFlag: true,
      // phones: '',
      form: {
        userName: '',
        realName: '',
        gender: 0,
        userPwd: '',
        isCf: 0,
        professions: '',
        // phones: [''],
        phone: '',
        depts: [],
        // roles: ['']
        roles: []
      }
    }
  },
  computed: {
    exhibitionGroupData() {
      const arr = []
      for (const item of this.form['roles']) {
        if (item.length === 0) {
          arr.push('（空）')
        } else {
          arr.push(item.map(i => {
            return this.map['group'][i] ? this.map['group'][i] : '（空）'
          }).join(' - '))
        }
      }
      return arr
    },
    exhibitionDeptData() {
      const arr = []
      for (const item of this.form['depts']) {
        const strObj = {
          b: '',
          span: ' - '
        }
        if (item['dept'].length === 0) {
          strObj['b'] = '（空）'
        } else {
          strObj['b'] += item['dept'].map(i => {
            const str = this.map['depart'][i] ? this.map['depart'][i] : '（空）'
            // console.log(str)
            return str
          }).join(' - ')
        }
        strObj['span'] += item['job'] ? ' ' + item['job'] : '（空）'
        arr.push(strObj)
      }
      return arr
    }
  },
  watch: {
  },
  created() {
  },
  async mounted() {
    this.getRoleListHandler()
    this.getCfTypeList()
    this.getDepartOptions()
    this.getRoleGroupTreeList()
  },
  methods: {
    async getRoleGroupTreeList() {
      try {
        const r = await roleGroupTreeList()
        this.options['group'] = r.data
        const map = {}
        for (const item of expandArrayByTreeData(r.data, 'options')) {
          map[item['groupId']] = item['groupName']
        }
        this.map.group = map
        console.log(map)
      } catch (e) {
        console.log(e)
      }
    },
    async getDepartOptions() {
      try {
        const r = await departOptions()
        // console.log(r)
        // console.log('------------')
        const map = {}
        for (const item of expandArrayByTreeData(r.data, 'options')) {
          map[item['deptId']] = item['deptName']
        }
        this.map.depart = map
      } catch (e) {
        console.log(e)
      }
    },
    async isCfChanged() {
      if (this.form['isCf'] === 1) {
        try {
          await this.$confirm(`一经指派为技工后，保存后不可更改！`, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          })
        } catch (e) {
          this.form['isCf'] = 0
        }
      }
    },
    async reset() {
      this.form = {
        userName: '',
        realName: '',
        gender: 0,
        userPwd: '',
        isCf: 0,
        professions: '',
        // phones: [''],
        phone: '',
        depts: [],
        // roles: ['']
        roles: []
      }
      this.$refs['ruleForm'].resetFields()
    },
    async getCfTypeList() {
      try {
        const r = await getCfTypeList()
        this.cfProfessionses = r['data']
      } catch (e) {
        console.log(e)
      }
    },
    clearFormValidateByProp(prop) {
      this.$refs['ruleForm'].clearValidate(prop)
    },
    updateRoleGroup(v) {
      // this.clearFormValidateByProp('roles')
      this.form['roles'] = v
    },
    updateDept(v) {
      // console.log(v)
      // this.clearFormValidateByProp('depts')
      this.form['depts'] = v
    },
    transferHandleChange(v) {
      console.log(v)
    },
    handleItemChange(v) {
      console.log(v)
    },
    back() {
      this.$router.go(-1)
    },
    async getRoleListHandler() {
      this.getRoleListHandlerFlag = true
      try {
        const params = {
          // pageSize: 9999
        }
        const r = await getRoleList(params)
        this.roleList = r['data']['list']
      } catch (e) {
        console.log(e)
      } finally {
        this.getRoleListHandlerFlag = false
      }
    },
    async onSubmit() {
      this.isUpload = true
      try {
        await this.$refs['ruleForm'].validate()
        const data = {
          userName: this.form['userName'],
          realName: this.form['realName'],
          userPwd: this.form['userPwd'],
          gender: this.form['gender'],
          state: 1,
          isCf: this.form['isCf'],
          depts: this.form['depts'].length === 0 ? [] : JSON.parse(JSON.stringify(this.form['depts'])).map(i => {
            return { deptId: i['dept'].pop(), job: i['job'] }
          }),
          roleGroups: JSON.parse(JSON.stringify(this.form['roles'])).map(i => i.pop()),
          phone: this.form['phone']
        }
        if (data.isCf === 1) {
          data['professions'] = this.form['professions'].map(i => {
            return {
              'professionId': i,
              'state': 1
            }
          })
        }
        // console.log(data)
        // return
        const r = await addAccount(data)
        this.$message({
          message: '用户创建成功！',
          type: 'success'
        })
        this.reset()
        console.log(r)
      } catch (e) {
        console.log(e)
      } finally {
        this.isUpload = false
      }
    }
  }
}
</script>

<style>
 #customCard .el-card__body{
   padding:5px 10px
 }
  .el-divider {
   margin:0
 }
</style>

