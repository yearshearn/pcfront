<template style="height:100%">
  <div>
    <el-button type="primary" @click="showSuppDialog">请选择</el-button>
    <el-dialog
      :visible="suppDialogFalg"
      :before-close="closeSuppDialog"
      title="选择供应商"
      width="60%"
      center>
      <el-row>
        <el-col :span="2" :offset="22">
          <el-button
            style="margin-bottom:10px"
            type="primary"
            @click="addSupp">添加</el-button>
        </el-col>

      </el-row>
      <el-row>
        <el-col :span="24">
          <el-table :data="suppTableData" border stripe>
            <el-table-column
              align="center"
              label="备件供应商">
              <template slot-scope="{row}">
                <el-select
                  v-model="row['vnId']"
                  style="width:100%"
                  placeholder="请选择"
                  clearable
                >
                  <el-option
                    v-for="item in conSuppTypesArrL"
                    :key="item.vnId"
                    :label="item.company"
                    :value="item.vnId"/>
                </el-select>
              </template>
            </el-table-column>
            <!-- <el-table-column
              align="center"
              label="状态">
              <template slot-scope="{row}">
                <el-switch
                  v-model="row['state']"
                  :active-value="1"
                  :inactive-value="0"
                  disabled
                  active-text="开"
                  inactive-text="关"/>
              </template>

            </el-table-column> -->
            <el-table-column
              align="center"
              label="交付天数">
              <template slot-scope="{row}">
                <el-input-number :controls="false" v-model="row['leadTime']" :min="0" placeholder="请输入交付天数"/>
              </template>
            </el-table-column>
            <!-- <el-table-column
              align="center"
              label="备件供应商编码">
              <template slot-scope="{row}">
                <el-input v-model="row['vnPtNum']" placeholder="请输入备件编码"/>
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              width="200"
              label="操作">
              <template slot-scope="scope">
                <el-button type="danger" size="mini" @click="deleteSupp(scope.$index)">删除</el-button>
              </template>
            </el-table-column> -->
          </el-table>
        </el-col>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeSuppDialog">取 消</el-button>
        <el-button :disabled="isUpload" type="primary" @click="updateSuppHandler">确 定</el-button>
      </span>

    </el-dialog>
  </div>
</template>

<script>
import { optionSupplier } from '@/api/part'
export default {
  name: 'Supp',
  filters: {

  },
  props: {
    suppData: {
      type: Array,
      default: null
    },
    clearFormValidateByProp: {
      type: Function,
      default: null
    },
    updateSupp: {
      type: Function,
      default: null
    }
  },
  data() {
    return {
      hash: {},
      suppTableData: [],
      conSuppTypesArrL: [],
      isUpload: false,
      suppDialogFalg: false
      // id: 0
    }
  },
  computed: {
  },
  watch: {
    suppDialogFalg(v) {
      if (v) {
        var supps = JSON.parse(JSON.stringify(this.suppData))
        this.suppTableData = []
        if (supps) {
          supps.forEach((item, index) => {
            this.suppTableData.push({
              'vnId': item.vnId,
              //   'state': item.state,
              'code': item.vnPtNum,
              'leadTime': item.leadTime
            //   'vnPtNum': item.vnPtNum
            })
          })
        }

        //   console.log(this.suppTableData)
        this.getType()
        this.clearFormValidateByProp('vendors')
      }
    },
    suppData: {
      deep: true,
      handler(v, o) {
        var supps = JSON.parse(JSON.stringify(this.suppData))
        this.suppTableData = []
        if (supps) {
          supps.forEach((item, index) => {
            this.suppTableData.push({
              'vnId': item.vnId,
              //   'state': item.state,
              //   'code': item.vnPtNum,
              'leadTime': item.leadTime
            })
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
    async getType() {
      try {
        const result = await optionSupplier()
        this.conSuppTypesArrL = result.data
        result.data.forEach((item) => {
          this.hash[item.vnId] = item.state
        })
      } catch (err) {
        console.log(err)
      } finally {
        console.log(1)
      }
    },
    addSupp() {
      this.suppTableData.push({
        vnId: '',
        //   state: 1,
        leadTime: ''
      //   vnPtNum: ''
      })
    },
    async closeSuppDialog() {
      this.suppDialogFalg = false
      this.isUpload = false
    },
    async showSuppDialog() {
      this.suppDialogFalg = true
    },
    //  deleteSupp(i) {
    //    this.suppTableData.splice(i, 1)
    //  },
    async updateSuppHandler() {
      this.isUpload = true
      try {
        await this.updateSupp(this.suppTableData)
        this.closeSuppDialog()
      } catch (e) {
        console.log(e)
      } finally {
        this.isUpload = false
      }
    }
  }
}
</script>

