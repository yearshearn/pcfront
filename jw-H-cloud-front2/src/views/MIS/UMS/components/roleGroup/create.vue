<template >
  <el-container v-loading="isLoading" style="padding:30px;">
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
      <el-form
        ref="form"
        :rules="formRules"
        :model="form"
        label-position="right"
        label-width="120px">
        <el-row :gutter="15">
          <el-col :span="8">
            <el-form-item label="角色组名称：" prop="groupName">
              <el-input v-model="form['groupName']" placeholder="请输入部门名称" clearable/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="父角色组名称：" >
              <el-cascader
                :options="roleTreeData"
                :props="{
                  checkStrictly: true ,
                  expandTrigger:'hover',
                  children: 'options',
                  label: 'groupName',
                  value:'groupId'}"
                v-model="roleGroupParentId"/>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- 第二行 -->
        <el-row>
          <el-form-item label="基本权限：">
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
                v-model="form['roleGroupList']"
                @change="baseRoleHandleCheckChange">
                <el-checkbox
                  v-for="(item, index) in roleGroupList"
                  :label="item['roleId']"
                  :key="index"
                >
                  {{ item['roleName'] }}
                </el-checkbox>
              </el-checkbox-group>
            </el-col>
          </el-form-item>
        </el-row>
        <!-- 第三行 -->
        <el-row :gutter="15">
          <el-col :span="24">
            <el-form-item label="备注：">
              <el-input
                :autosize="{
                  minRows:3
                }"
                v-model="form['description']"
                maxlength="250"
                show-word-limit
                type="textarea"
                placeholder="请输入备注"
                resize="none"
                clearable/>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <el-row >
        <el-col :span="6" :offset="9" align="center">
          <el-button
            type="primary"
            @click.native.prevent="submits">
            {{ isLoading ? '提交中' : '提 交' }}
          </el-button>
          <el-button
            type=""
            @click="reset">
            重置
          </el-button>
        </el-col>
      </el-row>
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
import { mapGetters } from 'vuex'
import {
  getRoleGroupTreeList,
  getRoleList,
  createRoleGroup
} from '@/api/mis/ums/roleGroup'
export default {
  data() {
    return {
      treeProp: {

      },
      roleGroupParentId: [],
      roleTreeData: [],
      isLoading: false,
      isBaseIndeterminate: false,
      roleGroupList: [],
      baseRoleCheckAll: false,
      form: {
        groupName: '',
        roleGroupList: [],
        description: '',
        roleGroupParentName: []
      },
      formRules: {
        groupName: [
          { required: true, message: '请输入角色组名称' }
        ]
      }
    }
  },
  computed: {
    ...mapGetters([
      'userId'
    ])
  },
  watch: {
    roleGroupParentId(v) {
      // console.log(v)
    }
  },
  created() {
  },
  mounted() {
    // console.log(this.$route.params.fullPathId)
    this.getTreeList()
    this.getRoleListFunc()
  },

  methods: {
    async reset() {
      this.form = {
        groupName: '',
        roleGroupList: [],
        description: '',
        roleGroupParentName: []
      }
      this.roleGroupParentId = []
      this.baseRoleCheckAll = false
      this.isBaseIndeterminate = false
      this.$refs['form'].resetFields()
    },
    async getRoleListFunc() {
      const params = {
        pageSize: 9999
      }
      const r = await getRoleList(params)
      this.roleGroupList = r['data']
    },
    async getTreeList() {
      // return
      const r = await getRoleGroupTreeList()
      this.roleTreeData = r['data']
      this.roleTreeData.unshift({
        groupName: '顶级',
        groupId: ''
      })
      if (this.$route.params.fullPathId) {
        this.roleGroupParentId = this.$route.params.fullPathId
      }
    },
    /**
    groupName,
    description(可为空),
    state,parentGroupIdcreateRoleGroup(可为空),
    roles(角色id数组,可为空)
     */
    async submits() {
      try {
        this.isLoading = true
        await this.$refs['form'].validate()
        const body = {
          groupName: this.form['groupName'],
          description: this.form['description'],
          state: 1,
          parentGroupId: this.roleGroupParentId.length > 0 ? this.roleGroupParentId[this.roleGroupParentId.length - 1] : '',
          roles: this.form['roleGroupList'],
          fcu: this.userId
        }
        await createRoleGroup(body)
        this.$message({
          message: '角色组创建成功！',
          type: 'success'
        })
        // console.log(r['data'])
      } catch (e) {
        console.log(e)
      } finally {
        // this.$refs.upload.submit()
        this.isLoading = false
      }
    },
    back() {
      this.$router.go(-1)
    },
    baseRoleHandleCheckAllChange(v) {
      if (v) {
        console.log(this.roleGroupList.map(v => v['roleId']))
      }
      this.form['roleGroupList'] = v ? this.roleGroupList.map(v => v['roleId']) : []
      this.isBaseIndeterminate = false
    },
    baseRoleHandleCheckChange(v) {
      const checkedCount = v.length
      console.log(checkedCount, this.roleGroupList.length)
      this.baseRoleCheckAll = checkedCount === this.roleGroupList.length
      this.isBaseIndeterminate = checkedCount > 0 && checkedCount < this.roleGroupList.length
    }
  }

}
</script>
