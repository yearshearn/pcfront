<template>
  <el-container>
    <!-- <el-header>
      <el-row>
        <el-col>
          <el-button type="" @click="back">
            返回
          </el-button>
        </el-col>
      </el-row>
    </el-header> -->
    <el-main>
      <el-form ref="checkData" :rules="checkData" :model="eyPara" label-position="left" label-width="100px">
        <el-card >
          <el-row :gutter="15">
            <el-col :span="12" :gutter="15">
              <el-form-item label="异常电表设定" />
              <el-form-item label="电能单价:" prop="amRate" >
                <el-input-number :controls="false" v-model="eyPara.amRate" placeholder="输入电能单价" clearable />
              </el-form-item>
              <el-form-item label="同比阈值:" prop="amErrYear">
                <el-input v-model="eyPara.amErrYear" placeholder="输入同比阈值" clearable/>
              </el-form-item>
              <!-- <el-form-item label="环比阈值:" prop="amErrChain">
                <el-input v-model="eyPara.amErrChain" placeholder="输入环比阈值" clearable/>
              </el-form-item> -->
            </el-col>
            <el-col :span="12" :gutter="15">
              <el-form-item label="异常水表设定" />
              <el-form-item label="水能单价:" prop="wmRate" >
                <el-input-number :controls="false" v-model="eyPara.wmRate" placeholder="输入水能单价" clearable />
              </el-form-item>
              <el-form-item label="同比阈值:" prop="wmErrYear">
                <el-input v-model="eyPara.wmErrYear" placeholder="输入同比阈值" clearable/>
              </el-form-item>
              <!-- <el-form-item label="环比阈值:" prop="wmErrChain">
                <el-input v-model="eyPara.wmErrChain" placeholder="输入环比阈值" clearable/>
              </el-form-item> -->
            </el-col>
          </el-row>
          <el-row>
            <el-col align="center">
              <el-form-item >
                <el-button
                  v-loading="isLoading"
                  type=""
                  class="save"
                  @click.native.prevent="save">{{ isLoading ? '保存中' : '保 存' }}</el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-card>
      </el-form>
    </el-main>
  </el-container>
</template>
<style>
.el-row {
  margin-bottom: 20px;
}

.el-col {
  border-radius: 4px;
}
.el-input{
  width: 320px;
}
/* .save{
  margin-top: 30%;
} */

</style>
<script>
import { eyParameter,
  eyParamData
} from '@/api/energy/energy'

export default {

  data() {
    const blurText = async(rule, value, callback) => {
      const boolean = new RegExp('^[1-9][0-9]*$').test(value)
      // console.log(boolean)
      if (!boolean) {
        this.$message.warning('请输入正整数')
        this.eyPara.amErrYear = ''
      }
    }
    return {
      isLoading: false,
      eyPara: {
        amRate: 0,
        wmRate: 0,
        amErrYear: '',
        amErrChain: '',
        wmErrYear: '',
        wmErrChain: ''
      },
      checkData: {
        amRate: [
          { required: true, message: '输入电能单价', trigger: 'blur' }
        ],
        wmRate: [
          { required: true, message: '输入水能单价', trigger: 'blur' }
        ],
        amErrYear: [
          { required: true, message: '输入同比阈值', trigger: 'blur' },
          { validator: blurText, trigger: 'blur' }
        ],
        amErrChain: [
          { required: true, message: '输入环比阈值', trigger: 'blur' },
          { validator: blurText, trigger: 'blur' }
        ],
        wmErrYear: [
          { required: true, message: '输入同比阈值', trigger: 'blur' },
          { validator: blurText, trigger: 'blur' }
        ],
        wmErrChain: [
          { required: true, message: '输入环比阈值', trigger: 'blur' },
          { validator: blurText, trigger: 'blur' }
        ]
      }

    }
  },
  mounted() {
    this.getData()
  },
  methods: {
    // back() {
    //   this.$router.go(-1)
    // },
    async getData() {
      this.isLoading = true
      try {
        const r = await eyParamData()
        console.log(r)
        this.eyPara.amRate = r.data.amRate
        this.eyPara.wmRate = r.data.wmRate
        this.eyPara.amErrYear = r.data.amErr
        this.eyPara.wmErrYear = r.data.wmErr
      } catch (e) {
        console.log(e)
      } finally {
        this.isLoading = false
      }
    },
    async  save() {
      try {
        this.isLoading = true
        const body = {
          amRate: this.eyPara.amRate,
          wmRate: this.eyPara.wmRate,
          amErr: this.eyPara.amErrYear,
          wmErr: this.eyPara.wmErrYear
        }
        console.log(body)
        const r = await eyParameter(body)
        console.log(r)
      } catch (e) {
        console.log(e)
      } finally {
        this.isLoading = false
      }
      // console.log(123)
    }
  }
}
</script>
