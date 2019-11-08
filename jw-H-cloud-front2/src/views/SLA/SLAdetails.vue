<template>
  <el-container>
    <el-header>
      <el-row :span="12">
        <el-col>
          <el-button type="" @click="back">
            返回
          </el-button>
        </el-col>
      </el-row>
    </el-header>
    <el-main>
      <el-form ref="checkData" :rules="checkData" :model="SLA" label-width="100px" label-position="left">
        <el-card>
          <el-row :gutter="25">
            <el-col :span="6">
              <el-form-item label="SLA名称:" prop="name" >
                <el-input v-model="SLA.name" placeholder="请输入SLA名称" clearable/>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="优先排名:" prop="Sort" >
                <el-input-number :controls="false" v-model="SLA.Sort" placeholder="请输入排名" clearable/>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="15">
            <el-col :span="24" align="left">
              <div class="grid-content bg-purple">规则</div>
            </el-col>
          </el-row>
          <el-row :gutter="25">
            <el-col :span="6">
              <el-form-item label="设备:" prop="locale">
                <el-cascader
                  :props="eqProps"
                  v-model="SLA.eqData"
                  :options="rule.eqData"
                  collapse-tags
                />
              </el-form-item>
            </el-col>
            <!-- <el-col :span="6">
              <el-form-item label="设备系统:" prop="eqData">
                <el-select v-model="SLA.eqData" placeholder="请选择" clearable @change="getEqtype">
                  <el-option
                    v-for="item in rule.eqData"
                    :key="item.eqId"
                    :label="item.description"
                    :value="item.alarmType"
                  />
                </el-select >
              </el-form-item>
            </el-col> -->
            <!-- <el-col :span="6">
              <el-form-item label="设备类型:" prop="eqTypEData">
                <el-select v-model="SLA.eqTypEData" placeholder="请选择" clearable @change="getEqId">
                  <el-option
                    v-for="item in rule.eqTypEData"
                    :key="item.eqTypeId"
                    :label="item.eqStd"
                    :value="item.eqTypeId"
                  />
                </el-select >
              </el-form-item>
            </el-col> -->
            <!-- <el-col :span="6">
              <el-form-item label="设备编码:" prop="eqIdData">
                <el-select v-model="SLA.eqIdData" placeholder="请选择" clearable>
                  <el-option
                    v-for="item in rule.eqIdData"
                    :key="item.name"
                    :label="item.name"
                    :value="item.id"
                  />
                </el-select >
              </el-form-item>
            </el-col> -->
            <el-col :span="6">
              <el-form-item label="责任人:" prop="admin">
                <el-select v-model="SLA.admin" placeholder="请选择" clearable @change="checkAdmin">
                  <el-option
                    v-for="item in rule.admin"
                    :key="item.realName"
                    :label="item.realName"
                    :value="item.userId"
                  />
                </el-select >
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="地点:" prop="locale">
                <el-cascader
                  :props="props"
                  v-model="SLA.locale"
                  :options="rule.building"
                  collapse-tags
                />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="问题类型:" prop="problemType">
                <el-select v-model="SLA.problemType" placeholder="请选择" clearable>
                  <el-option
                    v-for="item in rule.problemType"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  />
                </el-select >
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="优先级:" prop="priority">
                <el-select v-model="SLA.priority" placeholder="请选择" clearable>
                  <el-option
                    v-for="item in rule.priority"
                    :key="item.name"
                    :label="item.name"
                    :value="item.id"
                  />
                </el-select >
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="15">
            <el-col :span="24" align="left">
              <div class="grid-content bg-purple">流程</div>
            </el-col>
          </el-row>
          <!-- 流程 -->
          <el-row>
            <el-col :span="6">
              <el-form-item label="审批人:" prop="Approval">
                <el-select v-model="SLA.Approval" placeholder="请选择" clearable>
                  <el-option
                    v-for="item in procedure.Approval"
                    :key="item.realName"
                    :label="item.realName"
                    :value="item.userId"
                  />
                </el-select >
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="审批后通知:" prop="notice">
                <el-select v-model="SLA.notice" placeholder="请选择" clearable>
                  <el-option
                    v-for="item in procedure.notice"
                    :key="item.realName"
                    :label="item.realName"
                    :value="item.userId"
                  />
                </el-select >
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="派发类型:" prop="types">
                <el-select v-model="SLA.types" placeholder="请选择" clearable @change="checkTypes">
                  <el-option
                    v-for="item in procedure.type"
                    :key="item.name"
                    :label="item.name"
                    :value="item.id"
                  />
                </el-select >
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="派发对象:" prop="target">
                <el-select v-model="SLA.target" placeholder="请选择" clearable>
                  <el-option
                    v-for="item in procedure.target"
                    :key="item.realName"
                    :label="item.realName"
                    :value="item.userId"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="默认工期:" prop="TimeLimit">
                <el-input v-model="SLA.TimeLimit" clearable/>
                <!-- <el-select v-model="SLA.TimeLimit" placeholder="请选择" clearable>
                  <el-option
                    v-for="item in procedure.TimeLimit "
                    :key="item.name"
                    :label="item.name"
                    :value="item.id"
                  />
                </el-select > -->
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="结束通知:" prop="Endnotice">
                <el-select v-model="SLA.Endnotice" placeholder="请选择" clearable>
                  <el-option
                    v-for="item in procedure.Endnotice"
                    :key="item.name"
                    :label="item.name"
                    :value="item.id"
                  />
                </el-select >
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="15">
            <el-col :span="24" align="left">
              <div class="grid-content bg-purple">服务等级</div>
            </el-col>
          </el-row>
          <!-- 服务等级 -->
          <el-row :gutter="15">
            <el-col :span="6" align="left">
              <el-checkbox v-model="service.hourChecked" >24小时服务</el-checkbox>
            </el-col>
            <el-col :span="6">
              <el-form-item label="开始时间:" prop="startTime">
                <el-time-picker
                  v-model="service.startTime"
                  :disabled="disabledEdit"
                  format="HH:mm"
                  value-format="HH:mm"
                  placeholder="任意时间点"/>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="结束时间:" prop="endTime">
                <el-time-picker
                  v-model="service.endTime"
                  :disabled="disabledEdit"
                  format="HH:mm"
                  value-format="HH:mm"
                  placeholder="任意时间点"/>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-checkbox-group v-model="checkList">
              <el-col :span="3" align="left">
                <el-checkbox v-model="service.Sunday" label="星期日" />
              </el-col>
              <el-col :span="3" align="left">
                <el-checkbox v-model="service.Monday" label="星期一" >星期一</el-checkbox>
              </el-col>
              <el-col :span="3" align="left">
                <el-checkbox v-model="service.Tuesday" label="星期二" >星期二</el-checkbox>
              </el-col>
              <el-col :span="3" align="left">
                <el-checkbox v-model="service.Wednesday" label="星期三" >星期三</el-checkbox>
              </el-col>
              <el-col :span="3" align="left">
                <el-checkbox v-model="service.Thursday" label="星期四" >星期四</el-checkbox>
              </el-col>
              <el-col :span="3" align="left">
                <el-checkbox v-model="service.Friday" label="星期五">星期五</el-checkbox>
              </el-col>
              <el-col :span="3" align="left">
                <el-checkbox v-model="service.Saturday" label="星期六" >星期六</el-checkbox>
              </el-col>
            </el-checkbox-group>
          </el-row>
          <el-row :gutter="15">
            <el-col :span="6">
              <el-form-item label="合同编号:" prop="contract">
                <el-select v-model="SLA.contract" placeholder="请选择" clearable @change="conIdChange">
                  <el-option
                    v-for="item in service.contract"
                    :key="item.conId"
                    :label="item.conId"
                    :value="item.conName"
                  />
                </el-select >
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="合同名称:" prop="contractName">
                <el-input v-model="SLA.contractName" readonly/>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-row :gutter="8">
                <el-col :span="16">
                  <el-form-item label="响应时间:" prop="responseTime">
                    <el-input-number :controls="false" v-model="SLA.responseTime" />
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-select v-model="SLA.responseCompany" placeholder="请选择单位" clearable>
                    <el-option
                      v-for="item in SLA.CompanyArr"
                      :key="item.name"
                      :label="item.name"
                      :value="item.id"
                    />
                  </el-select >
                </el-col>
              </el-row>
            </el-col>
            <el-col :span="6">
              <el-row :gutter="8">
                <el-col :span="16">
                  <el-form-item label="完成时间:" prop="finishTime">
                    <el-input-number :controls="false" v-model="SLA.finishTime" readonly/>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-select v-model="SLA.finishCompany" placeholder="请选择单位" clearable>
                    <el-option
                      v-for="item in SLA.CompanyArr"
                      :key="item.name"
                      :label="item.name"
                      :value="item.id"
                    />
                  </el-select >
                </el-col>
              </el-row>
            </el-col>
          </el-row>
          <el-row :gutter="15">
            <el-col :span="12" align="center">
              <el-form-item >
                <el-button
                  v-loading="isLoading"
                  type=""
                  @click.native.prevent="save">{{ isLoading ? '保存中' : '保 存' }}</el-button>
              </el-form-item>
            </el-col>
            <el-col :span="6" align="center">
              <el-form-item >
                <el-button
                  v-loading="isLoading"
                  type=""
                  @click.native.prevent="dele">清 除</el-button>
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
.grid-content {
  border-radius: 4px;
  min-height: 36px;
  line-height: 36px;
}
.bg-purple {
  background: rgba(214,214,214,0.28);
}
</style>

<script>
import {
  userName, // 获取用户列表
  contract, // 获取合同列表
  getProblemList, // 获取问题类型列表
  getEqList, // 获取设备列表
  addSLAdata, // 新增SLA
  modifySLAdata, // 修改SLA
  getLocation, // 获取地点房间号
  findSLAdata// 编辑时调用获取单条SLA的数据
} from '@/api/SLA/SLA'

export default {
  data() {
    const blurText = async(rule, value, callback) => {
      const boolean = new RegExp('^[1-9][0-9]*$').test(value)
      // console.log(boolean)
      if (!boolean) {
        this.$message.warning('请输入正整数')
        this.SLA.Sort = ''
      }
    }
    return {
      disabledEdit: false,
      isLoading: false,
      readonly: true,
      checkList: [],
      // 点懒加载
      props: {
        multiple: true, checkStrictly: true,
        label: 'name',
        lazy: true,
        async lazyLoad(node, resolve) {
          const { data } = node
          if (data && data.children && data.children.length !== 0) {
            return resolve([])
          }
          const params = {

          }
          if (data) {
            params['block'] = data['siteId'] || ''
            params['blId'] = data['blId'] || ''
            params['flId'] = data['flId'] || ''
          }
          try {
            const r = await getLocation(params)
            const targetData = []
            for (const item of r.data) {
              const temp = {
                siteId: item['siteId'] || '',
                blId: item['blId'] || '',
                flId: item['flId'] || '',
                rmId: item['rmId'] || '',
                name: item['name'] || '未命名',
                leaf: item['leaf'],
                children: item['children'] || []
              }
              temp['value'] = temp['rmId'] || temp['flId'] || temp['blId'] || temp['siteId']
              targetData.push(temp)
            }
            resolve(targetData)
          } catch (e) {
            console.log(e)
            resolve([])
          }
        }
      },
      // 设备懒加载
      eqProps: {
        multiple: true, checkStrictly: true,
        label: 'name',
        lazy: true,
        async lazyLoad(node, resolve) {
          const { data } = node
          if (data && data.children && data.children.length !== 0) {
            return resolve([])
          }
          const params = {

          }
          // console.log(data)
          if (data) {
            params['alarmType'] = data['alarmType'] || ''
            params['eqStd'] = data['eqStd'] || ''
            // params['flId'] = data['flId'] || ''
          }
          try {
            const r = await getEqList(params)
            const targetData = []
            for (const item of r.data) {
              const temp = {
                alarmType: item['alarmType'] || '',
                eqStd: item['eqStd'] || '',
                eqId: item['eqId'],
                name: item['name'] || '未命名',
                leaf: item['leaf'],
                children: item['children'] || []
              }
              temp['value'] = temp['eqId'] || item['eqStd'] || item['alarmType']
              targetData.push(temp)
            }
            resolve(targetData)
          } catch (e) {
            console.log(e)
            resolve([])
          }
        }
      },
      SLA: {
        name: '',
        eqData: [],
        eqTypEData: '',
        eqIdData: '',
        admin: '',
        locale: [],
        problemType: '',
        priority: '',
        Approval: '',
        notice: '',
        types: '',
        target: '',
        TimeLimit: '',
        Endnotice: '',
        contract: '',
        contractName: '',
        responseTime: 0,
        finishTime: 0,
        responseCompany: '天',
        finishCompany: '天',
        CompanyArr: [
          { name: '分钟', id: '1' }, { name: '小时', id: '2' }, { name: '天', id: '3' },
          { name: '星期', id: '4' }, { name: '月', id: '5' }],
        Sort: 0

      },
      // 规则
      rule: {
        eqData: [],
        eqTypEData: [],
        eqIdData: [],
        admin: [],
        locale: [],
        problemType: [],
        priority: [{ name: '1', id: '1' }, { name: '2', id: '2' }, { name: '3', id: '3' }],
        building: []
      },
      // 流程
      procedure: {
        Approval: [],
        notice: [],
        type: [{ name: '主管', id: '0' }, { name: '技工', id: '1' }],
        target: [],
        // TimeLimit: [],
        Endnotice: []
      },
      // 服务等级
      service: {
        hourChecked: true,
        startTime: '',
        endTime: '',
        Sunday: '',
        Monday: '',
        Tuesday: '',
        Wednesday: '',
        Thursday: '',
        Friday: '',
        Saturday: '',
        contract: []
      },
      // 增加和修改时的参数
      slaRule: {
        block: '',
        blId: '',
        flId: '',
        eqCode: '',
        eqSystem: '',
        eqType: '',
        id: '0',
        personLiable: '',
        personLiableName: '',
        priority: '',
        problemType: '',
        rmId: '',
        slaCode: '0',
        address: '',
        eq: ''
      },
      slaServiceLevel: {
        completionTime: '',
        completionTimeUnit: '',
        contractCode: '',
        contractName: '',
        holidayWorkState: '0',
        id: '0',
        responseTime: '',
        responseTimeUnit: '',
        service24HourState: '0',
        serviceEndTime: '',
        serviceStartTime: '',
        weeks: '',
        slaCode: '0'
      },
      slaWorkFlow: {
        approvalEndNotice: '',
        approvalEndNoticeName: '',
        approvers: '',
        approversName: '',
        defaultDuration: '',
        distributeObject: '',
        distributeObjectName: '',
        distributeType: '',
        id: '0',
        slaCode: '0',
        wrEndNotice: '',
        wrEndNoticeName: ''
      },

      // form表单验证
      checkData: {
        name: [{ required: true, message: '请输入SLA名称', trigger: 'blur' }],
        // eqData: [{ required: true, message: '请选择设备系统', trigger: 'blur' }],
        // eqTypEData: [{ required: true, message: '请选择设备类型', trigger: 'blur' }],
        // eqIdData: [{ required: true, message: '请选择设备编码', trigger: 'blur' }],
        // admin: [{ required: true, message: '请选择负责人', trigger: 'blur' }],
        // locale: [{ required: true, message: '请选择地点', trigger: 'blur' }],
        // problemType: [{ required: true, message: '请选择问题类型', trigger: 'blur' }],
        // priority: [{ required: true, message: '请选择优先级', trigger: 'blur' }],
        // Approval: [{ required: true, message: '请选择审批人', trigger: 'blur' }],
        // notice: [{ required: true, message: '请选择审批后通知人', trigger: 'blur' }],
        types: [{ required: true, message: '请选择派发类型', trigger: 'blur' }
        ],
        target: [{ required: true, message: '请选择派发对象', trigger: 'blur' }
        ],
        Sort: [
          { required: true, message: '请输入排名', trigger: 'blur' },
          { validator: blurText, trigger: 'blur' }
        ],
        contractName: [
          { validator: blurText, trigger: 'blur' }
        ],
        finishTime: [
          { required: true, message: '请输入正整数', trigger: 'blur' },
          { validator: blurText, trigger: 'blur' }
        ],
        responseTime: [
          { required: true, message: '请输入正整数', trigger: 'blur' },
          { validator: blurText, trigger: 'blur' }
        ]
        // TimeLimit: [{ required: true, message: '请选择默认工期', trigger: 'blur' }],
        // Endnotice: [{ required: true, message: '请选择结束通知', trigger: 'blur' }],
        // contract: [{ required: true, message: '请选择合同编号', trigger: 'blur' }],
        // responseTime: [{ required: true, message: '请输入响应时间', trigger: 'blur' }],
        // finishTime: [{ required: true, message: '请输入完成时间', trigger: 'blur' }]
      }
    }
  },
  async mounted() {
    this.getUserName('Approval', 0)// 审批人
    this.getUserName('notice')// 审批后通知人
    this.getUserName('admin')// 责任人
    this.getcontract()// 合同列表
    this.ProblemList()// 获取问题类型列表
    this.getEqDataList('eqData')// 获取设备系统和类型
    this.getSessionStorage()
  },
  methods: {
    // 获取取单条SLA数据
    getSessionStorage() {
      const session = window.sessionStorage.getItem('paramsData')
      if (session) {
        this.getSLA(session)
      } else {
        return
      }
    },
    // 地点回显
    transformData(data) {
      const target = data.map(i => {
        const r = {
          siteId: i['siteId'],
          blId: i['blId'] || '',
          flId: i['flId'] || '',
          rmId: i['rmId'] || '',
          name: i['name'] || '未命名',
          leaf: i['leaf'],
          children: i['children'] ? this.transformData(i['children']) : []
        }
        r['value'] = r['rmId'] || r['flId'] || r['blId'] || r['siteId']
        // console.log(r)
        return r
      })
      // console.log(r)
      console.log(target)
      return target
    },
    // 设备回显
    transformDataEq(data) {
      const target = data.map(i => {
        const r = {
          alarmType: i['alarmType'] || '',
          eqStd: i['eqStd'] || '',
          eqId: i['eqId'],
          name: i['name'] || '未命名',
          leaf: i['leaf'],
          children: i['children'] ? this.transformData(i['children']) : []
        }
        r['value'] = r['eqId'] || r['eqStd'] || r['alarmType']
        return r
      })
      return target
    },
    // 编辑时获取单条SLA数据
    async getSLA(id) {
      // 获取数据信息
      try {
        const params = {
          slaId: id
        }
        // 数据接口
        const r = await findSLAdata(params)
        // 回显地址时调用接口
        const l = await getLocation()
        const targetData = this.transformData(l['data'])
        // console.log(targetData)
        this.rule.building = targetData
        if (r.data.slaRule.block) this.SLA.locale.push(r.data.slaRule.block)
        if (r.data.slaRule.blId) this.SLA.locale.push(r.data.slaRule.blId)
        if (r.data.slaRule.flId) this.SLA.locale.push(r.data.slaRule.flId)
        if (r.data.slaRule.rmId) this.SLA.locale.push(r.data.slaRule.rmId)
        // console.log(this.rule.building)
        // console.log(this.SLA.locale)
        // 回显设备时调用接口
        const e = await getEqList()
        const targetDataEq = this.transformDataEq(e['data'])
        // console.log(targetDataEq)
        this.rule.eqData = targetDataEq
        // console.log(this.rule.eqData)
        if (e.data.alarmType) this.SLA.eqData.push(e.data.alarmType)
        if (e.data.eqStd) this.SLA.eqData.push(e.data.eqStd)
        if (e.data.eqId) this.SLA.eqData.push(e.data.eqId)
        // console.log(this.SLA.eqData)

        this.checkTypes(r.data.slaWorkFlow.distributeType)
        this.SLA.name = r.data.slaName
        this.SLA.eqData = r.data.slaRule.eqSystem
        this.SLA.eqTypEData = r.data.slaRule.eqType
        this.SLA.eqIdData = r.data.slaRule.eqCode
        this.SLA.admin = r.data.slaRule.personLiable
        this.SLA.problemType = r.data.slaRule.problemType
        this.SLA.priority = r.data.slaRule.priority
        this.SLA.Approval = r.data.slaWorkFlow.approvers
        this.SLA.notice = r.data.slaWorkFlow.approvalEndNotice
        this.SLA.types = r.data.slaWorkFlow.distributeType
        this.SLA.target = r.data.slaWorkFlow.distributeObject
        this.SLA.TimeLimit = ''
        this.SLA.Endnotice = r.data.slaWorkFlow.wrEndNotice
        this.SLA.contract = r.data.slaServiceLevel.contractCode
        this.SLA.contractName = r.data.slaServiceLevel.contractName
        this.SLA.responseTime = r.data.slaServiceLevel.responseTime
        this.SLA.finishTime = r.data.slaServiceLevel.completionTime
        this.SLA.responseCompany = r.data.slaServiceLevel.completionTimeUnit
        this.SLA.finishCompany = r.data.slaServiceLevel.responseTimeUnit
        this.service.startTime = r.data.slaServiceLevel.serviceStartTime
        this.service.endTime = r.data.slaServiceLevel.serviceEndTime
      } catch (e) {
        console.log(e)
      } finally {
        this.isLoading = false
      }
    },
    back() {
      this.$router.go(-1)
    },
    // 获取所有的用户列表
    async  getUserName(type, typeId) {
      try {
        const params = {
          typeId: typeId
        }
        const r = await userName(params)
        if (type === 'Approval') { // 审批人
          if (this.SLA.admin) { // 判断是否选取了责任人。如选取则审批人中不应该出现该责任人
            r.data.map((item, index) => { // 利用对象属性值相同的将该对象移除
              if (item['userId'] === this.SLA.admin) {
                r.data.splice(index, 1)
                this.procedure.Approval = r.data
              }
            })
          } else {
            this.procedure.Approval = r.data
          }
          // this.procedure.Approval = r.data
        }
        if (type === 'notice') { // 审批后通知人
          this.procedure.notice = r.data
        }
        if (type === 'target') { // 派发对象
          this.procedure.target = r.data
        }
        if (type === 'admin') { // 责任人
          this.rule.admin = r.data
        }
        // console.log(r)
      } catch (e) {
        console.log(e)
      } finally {
        this.isLoading = false
      }
    },
    // 获取合同列表
    async getcontract() {
      try {
        const r = await contract()
        // console.log(r)
        this.service.contract = r.data
      } catch (e) {
        console.log(e)
      } finally {
        this.isLoading = false
      }
    },
    // 获取当前合同id的名称
    conIdChange(value) {
      console.log(value)
      this.SLA.contractName = value
      if (value === '') {
        this.SLA.contractName = ''
      }
    },

    // 获取派发对象
    checkTypes(value) {
      // console.log(value)
      this.getUserName('target', value)
      if (value === '') {
        this.SLA.target = ''
      }
    },
    // 责任人选取后审批中不应该有该人员
    checkAdmin(value) {
      this.getUserName('Approval', 0)// 审批人
    },
    // 获取问题类型列表
    async ProblemList() {
      try {
        const r = await getProblemList()
        this.rule.problemType = r.data
      } catch (e) {
        console.log(e)
      } finally {
        this.isLoading
      }
    },
    // 获取设备列表
    async getEqDataList(state, alarmType, eqStd) {
      try {
        const params = {
          alarmType: alarmType,
          eqStd: eqStd
        }
        const r = await getEqList(params)
        // console.log(r)
        if (state === 'eqData') {
          this.rule.eqData = r.data
        }
        if (state === 'eqTypEData') {
          this.rule.eqTypEData = r.data
        }
        if (state === 'eqIdData') {
          this.rule.eqIdData = r.data
          console.log(this.rule.eqIdData)
        }
      } catch (e) {
        console.log(e)
      } finally {
        this.isLoading = false
      }
    },
    // 根据设备系统获取设备类型列表
    getEqtype(value) {
      if (!value) {
        this.SLA.eqTypEData = ''
        this.SLA.eqIdData = ''
      }
      this.getEqDataList('eqTypEData', value)
    },
    // 根据设备类型获取设备id
    getEqId(value) {
      if (!value) {
        this.SLA.eqIdData = ''
      }
      this.getEqDataList('eqIdData', this.SLA.eqData, value)
    },
    // 新增SLA和修改SLA
    async addModify() {
      try {
        const body = {
          id: 0,
          slaName: this.SLA.name,
          slaRule: this.slaRule,
          slaServiceLevel: this.slaServiceLevel,
          slaStatus: '',
          slaSort: this.SLA.Sort,
          slaWorkFlow: this.slaWorkFlow
        }
        // await addSLAdata(body)// 新增SLA

        if (window.sessionStorage.getItem('paramsData') !== '') {
          await modifySLAdata(body)// 修改SLA
        } else {
          await addSLAdata(body)// 新增SLA
        }
      } catch (e) {
        console.log(e)
      } finally {
        this.isLoading = false
        window.sessionStorage.removeItem()
      }
    },
    // 提交增加和修改的数据
    save() {
      this.slaRule.personLiable = this.SLA.admin
      this.slaRule.priority = this.SLA.priority
      this.slaRule.problemType = this.SLA.problemType
      this.slaServiceLevel.completionTime = this.SLA.finishTime
      this.slaServiceLevel.completionTimeUnit = this.SLA.responseCompany
      this.slaServiceLevel.contractCode = this.SLA.contract
      this.slaServiceLevel.contractName = this.SLA.contractName
      this.slaServiceLevel.responseTime = this.SLA.responseTime
      this.slaServiceLevel.responseTimeUnit = this.SLA.finishCompany
      this.slaServiceLevel.serviceEndTime = this.SLA.endTime
      this.slaServiceLevel.serviceStartTime = this.SLA.startTime
      this.slaServiceLevel.weeks = this.checkList.toString()
      this.slaWorkFlow.approvalEndNotice = this.SLA.notice
      this.slaWorkFlow.approvers = this.SLA.Approval
      this.slaWorkFlow.distributeObject = this.SLA.target
      this.slaWorkFlow.distributeObject = this.SLA.target
      this.slaWorkFlow.distributeType = this.SLA.types
      this.slaWorkFlow.distributeType = this.SLA.Endnotice

      if (this.SLA.locale.length !== 0) {
        var add = ''
        if (window.sessionStorage.getItem('paramsData') !== '') {
          add = add + this.SLA.locale.join('/')
        } else {
          this.SLA.locale.map((item, index) => {
            if (index !== 0) {
              add = add + ','
            }
            add = add + item.join('/')
          })
        }
        this.slaRule.address = add
      } else {
        this.slaRule.address = ''
      }
      if (this.SLA.eqData.length !== 0) {
        var eq = ''
        if (window.sessionStorage.getItem('paramsData') !== '') {
          eq = ''
        } else {
          this.SLA.eqData.map((item, index) => {
            if (index !== 0) {
              eq = eq + ','
            }
            eq = eq + item.join('/')
          })
        }
        this.slaRule.eq = eq
      } else {
        this.slaRule.eq = ''
      }
      if (this.checkList.length !== 0) {
        this.addModify()
      } else {
        this.$confirm('请至少选择周一到周日其中的一天', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          // this.$router.go(-1)
        }).catch(() => {
          console.log()
        })
      }
    }
    // 时间选取，默认24小时服务
    // check() {
    //   console.log(this.checkList.toString())// 星期数组
    // }

  }
}
</script>
