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
          ref="editorRule"
          :rules="editorRule"
          :model="editor"
          label-width="110px"
          label-position="right">
          <el-row :gutter="15">
            <el-col :span="8">
              <el-form-item label="设备编码:" prop="eqId">
                <el-input
                  v-model="editor['eqId']"
                  :disabled="eqIdDisabled"
                  clearable
                  placeholder="请输入设备编码"/>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="设备类型:" prop="eqStd">
                <el-select
                  v-model="editor['eqStd']"
                  clearable
                  filterable
                  default-first-option
                  placeholder="请选择或输入关键字"
                  @clear="getEqTypeList"
                  @change="getEquipmentAlarmeqSubtypesData">
                  <el-option
                    v-for="(item,index) in eqStdData"
                    :key="index"
                    :label="item.label"
                    :value="item.value"/>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item prop="eqSubtypes">
                <template slot="label">
                  <i class="el-icon-circle-plus-outline"/>
                  子类型
                </template>
                <el-select
                  v-model="editor['eqSubtypes']"
                  :disabled="eqSubtypesDisabled"
                  :placeholder="eqSubtypesDisabled ? '无子类型':'请选择子类型'"
                  clearable
                  filterable
                  default-first-option>
                  <el-option
                    v-for="(item,index) in eqSubtypesData"
                    :key="index"
                    :label="item.label"
                    :value="item.value"/>
              </el-select></el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="15">
            <el-col :span="8">
              <el-form-item label="设备状态:" prop="status">
                <el-select
                  v-model="editor['status']"
                  clearable
                  filterable
                  default-first-option
                  placeholder="请选择或输入关键字">
                  <el-option label="待检" value="待检"/>
                  <el-option label="待修" value="待修"/>
                  <el-option label="报废" value="报废"/>
                  <el-option label="在保" value="在保"/>
                  <el-option label="过保" value="过保"/>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="供应商:" prop="vnId">
                <el-input
                  v-model="editor['vnId']"
                  clearable
                  placeholder="请输入供应商"/>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="地点:" prop="position">
                <el-cascader
                  :props="props"
                  v-model="editor['position']"
                  filterable
                  clearable
                  default-first-option
                  placeholder="请选择或输入关键字"/>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="15">
            <el-col :span="8">
              <el-form-item label="供应商电话:" prop="link">
                <el-input
                  v-model="editor['link']"
                  clearable
                  placeholder="请输入供应商电话"/>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="型号:" prop="modelno">
                <el-input
                  v-model="editor['modelno']"
                  clearable
                  placeholder="请输入型号"/>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="生产单位:" prop="mfr">
                <el-input
                  v-model="editor['mfr']"
                  clearable
                  placeholder="请输入制造商"/>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="15">
            <el-col :span="8">
              <el-form-item label="采购日期:" prop="datePurchased">
                <el-date-picker
                  v-model="editor['datePurchased']"
                  :picker-options="datePurchasedOptions"
                  type="date"
                  clearable
                  value-format="yyyy-MM-dd"
                  placeholder="请选择采购日期"/>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="上次仪表读数:" label-width="70" prop="meter">
                <el-input
                  v-model="editor['meter']"
                  clearable
                  placeholder="请输入上次仪表读数"/>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="45">
            <el-col :span="12" align="right">
              <el-button
                class="save"
                type="primary"
                @click="submit">{{ Object.is(eqIdDisabled, true) ? '保存' : '创建' }}</el-button>
            </el-col>
            <el-col :span="12">
              <el-button
                plain
                class="save"
                @click="remove">{{ Object.is(eqIdDisabled, true) ? '重置' : '清除' }}</el-button>
            </el-col>
          </el-row>
        </el-form>
      </el-card>
    </el-main>
  </el-container>
</template>

<script>
import { phoneReg } from '@/utils/validate/reg'

import { getAllBuildingDataById } from '@/api/enumeration'

import { getEquipmentAlarmeqSubtypesData } from '@/api/equipment/alarm'

import {
  eqTypeList,
  addEquipment,
  equipmentFindById,
  modifyEquipment
} from '@/api/equipment/definition'

export default {
  data() {
    const meterChange = (rule, value, callback) => {
      const regular = /^\d{0,8}(\.\d{0,3})?$/g
      if (value === 0) {
        return callback()
      }
      if (!value) {
        return callback(new Error('仪表读数不能为空'))
      }
      if (!regular.test(value)) {
        return callback(new Error('仪表读数只能输入3位小数和一个点'))
      }
      callback()
    }
    return {
      // 采购日期限制
      datePurchasedOptions: {
        disabledDate: (time) => {
          return time.getTime() > Date.now()
        }
      },
      // 设备编码禁用
      eqIdDisabled: false,
      // 子类型禁用
      eqSubtypesDisabled: false,
      // 设备类型数据
      eqStdData: [],
      // 子类型下拉框
      eqSubtypesData: [],
      editor: {
        eqSubtypes: '',
        meter: 0
      },
      // 保存判断
      editorRule: {
        // 设备编码
        eqId: [
          { required: true, message: '请输入设备编码', trigger: 'blur' }
        ],
        // 设备类型
        eqStd: [
          { required: true, message: '请选择设备类型', trigger: 'blur' }
        ],
        // 设备状态
        status: [
          { required: true, message: '请选择设备状态', trigger: 'blur' }
        ],
        // 地点
        position: [
          { required: true, message: '请选择位置信息', trigger: 'blur' }
        ],
        // 供应商电话
        link: [
          { message: '请输入正确的固定电话或手机号', pattern: phoneReg, trigger: 'blur' }
        ],
        // 仪表读数
        meter: [
          { required: true, validator: meterChange, trigger: 'blur' }
        ]
      },
      props: {
        label: 'name',
        lazy: true,
        checkStrictly: true,
        expandTrigger: 'hover',
        async lazyLoad(node, resolve) {
          const { data } = node
          if (data && data.children && data.children.length !== 0) {
            return resolve([])
          }
          const params = {
          }
          if (data) {
            params['blId'] = data['blId'] || ''
            params['flId'] = data['flId'] || ''
          }
          try {
            const r = await getAllBuildingDataById(params)
            const targetData = []
            for (const item of r.data) {
              const temp = {
                blId: item['blId'] || '',
                flId: item['flId'] || '',
                rmId: item['rmId'] || '',
                name: item['name'] || '未命名',
                leaf: item['leaf'],
                children: item['children'] || []
              }
              temp['value'] = temp['rmId'] || temp['flId'] || temp['blId']
              targetData.push(temp)
            }
            resolve(targetData)
          } catch (e) {
            console.log(e)
            resolve([])
          }
        }
      }
    }
  },
  computed: {},
  created() {
  },
  async mounted() {
    if (!Object.is(this.$route.params.eqId, 'add')) {
      this.eqIdDisabled = true
      this.equipmentFindById()
    }
    this.getEqTypeList()
  },
  methods: {
    // 设备类型下拉框
    async getEqTypeList() {
      try {
        const r = await eqTypeList()
        this.eqStdData = r['data'].map((item) => {
          return {
            label: item,
            value: item
          }
        })
        // console.log(this.eqStdData)
      } catch (error) {
        console.log(error)
      }
    },
    // 设备类型对应的子类型
    async getEquipmentAlarmeqSubtypesData() {
      try {
        const params = {
          eqStd: this.editor['eqStd']
        }
        const r = await getEquipmentAlarmeqSubtypesData(params)
        if (!Object.is(r['data'].length, 0)) {
          this.editor['eqSubtypes'] = ''
          this.eqSubtypesDisabled = false
          this.eqSubtypesData = r['data'].map((item) => {
            return {
              label: item,
              value: item
            }
          })
          return
        }
        this.eqSubtypesDisabled = true
        // console.log(this.eqSubtypesData)
      } catch (error) {
        console.log(error)
      }
    },
    // 根据设备编码查询数据
    async equipmentFindById() {
      try {
        const params = {
          eqId: this.$route.params.eqId
        }
        const r = await equipmentFindById(params)
        this.editor = r['data']
        this.editor['position'] = []
        if (r['data']['blId']) {
          this.editor['position'].push(r['data']['blId'])
        }
        if (r['data']['flId']) {
          this.editor['position'].push(r['data']['flId'])
        }
        if (r['data']['rmId']) {
          this.editor['position'].push(r['data']['rmId'])
        }
      } catch (error) {
        console.log(error)
      } finally {
        if (!Object.is(this.editor['eqStd'], '') || !Object.is(this.editor['eqStd'], null)) {
          this.getEquipmentAlarmeqSubtypesData()
        }
      }
    },
    // 创建
    async submit() {
      try {
        await this.$refs['editorRule'].validate()
        const data = {
          eqId: this.editor['eqId'],
          blId: this.editor['position'][0],
          flId: this.editor['position'][1] || '',
          rmId: this.editor['position'][2] || '',
          eqStd: this.editor['eqStd'],
          eqSubtypes: this.editor['eqSubtypes'],
          status: this.editor['status'],
          modelno: this.editor['modelno'],
          mfr: this.editor['mfr'],
          vnId: this.editor['vnId'],
          link: this.editor['link'],
          datePurchased: this.editor['datePurchased'],
          meter: this.editor['meter']
        }
        let message = ''
        if (Object.is(this.$route.params.eqId, 'add')) {
          message = '新建成功！'
          await addEquipment(data)
          this.$refs['editorRule'].resetFields()
        } else {
          message = '保存成功！'
          await modifyEquipment(data)
          this.equipmentFindById()
        }
        this.$message({
          message: message,
          type: 'success'
        })
      } catch (error) {
        console.log(error)
      }
    },
    // 清除
    remove() {
      if (Object.is(this.$route.params.eqId, 'add')) {
        this.$refs['editorRule'].resetFields()
        return
      }
      this.equipmentFindById()
    }
  }
}
</script>

<style scoped>
  .el-container{
    margin: 30px 30px 0;
  }

  .el-input{
    width: 200px;
  }

  .save{
    margin-top: 50%;
  }
</style>
