<template style="height:100%">
  <div>
    <el-button type="primary" @click="showDeptDialog">请选择</el-button>
    <el-dialog
      :visible="deptDialogFalg"
      :before-close="closeDeptDialog"
      title="选择部门"
      width="60%"
      center>
      <el-row>
        <el-col :span="2" :offset="22">
          <el-button
            style="margin-bottom:10px"
            type="primary"
            @click="addDept">添加</el-button>
        </el-col>

      </el-row>
      <el-row>
        <el-col :span="24">
          <el-table :data="deptTableData" border stripe>
            <el-table-column
              align="center"
              label="所属部门">
              <template slot-scope="{row}">
                <el-cascader
                  :options="treeData"
                  :props="{
                    children: 'options',
                    label: 'deptName',
                    value:'deptId'}"
                  v-model="row['dept']"
                  style="width:90%"/>
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              label="职位">
              <template slot-scope="{row}">
                <el-input v-if="row['dept'].length !== 0 && row['dept'][0] !== ''" v-model="row['job']"/>
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              width="200"
              label="操作">
              <template slot-scope="scope">
                <el-button type="danger" size="mini" @click="deleteDept(scope.$index)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeDeptDialog">取 消</el-button>
        <el-button :disabled="isUpload" type="primary" @click="updateDeptHandler">确 定</el-button>
      </span>

    </el-dialog>
  </div>
</template>

<script>
import { departOptions } from '@/api/mis/dms/dmsList'

export default {
  filters: {

  },
  props: {
    deptData: {
      type: Array,
      default: null
    },
    clearFormValidateByProp: {
      type: Function,
      default: null
    },
    updateDept: {
      type: Function,
      default: null
    }
  },
  data() {
    return {
      deptTableData: [],
      isUpload: false,
      deptDialogFalg: false,
      treeData: []
    }
  },
  computed: {
  },
  watch: {
    deptDialogFalg(v) {
      if (v) {
        this.deptTableData = JSON.parse(JSON.stringify(this.deptData))
        // console.log(this.deptTableData)
        // this.getTreeData()
        this.clearFormValidateByProp('depts')
      }
    },
    deptData: {
      deep: true,
      handler(v, o) {
        this.deptTableData = JSON.parse(JSON.stringify(this.deptData))
      }
    }
  },
  created() {
  },
  async mounted() {
    this.getTreeData()
    // console.log(this.$route.params)
  },
  methods: {
    async getTreeData() {
      try {
        this.treeData = []
        const r = await departOptions()
        this.treeData = r['data']
      } catch (e) {
        console.log(e)
      }
    },
    addDept() {
      this.deptTableData.push({
        dept: [],
        job: ''
      })
    },
    async closeDeptDialog() {
      this.deptDialogFalg = false
      this.isUpload = false
    },
    async showDeptDialog() {
      this.deptDialogFalg = true
    },
    deleteDept(i) {
      this.deptTableData.splice(i, 1)
    },
    async updateDeptHandler() {
      this.isUpload = true
      try {
        // console.log(this.deptTableData)
        await this.updateDept(this.deptTableData)
        this.closeDeptDialog()
      } catch (e) {
        console.log(e)
      } finally {
        this.isUpload = false
      }
    }
  }
}
</script>

