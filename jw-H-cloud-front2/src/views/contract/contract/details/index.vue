<template style="height:100%">
  <el-container style="padding-left:15px;">
    <el-main v-loading="isLoading" height="95%">
      <el-tabs v-model="activeName" type="card">
        <el-tab-pane
          label="合同详情"
          name="contract"
          active
        >
          <contract :con-type="conType" />
        </el-tab-pane>
        <el-tab-pane
          v-if="showTermsFlag"
          label="合同内容"
          name="terms"
        >
          <terms :con-type="conType" />
        </el-tab-pane>
        <el-tab-pane
          label="合同问卷"
          name="questionnaire"
        >
          <QuestionEvaluation :refresh-eva-table-data="refreshEvaTableData" :con-type="conType" />
        </el-tab-pane>
        <el-tab-pane label="发票管理" name="invoiceManagement">
          <invoiceManagement :con-id="this.$route.params.cid"/>
        </el-tab-pane>
        <el-tab-pane
          ref="evaTable"
          label="合同履约评价表"
          name="evaluationTable"
        >
          <evaluationTable :con-type="conType" />
        </el-tab-pane>
      </el-tabs>
    </el-main>
  </el-container>
</template>

<script>
// import { getList } from '@/api/contract'
// import { getList } from '@/api/table'
import { getContractDetails } from '@/api/contract'
import {
  Contract,
  QuestionEvaluation,
  Terms,
  evaluationTable,
  invoiceManagement
} from './components'

export default {
  components: { Contract, QuestionEvaluation, Terms, evaluationTable, invoiceManagement },
  filters: {
  },
  data() {
    return {
      isLoading: false,
      showTermsStatus: ['定期'],
      conType: '',
      activeName: 'contract',
      needRefresh: false
    }
  },
  computed: {
    showTermsFlag() {
      return this.showTermsStatus.includes(this.conType)
    }
  },
  created() {

  },
  async mounted() {
    this.checkConType()
  },
  methods: {
    refreshEvaTableData() {
      this.$refs.evaTable.$children[0].getData()
    },
    async checkConType() {
      const conType = this.$route.params.conType
      if (conType !== undefined) {
        this.conType = conType
      } else {
        this.isLoading = true
        let r
        try {
          r = await getContractDetails(this.$route.params.cid)
          if (r['data']['conType']) {
            this.conType = r['data']['conType']
          }
        } catch (e) {
          console.log(e)
        } finally {
          this.isLoading = false
        }
      }
    }
  }
}
</script>

