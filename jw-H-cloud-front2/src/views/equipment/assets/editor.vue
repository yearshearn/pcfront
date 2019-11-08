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
        <el-form
          ref="assetsRule"
          :rules="assetsRule"
          :model="assets"
          label-width="110px"
          label-position="right">
          <el-row :gutter="15">
            <el-col :span="12">
              <el-form-item label="设备编码:">
                <el-input
                  v-model="assets['eqId']"
                  disabled/>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="15">
            <el-col :span="12">
              <el-form-item label="设备类型:">
                <el-input
                  v-model="assets['eqStd']"
                  disabled/>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="设备类型编码:">
                <el-input
                  v-model="assets['eqTypeCode']"
                  disabled/>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="15">
            <el-col :span="12">
              <el-form-item>
                <template slot="label">
                  <i class="el-icon-circle-plus-outline"/>
                  子类型
                </template>
                <el-input
                  v-model="assets['eqSubtypes']"
                  disabled/>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="系统名称:">
                <el-input
                  v-model="assets['alarmType']"
                  disabled/>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="15">
            <el-col :span="12">
              <el-form-item label="资产编码" prop="assetNumber">
                <el-input
                  v-model="assets['assetNumber']"
                  placeholder="请输入资产编号"
                  clearable/>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="15">
            <el-col :span="12">
              <el-form-item label="生产单位:" prop="mfr">
                <el-input
                  v-model="assets['mfr']"
                  placeholder="请输入生产单位"
                  clearable/>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="采购价格(元):" prop="costPurchase">
                <el-input
                  v-model="assets['costPurchase']"
                  placeholder="请输入采购价格"
                  clearable/>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="15">
            <el-col :span="12">
              <el-form-item label="生产日期:" prop="dateManufactured">
                <el-date-picker
                  v-model="assets['dateManufactured']"
                  :picker-options="dateManufacturedOptions"
                  type="date"
                  clearable
                  value-format="yyyy-MM-dd"
                  placeholder="请选择生产日期"/>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="安装日期:" prop="dateInstalled">
                <el-date-picker
                  v-model="assets['dateInstalled']"
                  :picker-options="dateInstalledOptions"
                  type="date"
                  clearable
                  value-format="yyyy-MM-dd"
                  placeholder="请选择安装日期"/>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="15">
            <el-col :span="12">
              <el-form-item label="开始使用日期:" prop="dateInService">
                <el-date-picker
                  v-model="assets['dateInService']"
                  :picker-options="dateInServiceOptions"
                  type="date"
                  clearable
                  value-format="yyyy-MM-dd"
                  placeholder="请选择开始使用日期"/>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="保养周期(天):" prop="qtyPms">
                <el-input
                  v-model="assets['qtyPms']"
                  placeholder="请输入保养周期"
                  clearable/>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="15">
            <el-col :span="12">
              <el-form-item label="保质期(月):" prop="eqQgp">
                <el-input
                  v-model="assets['eqQgp']"
                  placeholder="请输入保养周期"
                  clearable/>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="使用年限(月):" prop="qtyLifeExpct">
                <el-input
                  v-model="assets['qtyLifeExpct']"
                  placeholder="请输入使用年限"
                  clearable/>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="15">
            <el-col :span="10">
              <el-form-item label="其他备注:" prop="comments">
                <el-input
                  :autosize="{ minRows: 3, maxRows: 3}"
                  v-model="assets['comments']"
                  type="textarea"
                  resize="none"
                  placeholder="请输入备注"/>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="45" class="save">
            <el-col :span="12" align="right">
              <el-button type="primary" @click="save">保存</el-button>
            </el-col>
            <el-col :span="12">
              <el-button @click="equipmentAssetsfindById">重置</el-button>
            </el-col>
          </el-row>
        </el-form>
      </el-card>
    </el-main>
  </el-container>
</template>

<script>
import {
  equipmentAssetsfindById,
  equipmentAssetsModify
} from '@/api/equipment/assets'

export default {
  data() {
    // 采购价格
    const costPurchaseChange = (rule, value, callback) => {
      const regular = /^\d{0,8}(\.\d{0,2})?$/g
      const number = /^-?\d*\.?\d*$/g
      if (!number.test(value) && value !== null) {
        return callback(new Error('请输入数字值'))
      }
      if (!regular.test(value) && value !== null) {
        return callback(new Error('采购价格只能输入正整数与2位小数和一个点'))
      }
      callback()
    }
    // 保养周期 保质期 使用年限
    const qtyPmsChange = (rule, value, callback) => {
      const number = /^\d{0,2}$/g
      if (!number.test(value) && value !== null) {
        return callback(new Error('请输入2位正整数'))
      }
      callback()
    }
    return {
      // 生产日期限制
      dateManufacturedOptions: {
        disabledDate: (time) => {
          if (this.assets['dateInstalled'] !== null) {
            return time.getTime() > new Date(this.assets['dateInstalled']).getTime()
          }
          if (this.assets['dateInService'] !== null) {
            return time.getTime() > new Date(this.assets['dateInService']).getTime()
          }
          return time.getTime() > Date.now()
        }
      },
      // 安装日期
      dateInstalledOptions: {
        disabledDate: (time) => {
          if (this.assets['dateManufactured'] !== null && this.assets['dateInService'] === null) {
            return time.getTime() < new Date(this.assets['dateManufactured']).getTime() || time.getTime() > Date.now()
          }
          if (this.assets['dateInService'] !== null) {
            return time.getTime() > new Date(this.assets['dateInService']).getTime() ||
            time.getTime() < new Date(this.assets['dateManufactured']).getTime()
          }
          return time.getTime() > Date.now()
        }
      },
      // 使用日期
      dateInServiceOptions: {
        disabledDate: (time) => {
          return time.getTime() > Date.now() || time.getTime() < new Date(this.assets['dateInstalled']).getTime() || time.getTime() < new Date(this.assets['dateManufactured']).getTime()
        }
      },
      assets: {},
      // 编辑资产验证
      assetsRule: {
        // 采购价格
        costPurchase: [
          { validator: costPurchaseChange, trigger: 'blur' }
        ],
        // 保养周期
        qtyPms: [
          { validator: qtyPmsChange, trigger: 'blur' }
        ],
        // 保质期
        eqQgp: [
          { validator: qtyPmsChange, trigger: 'blur' }
        ],
        // 使用年限
        qtyLifeExpct: [
          { validator: qtyPmsChange, trigger: 'blur' }
        ]
      }
    }
  },
  computed: {},
  created() {},
  async mounted() {
    this.equipmentAssetsfindById()
  },
  methods: {
    // 根据设备编码查询资产数据
    async equipmentAssetsfindById() {
      try {
        const params = {
          eqId: this.$route.params.eqId
        }
        const r = await equipmentAssetsfindById(params)
        this.assets = r['data']
        // console.log(r['data'])
      } catch (error) {
        console.log(error)
      }
    },
    // 保存
    async save() {
      try {
        await this.$refs['assetsRule'].validate()
        this.assets['costPurchase'] = Number(this.assets['costPurchase'])
        await equipmentAssetsModify(this.assets)
        this.$message({
          message: '保存成功！',
          type: 'success'
        })
      } catch (error) {
        console.log(error)
      } finally {
        this.equipmentAssetsfindById()
      }
    }
  }
}
</script>

<style scoped>
  .el-container{
    margin: 30px 30px 0;
  }

  .el-input{
    width: 50%;
  }

  .save{
    margin-top: 1%;
  }
</style>
