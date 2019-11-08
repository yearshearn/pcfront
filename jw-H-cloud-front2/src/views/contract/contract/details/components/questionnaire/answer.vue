<template style="height:100%">
  <el-collapse-item :name="arrIndex" >
    <template slot="title" >
      <h2>第{{ arrIndex + 1 }}项：</h2>
    </template>
    <el-form label-position="left" style="padding-top:20px;padding-left:15px">
      <el-row :gutter="10">
        <el-col :span="24" >
          <el-form-item label="条款编码：">
            <el-input v-model="clauseData['cla_id']" disabled style="max-width:230px"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="4" >
          <el-form-item label="条款类型：">
            <el-select v-model="clauseData['cla_type']" :readonly = "!canEdit" style="max-width:100px" >
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
          <el-form-item label="执行次数：">
            <el-input-number v-model="clauseData['exe_times']" :min="1" :disabled = "!canEdit" style="max-width:150px"/>
          </el-form-item>
        </el-col>
        <el-col :span="5" >
          <el-form-item label="间隔次数：">
            <el-input-number v-model="clauseData['interval_times']" :min="1" :disabled = "!canEdit" style="max-width:150px"/>
          </el-form-item>
        </el-col>
        <el-col :span="10" >
          <el-form-item label="循环方式：">
            <el-row :gutter="5">
              <el-col :span="8">
                <el-form-item label="每">
                  <el-select v-model="clauseData['cir_mode']" :readonly = "!canEdit" style="max-width:100px">
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
                  <el-select v-model="clauseData['cir_date']" :readonly = "!canEdit" style="max-width:100px">
                    <el-option
                      v-for="(item,key) in clauseData['cir_mode'] == 'week' ? dayArr:monthDayArr "
                      :disabled="!canEdit"
                      :key="key"
                      :label="item.label"
                      :value="item.value"/>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="2">
                <el-form-item :label="clauseData['cir_mode'] == 'month' ? '号':''"/>
              </el-col>
            </el-row>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-form-item label="绑定的地点或设备："/>
        <el-row v-for="(item, index) in clauseData['places']" :key="index" style="padding-left:15px">
          <el-col :span="4">
            <el-form-item label="大楼：">
              <el-select v-model="item['blid']" :readonly = "!canEdit" style="max-width:110px">
                <el-option
                  v-for="(item,key) in tempBlArr"
                  :disabled="!canEdit"
                  :key="key"
                  :label="item.label"
                  :value="item.value"/>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="楼层：">
              <el-select v-model="item['flid']" :readonly = "!canEdit" style="max-width:130px">
                <el-option
                  v-for="(item,key) in tempFlArr"
                  :disabled="!canEdit"
                  :key="key"
                  :label="item.label"
                  :value="item.value"/>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="房间：">
              <el-select v-model="item['rmid']" :readonly = "!canEdit" style="max-width:100px">
                <el-option
                  v-for="(item,key) in tempRmArr"
                  :disabled="!canEdit"
                  :key="key"
                  :label="item.label"
                  :value="item.value"/>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="设备：">
              <el-select v-model="item['device']" :readonly = "!canEdit">
                <el-option
                  v-for="(item,key) in tempDeviceArr"
                  :disabled="!canEdit"
                  :key="key"
                  :label="item.label"
                  :value="item.value"/>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="2">
            <el-button :disabled = "!canEdit" type="danger" @click="deletePlaces(index)">删除</el-button>
          </el-col>
        </el-row>
        <el-button :disabled = "!canEdit" type="primary" style="margin-bottom:15px" @click="addPlaces">新增地点/设备</el-button>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="条款内容：">
            <el-input v-model="clauseData['cla_content']" :readonly = "!canEdit" :autosize="true" resize="none" type="textarea"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col v-if="!canEdit" :span="2">
          <el-button @click="changeCanEdit">修改</el-button>
        </el-col>
        <el-col v-if="canEdit" :span="4">
          <el-button @click="cancelSave">取消</el-button>
          <el-button type="primary" @click="save">保存</el-button>
        </el-col>
      </el-row>
    </el-form>
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

export default {
  name: 'Answer',
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
    }
  },
  data() {
    return {
      enumerationVal: {
        bl: [],
        fl: [],
        rm: []
      },
      dayArr,
      monthDayArr,
      claTypeArr,
      claModeArr,
      tempBlArr,
      tempFlArr,
      tempRmArr,
      tempDeviceArr,
      activeNames: [],
      canEdit: false
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
  },
  methods: {
    deletePlaces(i) {
      // console.log(i)
      this.clauseData['places'].splice(i, 1)
    },
    addPlaces() {
      this.clauseData['places'].push({
        blid: '',
        flid: '',
        rmid: '',
        device: ''
      })
    },
    changeCanEdit() {
      this.canEdit = !this.canEdit
    },
    save() {
      this.canEdit = false
    },
    cancelSave() {
      this.canEdit = false
    }
  }
}
</script>

