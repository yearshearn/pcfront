<template style="height:100%">
  <div>
    <el-button type="primary" @click="showDialog">新建问卷</el-button>
    <el-dialog
      :visible="showFlag"
      :before-close="closeDialog"
      title="创建问卷"
      width="75%"
      center>
      <CreateQue :close-dialog="closeDialog" :que-type="queType"/>
    </el-dialog>
  </div>
</template>

<script>
import { default as CreateQue } from '@/views/contract/newlyBuild/newQuestionnaire'

export default {
  components: {
    CreateQue
  },
  props: {
    queType: {
      type: String,
      default: ''
    },
    createQueHandle: {
      type: Function,
      default: null
    }
  },
  data() {
    return {
      showFlag: false
    }
  },
  created() {

  },
  async mounted() {
  },
  methods: {
    showDialog() {
      this.showFlag = true
    },
    closeDialog(id, queName) {
      // console.log(id, queName)
      if (id && queName) {
        this.createQueHandle(id, queName)
      }
      this.showFlag = false
    }
  }
}
</script>

