<template style="height:100%">
  <el-container>
    <el-header>
      <h2>{{ details['queName'] }}</h2>
    </el-header>
    <el-main height="95%">
      <el-form label-position="left" style="padding-left:15px">
        <el-row v-if="canEdit">
          <el-col :span="24">
            <el-form-item label="新问卷标题：">
              <el-input v-model="details['queName']" style="max-width:75%" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-for="(item, index) in details['problems']" :key="index">
          <el-col :span="20" :lg="16">
            <el-form-item :label="index + 1 +'、'">
              <span style="max-width:90%">{{ item['proProblem'] }}</span>
            </el-form-item>
          </el-col>
          <el-col v-if="canEdit" :span="2">
            <el-button type="danger" @click="deledtProblem(index)">删除</el-button>
          </el-col>

        </el-row>
        <el-row v-if="canEdit" style="margin-bottom:15px">
          <el-col :span="2">
            <el-button @click="addProblem">新增问题</el-button>
          </el-col>
          <el-col :span="4">
            <SelectQuestionDialog :select-callback="selectHandler" />
          </el-col>
        </el-row>
        <el-row v-if="false">
          <el-col v-if="!canEdit" :span="2">
            <el-button @click="changeCanEdit">{{ details['queId'] ? '修改':'新建' }}</el-button>
          </el-col>
          <el-col v-if="canEdit" :span="4">
            <el-button @click="cancelSave">取消</el-button>
            <el-button type="primary" @click="save">保存</el-button>
          </el-col>
        </el-row>
      </el-form>
    </el-main>
  </el-container>
</template>

<script>
import { getQuestionnaireDetailsByConId } from '@/api/contract'
import { default as SelectQuestionDialog } from './questionnaire/selectQuestionDialog'
import { mapGetters } from 'vuex'
// import { getList } from '@/api/table'
export default {
  components: { SelectQuestionDialog },
  filters: {

  },
  props: {
    refreshEvaTableData: {
      type: Function,
      default: null
    }
  },
  data() {
    return {
      details: {
        queId: null,
        queName: '暂无绑定问卷',
        problems: []
      },
      activeNames: [0],
      canEdit: false,
      delProblemIds: []
    }
  },
  computed: {
    ...mapGetters([
      'queDataRefreshFlag'
    ])
  },
  watch: {
    queDataRefreshFlag(v) {
      if (v) {
        this.getDetails()
      }
    }
  },
  created() {
  },
  async mounted() {
    this.getDetails()
  },
  methods: {
    async getDetails() {
      try {
        const r = await getQuestionnaireDetailsByConId({ conId: this.$route.params['cid'] })
        // console.log('问卷加载完成')
        if (!r['data'] || !r['data']['problems']) {
          return
        }
        const tempArr = []
        // r['data']['queName'] = r['data']['queName'].trim()
        for (let i = 0; i < r['data']['problems'].length; i++) {
          // r['data']['problems'][i]['proProblem'] = r['data']['problems'][i]['proProblem'].trim()
          tempArr.push(i)
        }
        this.details = r['data']
        this.activeNames = tempArr
      } catch (e) {
        console.log(e)
      } finally {
        this.$store.commit('SET_QUES_DATA_REFRESH_FLAG', false)
      }
    },
    changeCanEdit() {
      this.canEdit = !this.canEdit
    },
    save() {
      this.canEdit = false
      const data = this.details
      data['delProblemIds'] = this.delProblemIds
      // console.log(data)
    },
    cancelSave() {
      this.canEdit = false
      this.getDetails()
    },
    addProblem() {
      this.details['problems'].push({
        proId: null,
        proProblem: ''
      })
    },
    deledtProblem(i, id) {
      this.details['problems'].splice(i, 1)
      if (id) {
        this.delProblemIds.push(id)
      }
    },
    selectHandler(v) {
      // 清空之前需要删除的键
      this.delProblemIds = []
      for (let i = 0; i < this.details['problems'].length; i++) {
        const item = this.details['problems'][i]
        // 将目前所有有id的问题添加到删除的数组
        if (item['proId']) {
          this.delProblemIds.push(item['proId'])
        }
      }
      // 将现在的问题组全部清掉
      this.details['problems'] = []
      // 将传进来的所有问题 复制到现在的数组中
      for (let i = 0; i < v['problems'].length; i++) {
        const item = v['problems'][i]
        this.details['problems'].push({
          proId: null,
          proProblem: item['proProblem']
        })
      }
    }
  }
}
</script>

