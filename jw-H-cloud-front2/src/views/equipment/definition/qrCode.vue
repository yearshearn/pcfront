<template>
  <el-container>
    <el-header>
      <el-row>
        <el-col :span="2">
          <el-button @click="$router.go(-1)">返回</el-button>
        </el-col>
      </el-row>
    </el-header>
    <el-main>
      <el-card>
        <el-form>
          <el-row>
            <el-col v-for="(item,index) in qrCodeData" :span="12" :key="index">
              <el-form-item :label="'设备编码: ' + eqIdData[index]">
                <el-image
                  v-loading="qrCodeLoading"
                  :src="item"/>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-card>
    </el-main>
  </el-container>
</template>

<script>
import { QRCode } from '@/api/equipment/definition'

export default {
  data() {
    return {
      // 二维码图片等待
      qrCodeLoading: false,
      // 路由传的数组
      eqIdData: JSON.parse(this.$route.params.eqIdData),
      // 二维码图片数组
      qrCodeData: []
    }
  },
  computed: {},
  created() {},
  async mounted() {
    this.getQRCode()
  },
  methods: {
    async getQRCode() {
      this.qrCodeLoading = true
      try {
        const data = {
          eqId: this.eqIdData
        }
        const r = await QRCode(data)
        this.qrCodeData = r['data']
        // console.log(r['data'])
      } catch (error) {
        console.log(error)
      } finally {
        this.qrCodeLoading = false
      }
    }
  }
}
</script>

<style scoped>
  .el-container{
    margin: 30px 30px 0;
  }
</style>
