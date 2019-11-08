<template style="height:100%">
  <el-row>
    <el-col :span="6">
      <el-form-item
        label-width="50px"
        label="大楼:">
        <el-select
          v-model="item['blId']"
          :readonly = "!canEdit"
          style="width:90%"
          @change="dataChange('fl')">
          <el-option
            v-for="(item,key) in blData"
            :disabled="!canEdit"
            :key="key"
            :label="item.label"
            :value="item.value"/>
        </el-select>
      </el-form-item>
    </el-col>
    <el-col :span="6">
      <el-form-item label-width="50px" label="楼层:">
        <el-select
          v-model="item['flId']"
          :readonly = "!canEdit"
          style="width:90%"
          @change="dataChange('rm')">
          <el-option
            v-for="(item,key) in flData"
            :disabled="!canEdit"
            :key="key"
            :label="item.label"
            :value="item.value"/>
        </el-select>
      </el-form-item>
    </el-col>
    <el-col :span="5">
      <el-form-item label-width="50px" label="房间:">
        <el-select
          v-model="item['rmId']"
          :readonly = "!canEdit"
          style="width:90%"
          @change="dataChange('device')">
          <el-option
            v-for="(item,key) in rmData"
            :disabled="!canEdit"
            :key="key"
            :label="item.label"
            :value="item.value"/>
        </el-select>
      </el-form-item>
    </el-col>
    <el-col v-if="claType == 'device'" :span="5">
      <el-form-item label-width="50px" label="设备:">
        <el-select
          v-model="item['eqId']"
          :readonly = "!canEdit"
          style="width:90%">
          <el-option
            v-for="(item,key) in deviceData"
            :disabled="!canEdit"
            :key="key"
            :label="item.eqStd"
            :value="item.eqId"/>
        </el-select>
      </el-form-item>
    </el-col>
    <el-col :span="2">
      <el-button v-if = "canEdit" type="danger" @click="deletePlace(arrKey,item['id'])">删除</el-button>
    </el-col>
  </el-row>
</template>

<script>
import { getAllBuildingDataById } from '@/api/enumeration'

import { findByEquipment } from '@/api/equipment/definition'

export default {
  name: 'Clause',
  filters: {

  },
  props: {
    typeMode: {
      type: String,
      default: ''
    },
    arrKey: {
      type: Number,
      default: null
    },
    deletePlace: {
      type: Function,
      default: null
    },
    item: {
      type: Object,
      default: () => {}
    },
    canEdit: {
      type: Boolean,
      default: false
    },
    claType: {
      type: String,
      default: ''
    },
    blData: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      flData: [],
      rmData: [],
      deviceData: []
    }
  },
  watch: {
    typeMode() {
    }
  },
  created() {
  },
  async mounted() {
    this.init()
  },
  methods: {
    async init() {
      let r
      const params = {}
      if (this.item['blId']) {
        params['blId'] = this.item['blId']
        r = await getAllBuildingDataById(params)
        this.flData = this.transformData(r['data'], 'flId')
      }
      if (this.item['flId']) {
        params['flId'] = this.item['flId']
        r = await getAllBuildingDataById(params)
        this.rmData = this.transformData(r['data'], 'rmId')
      }
      if (this.item['rmId']) {
        params['rmId'] = this.item['rmId']
        r = await findByEquipment(params)
        this.deviceData = r['data']
      }
    },
    transformData(data, key) {
      return data.map(i => {
        return {
          label: i['name'],
          value: i[key]
        }
      })
    },
    async dataChange(target) {
      try {
        const params = {
          blId: this.item['blId']
        }
        if (target === 'rm') {
          params['flId'] = this.item['flId']
        }
        if (target === 'device') {
          params['flId'] = this.item['flId']
          params['rmId'] = this.item['rmId']
        }
        const r = await getAllBuildingDataById(params)
        const eqData = await findByEquipment(params)
        if (target === 'fl') {
          this.flData = this.transformData(r['data'], 'flId')
          this.item['flId'] = ''
          this.item['rmId'] = ''
          this.item['eqId'] = ''
        }
        if (target === 'rm') {
          this.rmData = this.transformData(r['data'], 'rmId')
          this.item['rmId'] = ''
          this.item['eqId'] = ''
        }
        if (target === 'device') {
          this.item['eqId'] = ''
        }
        this.deviceData = eqData['data']
      } catch (e) {
        console.log(e)
      }
    }
  }
}
</script>

