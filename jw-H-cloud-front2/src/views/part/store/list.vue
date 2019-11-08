<template style="height:100%">
  <el-container style="padding:20px;margin-top:20px;width: 100%" >
    <el-header style="height:150px">
      <el-table
        :data="tableData"
        :row-style="tableStripeCallBack"
        fit
        highlight-current-row
        style="width: 100%"
      >
        <el-table-column
          align="center"
          prop="ptStoreLocName"
          show-overflow-tooltip
          label="主仓库名称" />
        <el-table-column
          align="center"
          prop="ptStoreLocDesc"
          show-overflow-tooltip
          label="描述信息" />
        <el-table-column
          align="center"
          prop="fcd"
          show-overflow-tooltip
          label="创建时间" />
        <el-table-column
          align="center"
          prop="fcu"
          show-overflow-tooltip
          label="创建人" />
        <el-table-column
          fixed="right"
          label="操作"
          align="center"
          width="400"
          class-name="small-padding fixed-width"
        >
          <template slot-scope="{row}">
            <el-button
              size="small"
              type="primary"
              @click="edit(row)"
            >修改</el-button>
            <el-button
              size="small"
              type="info "
              @click="see(row)"
            >查看</el-button>
            <!-- <el-button
              size="small"
              type="danger"
              plain
              @click="synchro(row)"
            >同步备件信息</el-button>
            <el-button
              size="small"
              type="success"
              @click="defind"
            >定义备件库存
            </el-button> -->
          </template>
        </el-table-column>
      </el-table>
    </el-header>

    <el-main>
      <div v-if="isLoading" style="width:100%">
        <el-card>
          <el-form
            ref="ruleForm"
            :model="visable"

            label-position="right"
            size="mini"

            label-width="150px">
            <el-row>
              <el-col :span="8">
                <el-form-item label="仓库名称：" >
                  <el-input v-model="visable.ptStoreLocName" readonly/>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row>
              <el-col :span="8">
                <el-form-item label="创建人：" >
                  <el-input v-model="visable.fcu" readonly/>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="8">
                <el-form-item label="创建时间：" >
                  <el-input v-model="visable.fcd" readonly/>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="8">
                <el-form-item label="所属大厦：" >
                  <el-input v-model="visable.blName" readonly />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="8">
                <el-form-item label="所属楼层：" >
                  <el-input v-model="visable.flName" readonly/>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="8">
                <el-form-item label="所在房间：" >
                  <el-input v-model="visable.rmName" readonly/>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="8">
                <el-form-item label="所在位置：" >
                  <el-input v-model="visable.siteName" readonly/>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="8">
                <el-form-item label="最后一次更新时间：" >
                  <el-input v-model="visable.lcd" readonly/>
                </el-form-item>

              </el-col>
            </el-row>
            <el-row>
              <el-col :span="8">
                <el-form-item label="更新人：" >
                  <el-input v-model="visable.lcu" readonly/>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="8">
                <el-form-item label="仓库描述：" >
                  <el-input
                    v-model="visable.ptStoreLocDesc"
                    type="textarea"
                    readonly
                  />
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
          <el-row>
            <el-col :span="8" :offset="4">
              <el-button type="primary" @click="closed" >关闭</el-button>
            </el-col>
          </el-row>
        </el-card>
      </div>
      <div v-if="isModify" >
        <el-card >
          <el-form
            ref="ruleForm"
            :model="ruleForm"
            :rules="rules"
            label-position="right"
            size="mini"
            label-width="120px">
            <el-row>
              <el-col :span="6">
                <el-form-item label="仓库名称:" prop="ptStoreLocName">
                  <el-input
                    v-model="ruleForm.ptStoreLocName"
                    maxlength="50"
                    show-word-limit
                    placeholder="请输入仓库名称" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col>
                <el-form-item label="仓库描述:">
                  <el-input
                    v-model="ruleForm.ptStoreLocDesc"
                    :autosize="{
                      minRows:10
                    }"
                    maxlength="255"
                    show-word-limit
                    resize="none"
                    type="textarea"
                    style="max-width:650px;"/>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="6" :offset="2">
                <el-button type="primary" @click="save">
                  保存
                </el-button>
                <el-button type="primary" @click="closeModify">
                  关闭
                </el-button>
              </el-col>
            </el-row>
          </el-form>
        </el-card>
      </div>
    </el-main>
  </el-container>
</template>

<script>
import { tableStripeCallBack } from '@/utils/style'

import {
  checkInit,
  findWarehouse,
  partStoreModify,
  checkWarehouseName
//   ,   definePart
} from '@/api/part'

export default {
  name: 'PartStoreList',
  components: {},
  filters: {},
  props: {},
  data() {
    const checkName = async(rule, value, callback) => {
      if (this.ruleForm.ptStoreLocId) {
        try {
          const params = {
            name: this.ruleForm.ptStoreLocName,
            id: this.ruleForm.ptStoreLocId
          }
          const r = await checkWarehouseName(params)
          if (r.data.is_success === false) {
            console.log(r.data.is_success)
            callback(new Error('仓库名已经存在'))
          }
        } catch (e) {
          callback(new Error('网络故障，请稍后重试'))
        }
      }
    }
    return {

      rules: {
        ptStoreLocName: [
          { required: true, message: '请输入主仓库名称' },
          { validator: checkName, trigger: 'blur' }
        ]
      },

      tableData: [],
      visable: {},
      // isList: true,
      isLoading: false,
      isModify: false,
      ruleForm: {
        ptStoreLocName: '',
        ptStoreLocDesc: '',
        fcd: '',
        fcu: '',
        ptStoreLocId: ''

      }

    }
  },
  computed: {},
  watch: {

  },
  created() { this.getData() },
  async mounted() {

  },
  methods: {
    // 表格隔行颜色
    tableStripeCallBack,
    async getData() {
      try {
        const r = await checkInit()
        // console.log(r)
        if (r.data.is_success === 'true') {
          //  this.isList = true
          this.tableData = []
          this.tableData.push(r.data.store)
          // console.log(this.tableData + '仓库')
        }
      //   else {
      //      this.isList = false
      //      this.isModify = true
      //   }
      } catch (err) {
        console.log(err)
      } finally {
        // console.log('备件仓库')
      }
    },
    async closed() {
      this.isLoading = false
    },
    async edit(row) {
      this.isModify = true
      this.isLoading = false

      try {
        const params = {
          id: row.ptStoreLocId
        }
        const warehouse = await findWarehouse(params)
        this.ruleForm.ptStoreLocName = warehouse.data.ptStoreLocName
        this.ruleForm.ptStoreLocDesc = warehouse.data.ptStoreLocDesc
        this.ruleForm.ptStoreLocId = warehouse.data.ptStoreLocId
      } catch (err) {
        console.log(err)
      } finally {
        // console.log('查看仓库')
      }
    },
    async see(row) {
      this.isLoading = true
      this.isModify = false
      try {
        const params = {
          id: row.ptStoreLocId
        }
        const visablet = await findWarehouse(params)
        this.visable = visablet.data
      } catch (err) {
        console.log(err)
      } finally {
        () => {}
      }
    },
    async closeModify() {
      this.isModify = false
    },
    async save() {
      const checkData = await this.$refs['ruleForm'].validate()
      if (checkData) {
        try {
          const body = {
            ptStoreLocName: this.ruleForm.ptStoreLocName,
            ptStoreLocDesc: this.ruleForm.ptStoreLocDesc,
            ptStoreLocId: this.ruleForm.ptStoreLocId
          }
          //   if (this.isList) {
          //  body['ptStoreLocName'] = this.ruleForm.ptStoreLocName
          //  body['master'] = 1
          //  body['ptStoreLocId'] = this.ruleForm.ptStoreLocId
          await partStoreModify(body)
          //   } else {
          //     body['name'] = this.ruleForm.ptStoreLocName
          //     //  await partStoreAdd(body)
          //     this.isModify = false
          //   }

          this.getData()
          this.$message({
            message: '修改成功',
            type: 'success'
          })
          this.isLoading = false
        } catch (err) {
          console.log(err)
        } finally {
          // console.log('仓库修改成功')
        }
      }
    }

  }
}
</script>

<style scoped>
  element.style {
    height: 80px;
  }

  .el-input.is-disabled .el-input__inner {
    background-color: #F5F7FA;
    border-color: #E4E7ED;
    color: #000 !important;
    cursor: not-allowed;
  }

  .el-pagination{
    margin-top: 30px;
  }
</style>
