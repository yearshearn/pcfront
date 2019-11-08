<template >
  <el-container v-loading="detail['isLoading']">
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
              ref="departmentRule"
              :rules="departmentRule"
              :model="form"
              style="min-height:600px"
              label-position="right"
              label-width="100px"
            >
              <el-row :gutter="15">
                <el-col :span="6">
                  <el-form-item label="创建人：">
                    <el-input v-model="form['fcu']" readonly disabled />
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="创建时间：">
                    <el-input v-model="form['fcd']" readonly disabled />
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="更新人：">
                    <el-input v-model="form['lcu']" readonly disabled />
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="更新时间：">
                    <el-input v-model="form['lcd']" readonly disabled />
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="15">
                <el-col :span="6">
                  <el-form-item label="部门名称：" prop="deptName">
                    <el-input v-model="form['deptName']" clearable />
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="部门简称：" prop="abbre">
                    <el-input v-model="form['abbre']" clearable />
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="父级部门：">
                    <el-cascader
                      :options="form['partData']"
                      :props="{
                        checkStrictly: true ,
                        expandTrigger:'hover',
                        children: 'options',
                        label: 'deptName',
                        value:'deptId'
                      }"
                      v-model="form['parentDeptId']"
                      clearable
                      style="width:90%"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="部门等级：">
                    <el-input v-model="form['level']" readonly disabled />
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="15" style="margin:15px 0">
                <el-col :span="12">
                  <el-button type="primary" @click.native.prevent="newlyAdded">新增部门电话</el-button>
                </el-col>
                <el-col :span="6">
                  <el-button type="primary" @click.native.prevent="AddAdmin(detail['admin'])">新增管理员</el-button>
                </el-col>
                <el-col :span="6">
                  <el-select v-model="detail['admin']" placeholder="请选择管理员名称" filterable clearable>
                    <el-option
                      v-for="item in detail['administrators']"
                      :key="item.userName"
                      :label="item.userName"
                      :value="item.userName + '|' + item.userId"
                    />
                  </el-select>
                </el-col>
              </el-row>
              <el-row :gutter="15">
                <el-col :span="12">
                  <el-form-item
                    label="部门电话:">
                    <el-table
                      v-loading="detail['formLoading']"
                      :data="form['deptPhones']"
                      border
                      empty-text="请新增部门电话"
                      element-loading-text="获取列表中">
                      <el-table-column width="80" align="center" type="index" label="编码" />
                      <el-table-column align="center" prop="description" label="描述">
                        <template slot-scope="{row}">
                          <el-input v-model="row['description']" clearable />
                        </template>
                      </el-table-column>
                      <el-table-column
                        align="center"
                        label="电话">
                        <el-form-item
                          slot-scope="scope"
                          :rules="[
                            { required: true, message: '请输入主要手机号'},
                            { pattern: phoneReg , message: '请输入正确的手机号'}
                          ]"
                          :prop="'deptPhones.'+ scope.$index + '.phone'">
                          <el-input v-model="scope.row['phone']" clearable/>
                        </el-form-item>
                      </el-table-column>
                      <el-table-column align="center" label="操作">
                        <template slot-scope="scope">
                          <el-button
                            circle
                            type="danger"
                            icon="el-icon-delete"
                            @click.native.prevent="deleteRow(scope.$index, form['deptPhones'])"
                          />
                        </template>
                      </el-table-column>
                    </el-table>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="管理员:">
                    <el-table
                      v-loading="detail['formLoading']"
                      :data="form['users']"
                      border
                      empty-text="请新增部门管理员"
                      element-loading-text="获取列表中">
                      <el-table-column width="80" align="center" type="index" label="编码" />
                      <el-table-column align="center" prop="userName" label="名称" />
                      <el-table-column align="center" label="操作">
                        <template slot-scope="scope">
                          <el-button
                            circle
                            type="danger"
                            icon="el-icon-delete"
                            @click.native.prevent="deleteRow(scope.$index, form['users'])"
                          />
                        </template>
                      </el-table-column>
                    </el-table>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="6" :offset="9" align="center" class="save">
                  <el-button
                    type="primary"
                    @click.native.prevent="submit"
                  >{{ detail['submitLoading'] ? '提交中' : '提 交' }}</el-button>
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
import {
  getDepartList,
  getDepartDetails,
  departOptions,
  checkDept,
  changeDept
} from '@/api/mis/dms/dmsList'

import { getdepartment } from '@/api/mis/dms/createddepartment'

import { phoneReg } from '@/utils/validate/reg'

export default {
  data() {
    // 判断部门名称是否存在
    const getCheckDept = async(rule, value, callback) => {
      try {
        const params = {
          deptId: this.$route.params.deptId,
          deptName: this.form['deptName']
        }
        const r = await checkDept(params)
        if (Object.is(r['data']['is_success'], true)) {
          callback()
        } else {
          callback(new Error('部门名称已存在'))
        }
      } catch (e) {
        callback(new Error('网络故障，请稍后重试'))
      }
    }
    return {
      phoneReg,
      detail: {
        isLoading: false,
        submitLoading: false,
        formLoading: false,
        admin: '',
        administrators: []
      },
      // 表单
      form: {},
      // 电话号码判断
      departmentRule: {
        // 部门名称
        deptName: [
          { required: true, message: '请输入部门名称', trigger: 'change' },
          { validator: getCheckDept, trigger: 'blur' }
        ],
        // 部门简称
        abbre: [
          { required: true, message: '请输入部门简称', trigger: 'change' }
        ]
      }
    }
  },
  created() {},
  async mounted() {
    this.getDetails(this.$route.params.deptId)
    this.departTree()
    this.getDepartAdm()
  },
  methods: {
    // 获取详情
    async getDetails(deptId) {
      this.form['deptId'] = deptId
      this.detail['isLoading'] = true
      try {
        const params = {
          deptId: deptId
        }
        const r = await getDepartDetails(params)
        this.form = r['data']
      } catch (e) {
        console.log(e)
      } finally {
        this.detail['isLoading'] = false
      }
    },
    // 父级部门
    async departTree() {
      const r = await departOptions()
      this.form['partData'] = r['data']
      if (this.$route.params.deptId) {
        this.form['parentId'] = this.$route.params.deptId
      }
    },
    // 部门管理员列表
    async getDepartAdm() {
      try {
        const r = await getdepartment()
        this.detail['administrators'] = r['data']
      } catch (e) {
        console.log(e)
      }
    },
    // 新增管理员
    AddAdmin(v) {
      if (this.detail['admin']) {
        this.detail['admin'] = ''
        this.form['users'].push({
          deptId: null,
          userId: v.split('|')[1],
          userName: v.split('|')[0]
        })
        return
      }
      this.$message({
        message: '请选择管理员名称！',
        type: 'error'
      })
    },
    // 管理员异步搜索
    async querySearchAsync(queryString, cb) {
      // console.log(queryString, cb)
      try {
        const params = {
          pageSize: 9999,
          userName: this.form['user']
        }
        await getDepartList(params)
        // console.log(r['data'])
      } catch (e) {
        console.log(e)
      }
    },
    // 新增部门电话
    newlyAdded() {
      this.form['deptPhones'].push({
        description: '',
        phone: ''
      })
    },
    // 删除内容
    deleteRow(index, rows) {
      rows.splice(index, 1)
    },
    // 提交
    async submit() {
      this.detail['submitLoading'] = true
      try {
        const departmentFlag = await this.$refs['departmentRule'].validate()
        if (departmentFlag) {
          await changeDept(this.form)
          this.$message({
            message: '修改成功！',
            type: 'success'
          })
        }
        // console.log(r['data'])
      } catch (e) {
        console.log(e)
      } finally {
        this.detail['submitLoading'] = false
      }
    }
  }
}
</script>

<style scoped>
  .el-container {
    padding: 30px;
  }

  .el-input {
    width: 90%;
  }

  .el-card {
    padding-top: 15px;
  }

  .save{
    margin-top: 10%;
  }
</style>
