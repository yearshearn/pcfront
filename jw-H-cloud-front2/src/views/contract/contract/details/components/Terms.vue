<template style="height:100%">
  <el-container v-loading="detaileLoading">
    <el-header v-show="canEdit" v-if="editRoleFlag()">
      <AddclauseDialog v-show="canEdit " :add-clause = "addclause" style="margin-left:-20px"/>
    </el-header>
    <el-main>
      <el-collapse v-model="activeNames">
        <template v-for="(item, index) in clasues" >
          <Clause :clause-data="item" :key="index" :arr-index="index" :refresh-data="getDetails" />
        </template>
      </el-collapse>
    </el-main>
  </el-container>
</template>

<script>
// import { getList } from '@/api/contract'
// import { getList } from '@/api/table'
import { default as Clause } from './terms/clause'
import { default as AddclauseDialog } from './terms/addclauseDialog'
import { getClauseDetails, addClauseDetails } from '@/api/contract'
import { editRoleFlag } from '@/utils/buttonRole/contract'
//
export default {
  components: { Clause, AddclauseDialog },
  filters: {

  },
  data() {
    return {
      editRoleFlag,
      activeNames: [0],
      clasues: [],
      detaileLoading: true,
      showAddclauseDialog: false,
      canEdit: false
    }
  },
  watch: {
    activeNames(v) {
      // console.log(v)
    }
  },
  created() {
    this.getDetails()
  },
  async mounted() {
    // console.log(this.$route.params)
  },
  methods: {
    async getDetails() {
      this.detaileLoading = true
      try {
        const r = await getClauseDetails(this.$route.params['cid'])
        // console.log(r)
        if (r['data'].length === 0) {
          this.canEdit = true
        } else {
          this.canEdit = r['data']['conStatus'] !== 'AI'
        }
        if (!Array.isArray(r['data'])) {
          this.clasues = []
          return
        }
        this.clasues = r['data']
        this.canEdit = r['data'][0]['conStatus'] !== 'AI'
        const tempArr = []
        for (let i = 0; i < r['data'].length; i++) {
          tempArr.push(i)
        }
        this.activeNames = tempArr
        // console.log(this.clasues)
        // console.log(this.canEdit)
      } catch (e) {
        console.log(e)
      } finally {
        this.detaileLoading = false
      }

      // console.log(this.clasues)
    },
    async addclause(data) {
      this.detaileLoading = true
      try {
        const body = {
          conId: this.$route.params['cid'],
          tClause: data
        }
        // return console.log(body)
        await addClauseDetails(body)
        this.$message({
          message: '新增成功！',
          type: 'success'
        })
      } catch (e) {
        console.log(e)
      } finally {
        this.getDetails()
      }
    }
  }
}
</script>

