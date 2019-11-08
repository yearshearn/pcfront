<template style="height:100%">
  <el-container style="padding:30px">
    <el-header>
      <el-row>
        <el-col :span="2">
          <el-button
            @click="$router.push('/equipment/category')"
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
                  <el-form-item label="设备类型" prop="eqStd">
                    <el-select
                      v-model="form.eqStd"
                      filterable
                      clearable
                      style="width:85%"
                      allow-create
                      default-first-option
                      placeholder="请选择或填入">
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
                  <el-form-item label="系统名称" prop="alarmType">
                    <el-select
                      v-model="form.alarmType"
                      style="width:85%"
                      clearable
                      placeholder="请选择">
                      <el-option
                        v-for="item in options.systemName"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"/>
                    </el-select>
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
                    <el-input
                      v-model="form.eqSubtypes"
                      style="max-width:85%"
                      placeholder="请输入内容"
                      clearable/>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="设备类型编码" prop="eqTypeCode">
                    <el-input
                      v-model="form.eqTypeCode"
                      style="max-width:85%"
                      placeholder="请输入内容"
                      clearable/>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="16">
                  <el-form-item label="描述" prop="eqDescription">
                    <el-input
                      :rows="2"
                      v-model="form['eqDescription']"
                      :autosize="{minRows:3}"
                      :maxlength="250"
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
                    <el-button type="primary" @click="onSubmit">{{ eqTypeId?'保存':'创建' }}</el-button>
                    <el-button @click="reset">{{ eqTypeId?'重置':'清除' }}</el-button>
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
  getCategoryOptions,
  getEquipmentCategoryData,
  updateEquipmentCategoryData,
  addEquipmentCategoryData
} from '@/api/equipment/category'

export default {
  components: {

  },
  filters: {
  },
  data() {
    let eqTypeId
    return {
      options: {
        systemName: [],
        category: []
      },
      eqTypeId,
      isLoading: false,
      form: {
        eqStd: '',
        alarmType: '',
        eqSubtypes: '',
        eqTypeCode: '',
        eqDescription: ''
      },
      formRules: {
        alarmType: [
          { required: true, message: '请输入系统名称' }
        ],
        eqStd: [
          { required: true, message: '请输入设备类型' }
        ],
        eqTypeCode: [
          { required: true, message: '请输入设备类型编码' }
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
      if (this.eqTypeId) {
        this.getDetails()
      } else {
        this.form = {
          eqStd: '',
          alarmType: '',
          eqSubtypes: '',
          eqTypeCode: '',
          eqDescription: ''
        }
        this.$refs['form'].resetFields()
      }
    },
    async onSubmit() {
      this.isLoading = true
      try {
        await this.$refs['form'].validate()
        const body = {
          alarmType: this.form['alarmType'],
          eqStd: this.form['eqStd'],
          eqSubtypes: this.form['eqSubtypes'],
          eqTypeCode: this.form['eqTypeCode'],
          eqDescription: this.form['eqDescription']
        }
        // if (!body.eqSubtypes) {
        //   body.eqSubtypes = null
        // }
        if (this.eqTypeId) {
          body['eqTypeId'] = this.eqTypeId
          await updateEquipmentCategoryData(body)
        } else {
          await addEquipmentCategoryData(body)
        }
        this.$message({
          message: `${this.eqTypeId ? '保存' : '创建'}成功！`,
          type: 'success'
        })
        this.reset()
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
          eqTypeId: this.eqTypeId
        }
        const r = await getEquipmentCategoryData(params)
        this.form['eqTypeId'] = r['data']['eqTypeId']
        this.form['alarmType'] = r['data']['alarmType']
        this.form['eqStd'] = r['data']['eqStd']
        this.form['eqSubtypes'] = r['data']['eqSubtypes']
        this.form['eqTypeCode'] = r['data']['eqTypeCode']
        this.form['eqDescription'] = r['data']['eqDescription']
      } catch (e) {
        console.log(e)
      } finally {
        this.isLoading = false
      }
    },
    init() {
      const eqTypeId = this.$route.params['eqTypeId']
      if (eqTypeId) {
        this.eqTypeId = eqTypeId
        this.getDetails()
      }
      this.getOptions()
    }
  }
}
</script>

<style>

</style>

