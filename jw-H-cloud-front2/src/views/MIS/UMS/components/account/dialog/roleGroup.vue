<template style="height:100%">
  <div>
    <el-button type="primary" @click="showDeptDialog">请选择</el-button>
    <el-dialog
      :visible="deptDialogFalg"
      :before-close="closeDeptDialog"
      title="选择角色组"
      width="25%"
      center>
      <el-tree
        ref="tree"
        :data="treeData"
        :props="{
          children: 'options',
          label: 'groupName',
          value:'groupId'}"
        show-checkbox
        highlight-current
        empty-text="暂无数据"
        node-key="groupId"
      />
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeDeptDialog">取 消</el-button>
        <el-button :disabled="isUpload" type="primary" @click="updateRoleGroupHandler">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getRoleGroupTreeList } from '@/api/mis/ums/roleGroup'
export default {
  filters: {

  },
  props: {
    defaultActive: {
      type: Array,
      default: () => []
    },
    clearFormValidateByProp: {
      type: Function,
      default: null
    },
    updateRoleGroup: {
      type: Function,
      default: null
    }
  },
  data() {
    return {
      loaded: false,
      oldSelect: '[]',
      isUpload: false,
      deptDialogFalg: false,
      roleGroupData: [],
      treeData: []
    }
  },
  computed: {
    checkedKeys() {
      // console.log(this.$refs.tree.getCheckedKeys())
      return this.$refs.tree.getCheckedKeys(true)
    }
  },
  watch: {
    deptDialogFalg(v) {
      if (v === true) {
        this.clearFormValidateByProp('roles')
        this.getTreeData()
      }
    }
  },
  created() {
  },
  async mounted() {
  },
  methods: {
    async getTreeData() {
      try {
        // console.log(this.defaultActive)
        if (this.treeData.length === 0) {
          const r = await getRoleGroupTreeList()
          this.treeData = r['data']
          // this.$refs.tree.setCheckedKeys(this.defaultActive)
        }
        this.$refs.tree.setCheckedKeys(this.defaultActive)
      } catch (e) {
        console.log(e)
      }
    },
    addDept() {
      this.deptData.push({
        dept: [],
        job: 'test'
      })
    },
    async closeDeptDialog() {
      this.deptDialogFalg = false
      this.$refs.tree.setCheckedKeys(this.defaultActive)
    },
    async showDeptDialog() {
      this.deptDialogFalg = true
    },
    async updateRoleGroupHandler() {
      this.isUpload = true
      try {
        // this.oldSelect = JSON.stringify(this.roleGroupData)
        console.log(this.checkedKeys)
        await this.updateRoleGroup(this.checkedKeys)
        this.deptDialogFalg = false
      } catch (e) {
        console.log(e)
      } finally {
        this.isUpload = false
      }
    }
  }
}
</script>

