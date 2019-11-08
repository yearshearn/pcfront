<template >
  <el-container style="padding:30px;">
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
      <el-form ref="departval" :rules="departval" :model="dpobj" label-position="left" label-width="100px">
        <el-row :gutter="15">
          <el-col :span="8">
            <el-form-item label="部门名称：">
              <el-input v-model="dpobj['Dpsuperior']" placeholder="请输入部门名称" clearable/>
            </el-form-item>
          </el-col>
          <el-col :offset="1" :span="6">
            <el-form-item label="父级部门：" prop="Dpname" >
              <div class="block">
                <el-cascader
                  v-model="dpobj.Dpname"
                  :options="option"
                  :props="{
                    checkStrictly: true ,
                    expandTrigger:'hover',
                    children: 'options',
                    label: 'deptName',
                    value:'deptId'
                  }"
                />
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="部门编码：" prop="Dpid">
              <el-input v-model.number="dpobj['Dpid']" placeholder="请输入部门编码" clearable/>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- 第二行 -->
        <el-row :gutter="15">
          <el-col :span="8">
            <el-form-item label="部门简称：" prop="DpAbbreviation">
              <el-input v-model="dpobj['DpAbbreviation']" placeholder="请输入部门简称" clearable/>
            </el-form-item>
          </el-col>
          <el-col :offset="1" :span="6">
            <el-form-item label="负责人：" prop="Dpperson">
              <!-- <el-input v-model="submit['Dpperson']" placeholder="请输入负责人名称" clearable/>
               -->
              <el-select v-model="dpobj['Dpperson']" placeholder="请选择">
                <el-option
                  v-for="item in admin"
                  :key="item.userName"
                  :label="item.userName"
                  :value="item.userName+'|'+item.userId"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="联系电话：" prop="Dpphone">
              <el-input v-model="dpobj['Dpphone']" placeholder="请输入联系电话" clearable/>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- 第三行 -->
        <el-row :gutter="15">
          <el-col :span="24">
            <el-form-item label="备注：" prop="Dpremarks">
              <el-input v-model="dpobj['Dpremarks']" type="textarea" placeholder="请输入备注" clearable/>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <el-row >
        <el-col :span="6" :offset="9" align="center">
          <el-button
            v-loading="isLoading"
            type="primary"
            @click.native.prevent="submits">
            {{ isLoading ? '提交中' : '提 交' }}
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
import {
  getdepartment,
  creaddepat,
  getdepartlist
} from '@/api/mis/dms/createddepartment'

import { phoneReg } from '@/utils/validate/reg'

export default {
  data() {
    return {
      isLoading: false,
      dpobj: {
        Dpname: [],
        Dpid: '',
        Dpsuperior: '', // 上级
        DpAbbreviation: '', // 简称
        Dpperson: '', // 负责人
        Dpphone: '',
        Dpremarks: ''// 备注
      },
      question: {
        questionDialog: false
      },
      usersobj: [],
      option: [], // 列表
      // defaultParams: {
      //   label: 'deptName',
      //   value: 'deptId',
      //   children: 'options'
      // },
      admin: [], // 部门负责人
      departval: {
        Dpname: [
          { required: true, message: '请输入部门名称' }
        ],
        DpAbbreviation: [
          { required: true, message: '请输入部门简称' }
        ], // 简称
        Dpperson: [
          { required: true, message: '请输入部门负责人' }
        ], // 负责人
        Dpphone: [
          { required: true, message: '请输入部门号码' },
          { message: '请输入正确的手机号', pattern: phoneReg }
        ],
        // 编码
        Dpid: [{
          required: true, message: '请输入部门编码'
        }]
      }
    }
  },
  created() {

  },
  async mounted() {
    this.getdepartadm()
    this.getdepart()
  },
  methods: {
    // 部门列表
    async getdepart() {
      if (this.$route.params.fullPathId) {
        this.dpobj.Dpname = this.$route.params.fullPathId
      }
      try {
        const r = await getdepartlist()
        this.option = r['data']
        this.option.unshift({
          deptName: '顶级',
          deptId: ''
        })
      } catch (e) {
        console.log(e)
      }
      // console.log(this.option)
    },
    // 部门负责人选项
    async getdepartadm() {
      // console.log(1111111111)
      // console.log(this.$route.params.fullPathId)
      try {
        const r = await getdepartment()
        this.admin = r['data']
      } catch (e) {
        console.log(e)
      }
    },
    // 提交
    async submits() {
      // console.log(this.dpobj['Dpperson'])
      var Phones = [{}]
      this.usersobj = [{}]
      Phones[0].phone = this.dpobj['Dpphone']
      try {
        await this.$refs['departval'].validate()
        this.isLoading = true
        await this.$refs['departval'].validate()
        this.usersobj[0].userId = this.dpobj['Dpperson'].split('|')[1]
        var body = {
          deptName: this.dpobj['Dpsuperior'],
          code: this.dpobj['Dpid'],
          state: 0,
          abbre: this.dpobj['DpAbbreviation'],
          deptPhones: Phones,
          users: this.usersobj,
          parentDeptId: this.dpobj.Dpname.length > 0 ? this.dpobj.Dpname[this.dpobj.Dpname.length - 1] : ''
        }
        await creaddepat(body)
        this.$message({
          message: '部门创建成功！',
          type: 'success'
        })
      } catch (e) {
        console.log(e)
      } finally {
        // this.$refs.upload.submit()
        this.isLoading = false
      }
    },
    back() {
      this.$router.go(-1)
    }
  }

}
</script>
