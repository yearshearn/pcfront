<template style="height:100%">
  <div>
    <el-button type="primary" size="middle" @click="showPartDialog">详情</el-button>
    <el-dialog
      :visible="partDialogFalg"
      :before-close="closePartDialog"
      title="备件详情"
      width="60%"
      center>
      <!-- <el-row>
        <el-col :span="2" :offset="22">
          <el-button
            style="margin-bottom:10px"
            type="primary"
            @click="addPart">添加</el-button>
        </el-col>
      </el-row> -->
      <el-row>
        <el-col :span="24">
          <el-table :data="partTableData" border stripe>
            <el-table-column
              align="center"
              label="备件编号">
              <template slot-scope="{row}">
                <el-input v-model="row['vnPtNum']" readonly/>
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              label="备件">
              <template slot-scope="{row}">
                <el-input v-model="row['partId']" readonly/>
                <!-- <el-select
                  v-model="row['partId']"
                  style="width:100%"
                  filterable
                  placeholder="请选择"
                  clearable
                >
                  <el-option
                    v-for="item in conPartTypesArrL"
                    :key="item.partId"
                    :label="item.name"
                    :value="item.partId"/>
                </el-select> -->
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              label="交付天数">
              <template slot-scope="{row}">
                <el-input-number
                  v-model="row['leadTime']"
                  :controls="false"
                  :min="1"
                  :max="999"
                  placeholder="请输入交付天数"
                  @change="checkNo(leadTime)"
                />
              </template>
            </el-table-column>
            <!-- <el-table-column
              align="center"
              width="200"
              label="操作">
              <template slot-scope="scope">
                <el-button type="danger" size="mini" @click="deletePart(scope.$index)">删除</el-button>
              </template>
            </el-table-column> -->
          </el-table>
        </el-col>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closePartDialog">取 消</el-button>
        <el-button :disabled="isUpload" type="primary" @click="updatePartHandler">确 定</el-button>
      </span>

    </el-dialog>
  </div>
</template>

<script>
import { optionPart } from '@/api/part'
export default {
  name: 'Part',
  filters: {

  },
  props: {
    partData: {
      type: Array,
      default: null
    },
    clearFormValidateByProp: {
      type: Function,
      default: null
    },
    updatePart: {
      type: Function,
      default: null
    }
  },
  data() {
    return {
      vnPtNum: '',
      leadTime: '',
      hash: {},
      partTableData: [],
      conPartTypesArrL: [],
      isUpload: false,
      partDialogFalg: false
    }
  },
  computed: {
  },
  watch: {
    partDialogFalg(v) {
      if (v) {
        var pats = JSON.parse(JSON.stringify(this.partData))
        this.partTableData = []
        if (pats) {
          pats.forEach((item, index) => {
            this.partTableData.push({
              'state': 1,
              'partId': item.partId,
              'vnPtNum': item.vnPtNum,
              'leadTime': item.leadTime })
          })
        }

        this.getType()
        this.clearFormValidateByProp('parts')
      }
    },
    partData: {
      deep: true,
      handler(v, o) {
        console.log(this.partData)
        var pats = JSON.parse(JSON.stringify(this.partData))
        this.partTableData = []
        if (pats) {
          pats.forEach((item, index) => {
            this.partTableData.push({
              'state': 1,
              'partId': item.partId,
              'vnPtNum': item.vnPtNum,
              'leadTime': item.leadTime })
          })
        }
      }
    }
  },
  created() {
  },
  async mounted() {
    this.getType()
  },
  methods: {
    async  checkNo(value) {
      const reg = /^[1-9]\d*$/
      if (value) {
        if (value > 999999 || new RegExp(reg).test(value) === false) {
          setTimeout(() => {
            this.num = ''
          }, 500)
        }
      }
    },
    async getType() {
      try {
        const result = await optionPart()
        // console.log(result)
        this.conPartTypesArrL = result.data
        // console.log(this.conPartTypesArrL)
        if (result && result.data && result.data instanceof Array) {
          result.data.forEach((item) => {
            this.hash[item.partId] = item.state
          })
        }
      } catch (err) {
        console.log(err)
      } finally {
        // console.log(1)
      }
    },
    //  addPart() {
    //    this.partTableData.push({
    //      partId: '',
    //      leadTime: '',
    //      vnPtNum: ''
    //    })
    //  },
    async closePartDialog() {
      this.partDialogFalg = false
      this.isUpload = false
    },
    async showPartDialog() {
      this.partDialogFalg = true
    },
    deletePart(i) {
      this.partTableData.splice(i, 1)
    },
    async updatePartHandler() {
      this.isUpload = true
      try {
        await this.updatePart(this.partTableData)
        this.closePartDialog()
      } catch (e) {
        console.log(e)
      } finally {
        this.isUpload = false
      }
    }
  }
}
</script>

