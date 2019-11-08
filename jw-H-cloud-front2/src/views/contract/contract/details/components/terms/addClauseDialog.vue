<template style="height:100%">
  <el-container>
    <el-main height="95%">
      <el-button type="primary" @click="showAddclauseDialog">新增条款</el-button>
      <el-dialog
        :visible="addclauseDialogFalg"
        :before-close="closeAddclauseDialog"
        title="新增条款"
        width="60%"
        center>
        <el-form
          ref="ruleForm"
          :model="clauseData"
          :rules="formRule"
          label-position="left">
          <el-row :gutter="10">
            <el-col :span="8" >
              <el-form-item label="条款类型：" prop="claType">
                <el-select v-model="clauseData['claType']" style="max-width:100px" >
                  <el-option
                    v-for="(item,key) in claTypeArr"
                    :key="key"
                    :label="item.label"
                    :value="item.value"/>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8" >
              <el-form-item label="持续天数：" prop="continuedDays">
                <el-input-number v-model="clauseData['continuedDays']" :min="1" :max="99" style="max-width:150px"/>
              </el-form-item>
            </el-col>
            <el-col :span="8" >
              <el-form-item label="间隔次数：" prop="intervalTimes">
                <el-input-number v-model="clauseData['intervalTimes']" :min="1" :max="99" style="max-width:150px"/>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="循环方式：">
                <el-row :gutter="5">
                  <el-col :span="4">
                    <el-form-item label="每" prop="modes">
                      <el-select v-model="clauseData['modes']" style="max-width:65%">
                        <el-option
                          v-for="(item,key) in claModeArr"
                          :key="key"
                          :label="item.label"
                          :value="item.value"/>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="4">
                    <el-form-item label="的" prop="cirDate">
                      <el-select v-model="clauseData['cirDate']" style="max-width:65%">
                        <el-option
                          v-for="(item,key) in clauseData['modes'] == 'week' ? dayArr:monthDayArr"
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
            <template v-for="(item, index) in clauseData['places']" style="padding-left:15px">
              <Place
                :item="item"
                :bl-data="enumerationVal['bl']"
                :can-edit="true"
                :arr-key="index"
                :delete-place="deletePlace"
                :cla-type="clauseData['claType']"
                :key="index"
                type-mode="add"/>
            </template>
            <el-button type="primary" style="margin-bottom:15px" @click="addPlaces">新增地点/设备</el-button>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="条款内容：">
                <el-input v-model="clauseData['claContent']" :autosize="{minRows: 5}" resize="none" type="textarea"/>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="closeAddclauseDialog">取 消</el-button>
          <el-button :disabled="isUpload" type="primary" @click="addclauseHandler">确 定</el-button>
        </span>
      </el-dialog>
    </el-main>
  </el-container>
</template>

<script>
import {
  dayArr,
  monthDayArr,
  claTypeArr,
  claModeArr
} from '@/utils/enumerationList/contract'
import { getAllBuildingDataById } from '@/api/enumeration'
import { default as Place } from './place'
export default {
  filters: {

  },
  components: {
    Place
  },
  props: {
    addClause: {
      type: Function,
      default: null
    }
  },
  data() {
    return {
      enumerationVal: {
        bl: []
      },
      formRule: {
        claType: [
          { required: true, message: '请选择条款类型', trigger: 'change' }
        ],
        continuedDays: [
          { required: true, message: '请填写持续天数', trigger: 'change' }
        ],
        intervalTimes: [
          { required: true, message: '请填写间隔次数', trigger: 'change' }
        ],
        modes: [
          { required: true, message: '请选择循环类型', trigger: 'change' }
        ],
        cirDate: [
          { required: true, message: '请选择循环日期', trigger: 'change' }
        ]
      },
      isUpload: false,
      dayArr,
      monthDayArr,
      claTypeArr,
      claModeArr,
      addclauseDialogFalg: false,
      clauseData: {
        claId: '',
        claType: '',
        modes: '',
        cirDate: '',
        continuedDays: 1,
        intervalTimes: 1,
        claContent: '',
        places: []
      }
    }
  },
  watch: {
    activeNames(v) {
      // console.log(v)
    }
  },
  created() {
  },
  async mounted() {
    // console.log(this.$route.params)
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
    async showAddclauseDialog() {
      this.addclauseDialogFalg = true
      // await this.$refs['ruleForm'].resetFields()
      // this.$refs['ruleForm'].resetFields()
    },
    async closeAddclauseDialog() {
      this.$refs['ruleForm'].resetFields()
      this.addclauseDialogFalg = false
      this.isUpload = false
    },
    deletePlace(i) {
      // console.log(i)
      this.clauseData['places'].splice(i, 1)
    },
    addPlaces() {
      this.clauseData['places'].push({
        blId: '',
        flId: '',
        rmId: '',
        eqId: ''
      })
    },
    async addclauseHandler() {
      this.isUpload = true
      try {
        await this.$refs['ruleForm'].validate()
        await this.addClause(this.clauseData)
        this.closeAddclauseDialog()
      } catch (e) {
        console.log(e)
      } finally {
        this.isUpload = false
      }
    }
  }
}
</script>

