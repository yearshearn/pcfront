<template style="height:100%">
  <el-container>
    <el-header>
      <el-row>
        <el-col :span="24">
          <h2>{{ details['queName'] }}</h2>
        </el-col>
      </el-row>
    </el-header>
    <el-main height="95%">
      <el-form label-position="left" style="padding-left:15px">
        <el-row v-if="canEdit && Object.is(details['queType'],'定期')">
          <el-col :span="24">
            <el-form-item label="新问卷标题：">
              <el-input v-model="details['queName']" style="max-width:75%"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row
          v-for="(item, index) in details['problems']"
          v-show="Object.is(details['queType'],'定期')"
          :key="index"
        >
          <el-col :span="20" :lg="16">
            <el-form-item :label="index + 1 +'、'">
              <el-input v-if="canEdit" v-model="item['proProblem']" style="max-width:90%"/>
              <span v-else style="max-width:90%">{{ item['proProblem'] }}</span>
            </el-form-item>
          </el-col>
          <el-col v-if="canEdit" :span="2">
            <el-button type="danger" @click="deledtProblem(index,item['proId'])">删除</el-button>
          </el-col>
        </el-row>
        <el-row v-if=" Object.is(details['queType'],'长期')" :gutter="15">
          <el-col :span="6">
            <el-form-item label="问卷名称:" label-width="90">
              <el-input v-model="details['queName']" readonly style="width:60%"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="问卷备注:" label-width="90">
              <el-input
                v-model="details['comments']"
                :autosize="{ minRows: 3, maxRows: 5}"
                :readonly="longRead"
                type="textarea"
                resize="none"
                style="width:60%"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-table
          v-loading="detailLoading"
          v-if="Object.is(details['queType'],'长期')"
          :data="details['problems']"
          border
          height="569"
          element-loading-text="获取列表中"
        >
          <el-table-column width="80" align="center" type="index" label="问题编码"/>
          <el-table-column align="center" label="工作内容">
            <template slot-scope="{row}">
              <el-input v-model="row.workContent" :readonly="longRead" clearable/>
            </template>
          </el-table-column>
          <el-table-column align="center" label="检查/扣分">
            <template slot-scope="{row}">
              <el-input v-model="row.insDed" :readonly="longRead" clearable/>
            </template>
          </el-table-column>
          <el-table-column align="center" width="120" label="标准分">
            <template slot-scope="{row}">
              <el-input-number
                v-model.number="row.score"
                :min="0"
                :disabled="longRead"
                :controls="false"
                clearable
                style="width:100px"/>
            </template>
          </el-table-column>
          <el-table-column v-if="!longRead" width="80" align="center" label="操作">
            <template slot-scope="scope">
              <el-button
                circle
                type="danger"
                icon="el-icon-delete"
                @click.native.prevent="deleteRow(scope.$index, details['problems'])"
              />
            </template>
          </el-table-column>
        </el-table>
        <el-row v-if="canEdit" style="margin:15px 0">
          <el-col :span="2">
            <el-button @click="addProblem">新增问题</el-button>
          </el-col>
        </el-row>
        <el-row>
          <el-col v-if="!canEdit" :span="2" style="margin:15px 0">
            <el-button @click="changeCanEdit">修改</el-button>
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
import {
  getQuestionnaireDetailsByQueId,
  updateQuestionnaireDetails
} from '@/api/contract'
export default {
  components: {},
  filters: {},
  data() {
    return {
      details: {},
      activeNames: [0],
      canEdit: false,
      // 长期等待
      detailLoading: false,
      // 长期只读
      longRead: true,
      delProblemIds: []
    }
  },
  created() {},
  async mounted() {
    // console.log(this.$route.params)
    this.getDetails()
  },
  methods: {
    async getDetails() {
      this.detailLoading = true
      try {
        const r = await getQuestionnaireDetailsByQueId({
          queId: this.$route.params['qid']
        })
        this.details = r['data']
        const tempArr = []
        for (let i = 0; i < r['data']['problems'].length; i++) {
          tempArr.push(i)
        }
        this.activeNames = tempArr
        this.delProblemIds = []
      } catch (e) {
        console.log(e)
      } finally {
        this.detailLoading = false
      }
    },
    changeCanEdit() {
      this.canEdit = !this.canEdit
      this.longRead = false
    },
    async save() {
      this.canEdit = false
      this.longRead = true
      try {
        const data = this.details
        data['delProblemIds'] = this.delProblemIds
        await updateQuestionnaireDetails(data)
        this.$message({
          message: '更新成功！',
          type: 'success'
        })
      } catch (e) {
        console.log(e)
      } finally {
        this.delProblemIds = []
        this.getDetails()
      }
    },
    cancelSave() {
      this.delPlaceIds = []
      this.canEdit = false
      this.longRead = true
      this.getDetails()
    },
    addProblem() {
      this.details['problems'].push({
        proId: null,
        proProblem: '',
        queId: this.details['queId']
      })
    },
    deledtProblem(i, id) {
      this.details['problems'].splice(i, 1)
      if (id) {
        this.delProblemIds.push(id)
      }
    },
    // 删除内容
    deleteRow(index, rows) {
      rows.splice(index, 1)
      // console.log(rows)
    }
  }
}
</script>

<style scoped>
.el-input {
  width: 80%;
}
</style>
