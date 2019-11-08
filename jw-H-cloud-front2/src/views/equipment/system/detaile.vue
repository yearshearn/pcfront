<template style="height:100%">
  <el-container style="padding:30px">
    <el-header>
      <el-row>
        <el-col :span="2">
          <el-button
            @click="$router.push('/equipment/system')"
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
          label-width="80px">
          <el-container>
            <el-main style="min-height:100px">
              <el-row>
                <el-col :span="8">
                  <el-form-item label="系统类别" prop="alarmType">
                    <el-input
                      :disabled = "alarmType?true:false"
                      v-model="form.alarmType"
                      style="max-width:85%"
                      placeholder="请输入内容"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="系统名称" prop="description">
                    <el-input
                      v-model="form.description"
                      style="max-width:85%"
                      placeholder="请输入内容"
                    />
                  </el-form-item>
                </el-col>
              </el-row>
            </el-main>
            <el-footer>
              <el-row>
                <el-col :span="24">
                  <el-form-item>
                    <el-button type="primary" @click="onSubmit">{{ alarmType?'保存':'创建' }}</el-button>
                    <el-button @click="reset">{{ alarmType?'重置':'清除' }}</el-button>
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
  getEquipmentSystemData,
  updateEquipmentSystemData,
  addEquipmentSystemData
} from '@/api/equipment/system'
export default {
  components: {

  },
  filters: {
  },
  data() {
    let alarmType
    return {
      alarmType,
      isLoading: false,
      form: {
        alarmType: '',
        description: ''
      },
      formRules: {
        alarmType: [
          { required: true, message: '请输入系统类别' }
        ],
        description: [
          { required: true, message: '请输入系统名称' }
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
    async reset() {
      if (this.alarmType) {
        this.getDetails()
      } else {
        this.$refs['form'].resetFields()
      }
    },
    async onSubmit() {
      this.isLoading = true
      try {
        await this.$refs['form'].validate()
        const body = {
          description: this.form['description']
        }
        if (this.alarmType) {
          body['alarmType'] = this.alarmType
          await updateEquipmentSystemData(body)
        } else {
          body['alarmType'] = this.form['alarmType']
          await addEquipmentSystemData(body)
        }
        this.$message({
          message: `${this.alarmType ? '保存' : '创建'}成功！`,
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
          alarmType: this.alarmType
        }
        const r = await getEquipmentSystemData(params)
        console.log(r)
        this.form['alarmType'] = r['data']['alarmType']
        this.form['description'] = r['data']['description']
      } catch (e) {
        console.log(e)
      } finally {
        this.isLoading = false
      }
    },
    init() {
      const alarmType = this.$route.params['alarmType']
      if (alarmType) {
        this.alarmType = alarmType
        this.getDetails()
      }
    }
  }
}
</script>

<style>

</style>

