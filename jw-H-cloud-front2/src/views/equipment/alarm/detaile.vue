<template style="height:100%">
  <el-container style="padding:30px">
    <el-header>
      <el-row>
        <el-col :span="2">
          <el-button
            @click="$router.push('/equipment/alarm')"
          >返回</el-button>
        </el-col>
      </el-row>
    </el-header>
    <el-main style="margin-top:-15px">
      <el-card
        v-loading="isLoading"
        :body-style="{'padding-bottom' : '0'}"
        shadow="never">
        <!--<div slot="header" class="clearfix">
          {{ alarmType || '空' }}
        </div> -->
        <el-form
          ref="form"
          :model="form"
          :rules="formRules"
          label-width="120px">
          <el-container>
            <el-main style="min-height:100px">
              <el-row>
                <el-col :span="8">
                  <el-form-item label="设备警报ID" prop="equipmentAlarmId">
                    <el-input
                      :disabled="equipmentAlarmId?true:false"
                      v-model="form.equipmentAlarmId"
                      style="max-width:85%"
                      clearable
                      placeholder="请输入内容"/>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="标识位" prop="posion">
                    <el-input
                      v-model="form.posion"
                      style="max-width:85%"
                      clearable
                      placeholder="请输入内容"/>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="警报等级" prop="alarmLevel">
                    <el-select
                      v-model="form.alarmLevel"
                      filterable
                      clearable
                      style="width:85%"
                      default-first-option
                      placeholder="请选择">
                      <el-option
                        v-for="item in [{label:1},{label:2}]"
                        :key="item.label"
                        :label="item.label"
                        :value="item.label"/>
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="8">
                  <el-form-item label="设备类型" prop="eqStd">
                    <el-select
                      v-model="form.eqStd"
                      :disabled="equipmentAlarmId?true:false"
                      filterable
                      clearable
                      style="width:85%"
                      default-first-option
                      placeholder="请选择"
                      @change="eqStdChanged">
                      <el-option
                        v-for="item in options.category"
                        :key="item.value"
                        :label="item.label"
                        :value="item.label"/>
                    </el-select>
                    <!--<el-input
                      :disabled = "alarmType?true:false"
                      v-model="form.alarmType"
                      style="max-width:85%"
                      placeholder="请输入内容"
                    />-->
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="标志位值" prop="posionValue">
                    <el-input
                      v-model="form.posionValue"
                      style="max-width:85%"
                      clearable
                      placeholder="请输入内容"/>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="最高报警阈值" prop="maximumAlarm">
                    <el-input
                      v-model="form.maximumAlarm"
                      style="max-width:85%"
                      clearable
                      placeholder="请输入内容"/>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="8">
                  <el-form-item>
                    <template slot="label">
                      <i class="el-icon-circle-plus-outline"/>
                      子类型
                    </template>
                    <el-select
                      :disabled="equipmentAlarmId?true:false"
                      v-model="form.eqSubtypes"
                      :loading="isEqSubtypesLoading"
                      filterable
                      style="width:85%"
                      placeholder="请选择">
                      <el-option
                        v-for="item in options.eqSubtypes"
                        :key="item.value"
                        :label="item.label"
                        :value="item.label"/>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="数据类型" prop="dataType">
                    <el-input
                      v-model="form.dataType"
                      style="max-width:85%"
                      placeholder="请输入内容"
                      clearable/>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="最低报警阈值" prop="minimumAlarm">
                    <el-input
                      v-model="form.minimumAlarm"
                      style="max-width:85%"
                      placeholder="请输入内容"
                      clearable/>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="24">
                  <el-form-item label="报警描述" prop="description">
                    <el-input
                      :rows="2"
                      v-model="form['description']"
                      :autosize="{minRows:3}"
                      :maxlength="250"
                      style="max-width:95%"
                      show-word-limit
                      resize="none"
                      type="textarea"
                      placeholder="请输入内容"/>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-main>
            <el-footer>
              <el-row>
                <el-col :span="24">
                  <el-form-item>
                    <el-button type="primary" @click="onSubmit">{{ equipmentAlarmId?'保存':'创建' }}</el-button>
                    <el-button @click="reset">{{ equipmentAlarmId?'重置':'清除' }}</el-button>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-footer>
          </el-container>
        </el-form>
      </el-card>
    </el-main>
  </el-container>
</template>

<script>
import {
  getTableList as getSystemOptions
} from '@/api/equipment/system'

import {
  getCategoryOptions
} from '@/api/equipment/category'

import {
  getEquipmentAlarmData,
  updateEquipmentAlarmData,
  addEquipmentAlarmData,
  getEquipmentAlarmeqSubtypesData
} from '@/api/equipment/alarm'

import {
  num4
} from '@/utils/validate/reg'
export default {
  components: {

  },
  filters: {
  },
  data() {
    let equipmentAlarmId
    return {
      isEqSubtypesLoading: false,
      options: {
        systemName: [],
        category: [],
        eqSubtypes: []
      },
      equipmentAlarmId,
      isLoading: false,
      form: {
        equipmentAlarmId: '',
        posion: '',
        alarmLevel: '',
        eqStd: '',
        posionValue: '',
        maximumAlarm: '',
        eqSubtypes: '',
        dataType: '',
        minimumAlarm: '',
        description: ''
      },
      formRules: {
        equipmentAlarmId: [
          { required: true, message: '请输入设备警报ID' }
        ],
        alarmLevel: [
          { required: true, message: '请选择警报等级' }
        ],
        eqStd: [
          { required: true, message: '请选择设备类型' }
        ],
        maximumAlarm: [
          { required: true, message: '请输入最高报警阈值' },
          {
            validator: (rule, value, cb) => {
              value = parseFloat(value)
              // eslint-disable-next-line no-self-compare
              if (value !== value) {
                return cb(new Error('请输入正确的数字'))
              }
              if (!this.form.minimumAlarm) {
                return cb()
              }
              if (value < this.form.minimumAlarm) {
                return cb(new Error('最大值不能比最小值小'))
              }
              return cb()
            }
          }
        ],
        dataType: [
          { pattern: num4, message: '请输入小于四位的数字' }
        ],
        minimumAlarm: [
          { required: true, message: '请输入最低报警阈值' },
          {
            validator: (rule, value, cb) => {
              value = parseFloat(value)
              // eslint-disable-next-line no-self-compare
              if (value !== value) {
                return cb(new Error('请输入正确的数字'))
              }
              if (!this.form.maximumAlarm) {
                return cb()
              }
              if (value > this.form.maximumAlarm) {
                return cb(new Error('最小值不能比最大值大'))
              }
              return cb()
            }
          }
        ],
        posion: [
          { required: true, message: '请输入标志位' }
        ]
      }
    }
  },
  computed: {

  },
  watch: {
  },
  created() {
  },
  async mounted() {
    this.init()
  },
  methods: {
    async eqStdChanged() {
      this.isEqSubtypesLoading = true
      this.form.eqSubtypes = ''
      try {
        if (!this.form.eqStd) { return }
        const params = {
          eqStd: this.form.eqStd
        }
        const r = await getEquipmentAlarmeqSubtypesData(params)
        if (!r['data'][0]) {
          r['data'] = []
        }
        this.options.eqSubtypes = r['data'].map(i => {
          return {
            value: i,
            label: i
          }
        })
        console.log(r)
      } catch (e) {
        console.log(e)
        this.options.eqSubtypes = []
      } finally {
        this.isEqSubtypesLoading = false
      }
    },
    async getOptions() {
      try {
        const params = {
          pageSize: 9999
        }
        const r = await Promise.all([
          getSystemOptions(params),
          getCategoryOptions(params)
        ])
        this.options.systemName = r[0]['data']['list'].map(i => {
          return {
            value: i['alarmType'],
            label: i['description']
          }
        })
        this.options.category = r[1]['data'].map(i => {
          return {
            value: i,
            label: i
          }
        })
        console.log(r)
      } catch (e) {
        console.log(e)
      }
    },
    async reset() {
      if (this.equipmentAlarmId) {
        this.getDetails()
      } else {
        this.form['eqSubtypes'] = ''
        this.$refs['form'].resetFields()
      }
    },
    async onSubmit() {
      this.isLoading = true
      try {
        await this.$refs['form'].validate()
        const body = {
          posion: this.form['posion'],
          alarmLevel: this.form['alarmLevel'],
          eqStd: this.form['eqStd'],
          posionValue: this.form['posionValue'],
          maximumAlarm: this.form['maximumAlarm'],
          eqSubtypes: this.form['eqSubtypes'],
          dataType: this.form['dataType'],
          minimumAlarm: this.form['minimumAlarm'],
          description: this.form['description']
        }
        if (this.equipmentAlarmId) {
          body['equipmentAlarmId'] = this.equipmentAlarmId
          await updateEquipmentAlarmData(body)
        } else {
          body['equipmentAlarmId'] = this.form['equipmentAlarmId']
          body['switchAlarm'] = 1
          await addEquipmentAlarmData(body)
        }
        this.$message({
          message: `${this.equipmentAlarmId ? '保存' : '创建'}成功！`,
          type: 'success'
        })
        this.reset()
        // console.log(r)
      } catch (e) {
        console.log(e)
      } finally {
        this.isLoading = false
      }
    },
    async getDetails() {
      this.isLoading = true
      try {
        const params = {
          equipmentAlarmId: this.equipmentAlarmId
        }
        const r = await getEquipmentAlarmData(params)
        this.form['equipmentAlarmId'] = r['data']['equipmentAlarmId']
        this.form['posion'] = r['data']['posion']
        this.form['alarmLevel'] = r['data']['alarmLevel']
        this.form['eqStd'] = r['data']['eqStd']
        this.form['posionValue'] = r['data']['posionValue']
        this.form['maximumAlarm'] = r['data']['maximumAlarm']
        this.form['eqSubtypes'] = r['data']['eqSubtypes']
        this.form['dataType'] = r['data']['dataType']
        this.form['minimumAlarm'] = r['data']['minimumAlarm']
        this.form['description'] = r['data']['description']
        this.eqStdChanged()
      } catch (e) {
        console.log(e)
      } finally {
        this.isLoading = false
      }
    },
    init() {
      const equipmentAlarmId = this.$route.params['equipmentAlarmId']
      if (equipmentAlarmId) {
        this.equipmentAlarmId = equipmentAlarmId
        this.getDetails()
      }
      this.getOptions()
    }
  }
}
</script>

<style>

</style>

