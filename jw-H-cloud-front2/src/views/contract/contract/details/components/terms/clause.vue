<template style="height:100%">
  <el-collapse-item v-loading="isLoading" :name="arrIndex" >
    <template slot="title" >
      <h2>第{{ arrIndex + 1 }}项：</h2>
    </template>
    <el-form label-position="right" style="padding-top:20px;padding-left:15px">
      <el-row :gutter="10">
        <el-col :span="24" >
          <el-form-item label="条款编码：">
            <el-input v-model="clauseData['claId']" disabled style="max-width:230px"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="4" >
          <el-form-item label="条款类型：">
            <el-select v-model="clauseData['claType']" :readonly = "!canEdit" style="max-width:100px" >
              <el-option
                v-for="(item,key) in claTypeArr"
                :disabled="!canEdit"
                :key="key"
                :label="item.label"
                :value="item.value"/>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="5" >
          <el-form-item label="持续天数：">
            <el-input-number v-model="clauseData['continuedDays']" :min="1" :max="99" :disabled = "!canEdit" style="max-width:150px"/>
          </el-form-item>
        </el-col>
        <el-col :span="5" >
          <el-form-item label="间隔次数：">
            <el-input-number v-model="clauseData['intervalTimes']" :min="1" :max="99" :disabled = "!canEdit" style="max-width:150px"/>
          </el-form-item>
        </el-col>
        <el-col :span="10" >
          <el-form-item label="循环方式：">
            <el-row :gutter="5">
              <el-col :span="8">
                <el-form-item label="每">
                  <el-select v-model="clauseData['modes']" :readonly = "!canEdit" style="max-width:100px">
                    <el-option
                      v-for="(item,key) in claModeArr"
                      :disabled="!canEdit"
                      :key="key"
                      :label="item.label"
                      :value="item.value"/>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="的">
                  <el-select v-model="clauseData['cirDate']" :readonly = "!canEdit" style="max-width:100px">
                    <el-option
                      v-for="(item,key) in clauseData['modes'] == 'week' ? dayArr : monthDayArr "
                      :disabled="!canEdit"
                      :key="key"
                      :label="item.label"
                      :value="item.value"/>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="2">
                <el-form-item :label="clauseData['modes'] == 'month' ? '日':''"/>
              </el-col>
            </el-row>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-form-item label="绑定的地点或设备："/>
        <template v-for="(item, index) in clauseData['place']" >
          <Place
            :item="item"
            :bl-data="enumerationVal['bl']"
            :can-edit="canEdit"
            :arr-key="index"
            :delete-place="deletePlace"
            :cla-type="clauseData['claType']"
            :key="index"
            style="padding-left:15px"/>
        </template>
        <el-button v-if = "canEdit" type="primary" style="margin-bottom:15px" @click="addPlace">新增地点/设备</el-button>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="条款内容：">
            <el-input v-model="clauseData['claContent']" :readonly = "!canEdit" :autosize="true" resize="none" type="textarea"/>
          </el-form-item>
        </el-col>
      </el-row>
      <div v-if="editRoleFlag()">
        <el-row v-if = "clauseData['conStatus'] !== 'AI'">
          <el-col v-if="!canEdit" :span="2">
            <el-button @click="changeCanEdit">修改</el-button>
          </el-col>
          <el-col v-if="canEdit" :span="4">
            <el-button @click="cancelSave">取消</el-button>
            <el-button type="primary" @click="save">保存</el-button>
          </el-col>
          <el-col :span="3" :offset="canEdit?17:19">
            <el-button type="danger" @click="deleteClause(clauseData['claId'])">删除此条款</el-button>
          </el-col>
        </el-row>
    </div></el-form>
  </el-collapse-item>
</template>

<script>
import {
  dayArr,
  monthDayArr,
  claTypeArr,
  claModeArr,
  tempBlArr,
  tempFlArr,
  tempRmArr,
  tempDeviceArr
} from '@/utils/enumerationList/contract'
import { updateClauseDetails, deleteClauseDetails } from '@/api/contract'
import { getAllBuildingDataById } from '@/api/enumeration'

import { editRoleFlag } from '@/utils/buttonRole/contract'
import { default as Place } from './place'
export default {
  name: 'Clause',
  components: {
    Place
  },
  filters: {

  },
  //   props: ['clauseData'],
  props: {
    clauseData: {
      type: Object,
      default: null
    },
    arrIndex: {
      type: Number,
      default: null
    },
    refreshData: {
      type: Function,
      default: null
    }
  },
  data() {
    return {
      enumerationVal: {
        bl: []
      },
      editRoleFlag,
      dayArr,
      monthDayArr,
      claTypeArr,
      claModeArr,
      tempBlArr,
      tempFlArr,
      tempRmArr,
      tempDeviceArr,
      activeNames: [],
      canEdit: false,
      delPlaceIds: [],
      isLoading: false
    }
  },
  watch: {
    clauseData(v) {
      // console.log(v)
    }
  },
  created() {
    // this.getDetails()
  },
  async mounted() {
    // console.log(this.$route.params)
    // console.log(this.clauseData)
    this.initPositionData()
  },
  methods: {
    async initPositionData() {
      try {
        const r = await getAllBuildingDataById()
        this.enumerationVal['bl'] = r['data'].map(i => {
          return {
            label: i['name'],
            value: i['blId']
          }
        })
      } catch (e) {
        console.log(e)
      }
    },
    async getPositionData() {

    },
    deletePlace(i, id) {
      // console.log(i)
      this.clauseData['place'].splice(i, 1)
      if (id) {
        this.delPlaceIds.push(id)
      }
    },
    addPlace() {
      this.clauseData['place'].push({
        id: null,
        blId: '',
        flId: '',
        rmId: '',
        eqId: ''
      })
    },
    changeCanEdit() {
      this.canEdit = !this.canEdit
    },
    async save() {
      this.canEdit = false
      this.isLoading = true
      try {
        const data = this.clauseData
        data['delPlaceIds'] = this.delPlaceIds
        await updateClauseDetails(data)
        this.$message({
          message: '更新成功！',
          type: 'success'
        })
      } catch (e) {
        console.log(e)
      } finally {
        this.isLoading = false
        this.delPlaceIds = []
        this.refreshData()
      }
    },
    cancelSave() {
      this.delPlaceIds = []
      this.canEdit = false
      this.refreshData()
    },
    async deleteClause(claId) {
      // console.log(claId)
      try {
        await deleteClauseDetails({ claId })
        this.$message({
          message: '删除成功！',
          type: 'success'
        })
      } catch (e) {
        console.log(e)
      } finally {
        this.refreshData()
      }
    }
  }
}
</script>

