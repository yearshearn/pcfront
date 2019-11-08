<template>
  <el-container>
    <el-header>
      <el-row :gutter="15">
        <el-col :span="4">
          <el-input
            v-model="definition['searchEqId']"
            placeholder="设备编码"
            clearable
            @clear="equipmentList(true)"
            @keyup.enter.native="equipmentList(true)">
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="equipmentList(true)"/>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-input
            v-model="definition['searchEqType']"
            placeholder="设备类型"
            clearable
            @clear="equipmentList(true)"
            @keyup.enter.native="equipmentList(true)">
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="equipmentList(true)"/>
          </el-input>
        </el-col>
        <el-col :span="11" align="right">
          <el-button :disabled="definition['qrCode']" @click="qrCodeClick">二维码生成</el-button>
        </el-col>
        <el-col :span="2" align="right">
          <el-upload
            :show-file-list="false"
            :http-request="uploadFunc"
            :before-upload="beforeUpload"
            :multiple="false"
            :on-error="onError"
            action="占位"
            accept=".xls,.XLS"
            class="upload-demo">
            <el-button :loading="definition['isUploading']">导入</el-button>
          </el-upload>
        </el-col>
        <el-col :span="3" align="right">
          <el-button @click="handleEdit('add')">新增设备</el-button>
        </el-col>
      </el-row>
    </el-header>
    <el-main>
      <el-card>
        <el-table
          v-loading="definition['listLoading']"
          ref="table"
          :data="definition['list']"
          :row-style="tableStripeCallBack"
          fit
          max-height="589"
          element-loading-text="数据加载中..."
          @filter-change="handleFilterTransType">
          <el-table-column align="center" type="index" fixed label="序号"/>
          <el-table-column align="center" property="eqId" width="130" fixed label="设备编码"/>
          <el-table-column align="center" label="设备类型" show-overflow-tooltip>
            <template slot-scope="{row}">
              {{ row['eqStd'] }}
              <span v-if="row['eqSubtypes']"> - {{ row['eqSubtypes'] }}</span>
            </template>
          </el-table-column>
          <el-table-column
            :filters="definition['descriptionData']"
            align="center"
            width="130"
            property="alarmType"
            label="系统名称"
            show-overflow-tooltip
            column-key="alarmType"/>
          <el-table-column align="center" property="blName" label="大厦" show-overflow-tooltip/>
          <el-table-column align="center" property="flName" label="楼层"/>
          <el-table-column align="center" property="rmName" label="房间" show-overflow-tooltip/>
          <el-table-column align="center" property="modelno" label="型号" show-overflow-tooltip/>
          <el-table-column align="center" property="datePurchased" label="采购日期" show-overflow-tooltip/>
          <el-table-column align="center" property="status" label="设备状态"/>
          <el-table-column align="center" property="meter" width="130" label="上次仪表读数"/>
          <el-table-column align="center" property="mfr" show-overflow-tooltip label="制造商"/>
          <el-table-column align="center" property="link" width="130" label="供应商电话"/>
          <el-table-column align="center" fixed="right" width="230" label="操作选项">
            <template slot-scope="scope">
              <el-row :gutter="10">
                <el-col :span="8">
                  <el-button size="mini" type="primary" @click="handleEdit(scope['row'])">编辑</el-button>
                </el-col>
                <el-col :span="8">
                  <el-button size="mini" type="danger" @click.native.prevent="deleteAndLinkage(scope['row'], 'delete')">删除</el-button>
                </el-col>
                <el-col :span="8">
                  <el-checkbox v-model="scope['row']['linkageStatus']" @change="deleteAndLinkage(scope['row'], 'linkage')">联动</el-checkbox>
                </el-col>
              </el-row>
            </template>
          </el-table-column>
        </el-table>
        <el-row>
          <el-col :span="24" align="center">
            <el-pagination
              :page-sizes="pageSizes"
              :current-page="pagination['currentPage']"
              :page-size="pagination['pageSize']"
              :total="pagination['total']"
              layout="total, sizes, prev, pager, next, jumper"
              @current-change="currentChange"
              @size-change="handleSizeChange"
            />
          </el-col>
        </el-row>
      </el-card>
    </el-main>
  </el-container>
</template>

<script>
import { pageSizes } from '@/utils/globalConfig'

import { tableStripeCallBack } from '@/utils/style'

import { getTableList } from '@/api/equipment/system'

import { mapGetters } from 'vuex'

// import { getToken } from '@/utils/auth'

import {
  equipmentList,
  deleteEquipment,
  equipmentLinkage,
  impertEquipment
} from '@/api/equipment/definition'

export default {
  data() {
    return {
      // 每页显示条数
      pageSizes,
      definition: {
        // 设备编码搜索
        searchEqId: '',
        // 设备类型搜索
        searchEqType: '',
        // 列表数组
        list: [],
        // 二维码数组
        qrCodeData: [],
        // 系统名称数组
        descriptionData: [],
        // 二维码禁用
        qrCode: true,
        // 联动
        linkage: false,
        // 列表等待
        listLoading: false,
        // 导入等待
        isUploading: false
      },
      // 列表分页
      pagination: {
        currentPage: 1,
        pageSize: 10,
        total: 0
      },
      filterObj: {
        description: []
      },
      qrCodeData: []
    }
  },
  computed: {
    ...mapGetters([
      'name',
      'realName',
      'userId'
    ]),
    baseUrl() {
      return process.env.BASE_API
    }
  },
  created() {},
  async mounted() {
    this.getSystemList()
    this.equipmentList()
  },
  methods: {
    // 表格隔行颜色
    tableStripeCallBack,
    // 问卷分页
    currentChange(targetPage) {
      this.pagination['currentPage'] = targetPage
      this.equipmentList(false, true)
    },
    // 分页跳转
    handleSizeChange(size) {
      this.pagination['pageSize'] = size
      this.pagination['currentPage'] = 1
      this.equipmentList()
    },
    // 编辑
    handleEdit(scope) {
      // console.log(scope)
      const params = { eqId: '' }
      params['eqId'] = scope
      if (scope !== 'add') {
        params['eqId'] = scope['eqId']
      }
      this.$router.push({
        name: 'definitionEditor',
        params: params
      })
    },
    // 删除和联动
    async deleteAndLinkage(rows, type) {
      // console.log(rows)
      try {
        const data = {
          eqId: rows['eqId']
        }
        if (Object.is(type, 'delete')) {
          await this.$confirm(`是否要删除：${rows['eqId']}`, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          })
          await deleteEquipment(data)
          this.$message({
            message: `删除成功！`,
            type: 'success'
          })
          this.equipmentList()
        }
        if (Object.is(type, 'linkage') && Object.is(rows['linkageStatus'], true)) {
          this.qrCodeData.push(false)
          await equipmentLinkage(data)
          if (this.qrCodeData.length !== 0) {
            this.definition['qrCode'] = false
          }
        } else {
          this.qrCodeData.splice(0, 1)
          if (this.qrCodeData.length === 0) {
            this.definition['qrCode'] = true
          }
        }
      } catch (error) {
        console.log(error)
      }
    },
    // 二维码点击事件
    async qrCodeClick() {
      this.definition['qrCodeData'] = []
      this.definition['list'].map((item) => {
        if (Object.is(item['linkageStatus'], true)) {
          this.definition['qrCodeData'].push(item['eqId'])
        }
      })
      this.$router.push({
        name: 'definitionQrCode',
        params: {
          eqIdData: JSON.stringify(this.definition['qrCodeData'])
        }
      })
      // console.log(this.definition['qrCodeData'])
    },
    // 上传之前判断文件格式.xls,.XLS
    beforeUpload(file) {
      // console.log(file)
      const testmsg = file.name.substring(file.name.lastIndexOf('.') + 1)
      const fileSize = file.size / 1024 / 1024 < 100
      const type = ['xls', 'XLS']
      if (!type.includes(testmsg)) {
        this.$message({
          message: '上传文件只能是xls、XLS格式!',
          type: 'warning'
        })
      }
      if (!fileSize) {
        this.$message({
          message: '上传文件大小不能超过 100MB!',
          type: 'warning'
        })
      }
      return type && fileSize
    },
    // 文件上传失败时
    onError(err, file, fileList) {
      this.$message({
        message: '上传文件失败',
        type: 'warning'
      })
      console.log(err, file, fileList)
    },
    // 上传
    async uploadFunc(v) {
      this.definition['isUploading'] = true
      try {
        const data = new FormData()
        data.append('file', v['file'])
        // console.log(data, v)
        await impertEquipment(data)
        this.$message({
          message: '上传成功！',
          type: 'success'
        })
      } catch (error) {
        console.log(error)
      } finally {
        this.definition['isUploading'] = false
      }
    },
    // 系统名称
    async getSystemList() {
      try {
        const r = await getTableList()
        this.definition['descriptionData'] = r['data']['list'].map((item) => {
          return {
            text: item.description,
            value: item.alarmType
          }
        })
        // console.log(r['data'])
      } catch (error) {
        console.log(error)
      }
    },
    // 筛选系统名称
    handleFilterTransType(filters) {
      this.filterObj['description'] = filters['alarmType']
      this.equipmentList()
    },
    // 设备列表
    async equipmentList(search, jump) {
      this.definition['listLoading'] = true
      try {
        const params = {
          eqId: this.definition['searchEqId'],
          eqStd: this.definition['searchEqType'],
          pageNum: this.pagination['currentPage'],
          pageSize: this.pagination['pageSize']
        }
        if (search) {
          params['pageNum'] = 1
          params['eqId'] = this.definition['searchEqId']
          params['eqStd'] = this.definition['searchEqType']
        }
        if (jump) {
          params['eqId'] = this.definition['searchEqId']
          params['eqStd'] = this.definition['searchEqType']
        }
        if (this.filterObj['description'].length !== 0) {
          // console.log(this.filterObj['description'])
          params['alarmTypeName'] = encodeURI(JSON.stringify(this.filterObj['description']))
        }
        const r = await equipmentList(params)
        this.definition['list'] = r['data']['list']
        this.pagination['total'] = r['data']['count']
        // console.log(r['data'])
      } catch (error) {
        console.log(error)
      } finally {
        this.definition['listLoading'] = false
        this.$refs.table.bodyWrapper.scrollTop = 0
      }
    }
  }
}
</script>

<style scoped>
  .el-container{
    margin: 30px 30px 0;
  }

  .el-pagination{
    margin-top: 30px;
  }
</style>
