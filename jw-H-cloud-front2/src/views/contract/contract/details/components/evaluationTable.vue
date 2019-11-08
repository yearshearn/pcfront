<template>
  <el-container>
    <el-main class="print">
      <el-form
        ref="performanceRule"
        :rules="performanceRule"
        :model="performance"
        label-width="90px">
        <el-row>
          <el-col :span="4" class="oneTitle">
            <el-form-item label-width="0">
              1 项目基本信息
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="15">
          <el-col :span="8">
            <el-form-item label="项目代码:" prop="projectA">
              <el-select v-model="performance['projectA']" style="width:26%" clearable placeholder="请选择">
                <el-option value="驻场">驻场</el-option>
                <el-option value="单选">单选</el-option>
                <el-option value="备选">备选</el-option>
                <el-option value="零星">零星</el-option>
                <el-option value="临时">临时</el-option>
                <el-option value="其他">其他</el-option>
              </el-select>
              <el-select v-model="performance['projectB']" style="width:26%" clearable placeholder="请选择">
                <el-option value="安保-">安保-</el-option>
                <el-option value="修建-">修建-</el-option>
                <el-option value="运行-">运行-</el-option>
                <el-option value="维修-">维修-</el-option>
                <el-option value="维保-">维保-</el-option>
                <el-option value="资产-">资产-</el-option>
                <el-option value="设备-">设备-</el-option>
                <el-option value="低值-">低值-</el-option>
                <el-option value="餐饮-">餐饮-</el-option>
                <el-option value="食品-">食品-</el-option>
                <el-option value="保洁-">保洁-</el-option>
                <el-option value="运送-">运送-</el-option>
                <el-option value="护工-">护工-</el-option>
                <el-option value="咨询-">咨询-</el-option>
                <el-option value="其他-">其他-</el-option>
              </el-select>
              <el-select v-model="performance['projectC']" style="width:26%" clearable placeholder="请选择">
                <el-option value="01">01</el-option>
                <el-option value="02">02</el-option>
                <el-option value="03">03</el-option>
                <el-option value="04">04</el-option>
                <el-option value="05">05</el-option>
                <el-option value="06">06</el-option>
                <el-option value="07">07</el-option>
                <el-option value="08">08</el-option>
                <el-option value="09">09</el-option>
                <el-option value="10">10</el-option>
                <el-option value="11">11</el-option>
                <el-option value="12">12</el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="合同编码:">
              <el-input v-model="performance['conId']" readonly />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="合同名称:">
              <el-input v-model="performance['conName']" readonly />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="15">
          <el-col :span="8">
            <el-form-item label="管理部门:" prop="department">
              <el-select v-model="performance['department']" clearable placeholder="请选择部门">
                <el-option value="后勤管理处">后勤管理处</el-option>
                <el-option value="后勤-基建办公室">后勤-基建办公室</el-option>
                <el-option value="后勤-动力保障中心">后勤-动力保障中心</el-option>
                <el-option value="后勤-社会机构管理科">后勤-社会机构管理科</el-option>
                <el-option value="后勤-物资保卫科">后勤-物资保卫科</el-option>
                <el-option value="后勤-病员膳食科">后勤-病员膳食科</el-option>
                <el-option value="保卫科">保卫科</el-option>
                <el-option value="爱卫会">爱卫会</el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="责任人:">
              <el-input v-model="performance['emName']" readonly />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="服务范围:" prop="scopeService">
              <el-input v-model="performance['scopeService']" placeholder="请输入范围" clearable />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="15">
          <el-col :span="8">
            <el-form-item label="备注:">
              <el-input v-model="performance['comments']" readonly />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="续签:" prop="renewal">
              <el-select v-model="performance['renewal']" clearable placeholder="请选择状态">
                <el-option value="首次执行">首次执行</el-option>
                <el-option value="第一次续签">第一次续签</el-option>
                <el-option value="第二次续签">第二次续签</el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="招标年月:" prop="dateTender">
              <el-date-picker
                v-model="performance['dateTender']"
                :picker-options="{
                  disabledDate(time) {
                    if (dateStartToEnd&&dateStartToEnd[0]) {
                      return time.getTime() > new Date(dateStartToEnd[0]).getTime() || time.getTime() > Date.now()
                    }
                    return false
                  }
                }"
                value-format="yyyy-MM-dd"
                type="date"
                align="center"
                placeholder="选择日期"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="15">
          <el-col :span="8">
            <el-form-item label="合同周期:">
              <el-date-picker
                v-model="dateStartToEnd"
                style="width:80%"
                type="daterange"
                unlink-panels
                readonly
                value-format="yyyy-MM-dd"
                range-separator="-"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="招标方式:" prop="bidding">
              <el-select v-model="performance['bidding']" clearable placeholder="请选择方式" @change="bid">
                <el-option value="公开招投标">公开招投标</el-option>
                <el-option value="内部招投标">内部招投标</el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="招标单位:">
              <el-input v-model="performance['tenderDep']" readonly placeholder="请选择招标方式" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="15">
          <el-col :span="8">
            <el-form-item label="公司名称:" prop="company">
              <el-input v-model="performance['company']" placeholder="请输入公司" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="公司地址:" prop="address1">
              <el-input v-model="performance['address1']" placeholder="请输入地址" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="驻地经理:">
              <el-input v-model="performance['residentManager']" placeholder="请输入经理" clearable />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="15">
          <el-col :span="8">
            <el-form-item label="联系电话:" prop="phone1">
              <el-input
                v-model="performance['phone1']"
                placeholder="请输入固定电话或者手机号"
                clearable
                style="width:80%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="项目主管:">
              <el-input v-model="performance['director']" placeholder="请输入主管" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="联系电话:" prop="phone2">
              <el-input
                v-model="performance['phone2']"
                placeholder="请输入固定电话或者手机号"
                clearable
                style="width:80%"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col class="oneTitle">2 合同执行情况(履约表已转化为百分制)</el-col>
        </el-row>
        <el-table
          :data="performance['performanceParams']"
          :summary-method="customSummaryMethod"
          border
          show-summary
          sum-text="-"
        >
          <el-table-column align="center" label="考核日期" min-width="20%" width="200">
            <template slot-scope="{row}">
              {{ row['assessDate'].split(' ')[0] }}
            </template>
          </el-table-column>
          <el-table-column prop="workload" align="center" label="完成工作量(%)" min-width="20%">
            <template slot-scope="{row}">100</template>
          </el-table-column>
          <el-table-column prop="monthlyTurnover" align="center" min-width="20%" label="月度营业额(万元)">
            <template slot-scope="{row}">
              <el-input-number
                v-model.number="row['monthlyTurnover']"
                :min="0"
                :max="999999999999"
                :controls="false"
              />
            </template>
          </el-table-column>
          <el-table-column prop="staffingNumber" align="center" min-width="20%" label="配置人员数(名)">
            <template slot-scope="{row}">
              <el-input-number
                v-model.number="row['staffingNumber']"
                :min="0"
                :max="100"
                :controls="false"
              />
            </template>
          </el-table-column>
          <el-table-column prop="monthlySorce" align="center" min-width="20%" label="月度考核成绩(%)" />
        </el-table>
        <el-row>
          <el-col class="oneTitle">3 业务开展情况评价（安全、廉洁、质量、服务、效益、其他）</el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label-width="0" prop="evaluate">
              <el-input
                :autosize="{ minRows: 3, maxRows: 3}"
                v-model="performance['evaluate']"
                type="textarea"
                placeholder="（ 请真实、全面、客观地描述服务机构业务的开展情况及各主要方面的表现，篇幅不限 ）"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col class="oneTitle">4 奖励处罚记录（时间、奖惩原因、奖惩内容）</el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label-width="0" prop="awardRecord">
              <el-input
                :autosize="{ minRows: 3, maxRows: 3}"
                v-model="performance['awardRecord']"
                type="textarea"
                placeholder="XXXX年XX月，因……，对该公司进行（奖励/处罚）……。（不够可加行）"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col class="oneTitle">5 考核结论与推荐意见</el-col>
        </el-row>
        <el-row :gutter="15">
          <el-col :span="7">
            <el-form-item label="考核年度:" prop="assessYear">
              <el-select v-model="performance['assessYear']" clearable placeholder="请选择年份">
                <el-option
                  v-for="item in assessYears"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :offset="1" :span="7">
            <el-form-item label="考核结论:" prop="conclusion">
              <el-select v-model="performance['conclusion']" clearable placeholder="请选择方式">
                <el-option value="优秀">优秀</el-option>
                <el-option value="良好">良好</el-option>
                <el-option value="合格">合格</el-option>
                <el-option value="基本合格">基本合格</el-option>
                <el-option value="不合格">不合格</el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :offset="2" :span="7">
            <el-form-item label="推荐意见:" prop="opinion">
              <el-select v-model="performance['opinion']" clearable placeholder="请选择方式">
                <el-option :disabled="!bidDisabled" value="建议续签">建议续签</el-option>
                <el-option :disabled="!bidDisabled" value="建议不续签,另行组织招标">建议不续签,另行组织招标</el-option>
                <el-option :disabled="bidDisabled" value="因合同已续签二次，需重新招标">因合同已续签二次，需重新招标</el-option>
                <el-option :disabled="!bidDisabled" value="经谈判变更部分合同要素后续签">经谈判变更部分合同要素后续签</el-option>
                <el-option :disabled="!bidDisabled" value="建议临时展期三个月">建议临时展期三个月</el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col class="oneTitle">6 考核小组成员：</el-col>
        </el-row>
        <el-row>
          <el-col :span="6">考核人:</el-col>
          <el-col :span="6">科长:</el-col>
          <el-col :span="6">处长:</el-col>
          <el-col :span="6">分管院领导:</el-col>
        </el-row>
      </el-form>
    </el-main>
    <!-- <el-footer v-if="editRoleFlag"> -->
    <el-footer>
      <el-row>
        <el-col :offset="20" :span="2">
          <el-button type="primary" @click="printing">打 印</el-button>
        </el-col>
        <el-col :offset="0" :span="1">
          <el-button type="primary" @click="submit">保 存</el-button>
        </el-col>
      </el-row>
    </el-footer>
  </el-container>
</template>

<script>
import {
  getContractPerformanceByConId,
  performanceFormSubmit
} from '@/api/contract'

import { getToken } from '@/utils/auth'

import { editRoleFlag } from '@/utils/buttonRole/contract'

import { phoneReg } from '@/utils/validate/reg'

export default {
  data() {
    return {
      // 权限判断
      editRoleFlag,
      // 合同周期
      dateStartToEnd: [],
      // 基本信息
      performance: {
        // 项目编码
        projectA: '',
        projectB: '',
        projectC: '',
        // 合同编码
        conId: '',
        // 合同名称
        conName: '',
        // 管理部们
        department: '',
        // 责任人
        emId: '',
        // 服务范围
        scopeService: '',
        // 备注
        comments: '',
        // 续签
        renewal: '',
        // 招标年月
        dateTender: '',
        // 合同开始时间
        dateStart: '',
        // 合同结束时间
        dateEnd: '',
        // 招标方式
        bidding: '',
        // 招标单位
        tenderDep: '',
        // 公司名称
        company: '',
        // 公司地址
        address1: '',
        // 驻地经理
        residentManager: '',
        // 联系方式
        phone1: '',
        // 项目主管
        director: '',
        // 联系方式
        phone2: '',
        // 业务情况
        evaluate: '',
        // 奖罚记录
        awardRecord: '',
        // 考核年度
        assessYear: '',
        // 考核结论
        conclusion: '',
        // 推荐意见
        opinion: '',
        // 履约表id
        performanceId: '',
        // 执行情况
        performanceParams: []
      },
      // 保存判断
      performanceRule: {
        projectA: [
          { required: true, message: '请选择项目代码', trigger: 'change' }
        ],
        department: [
          { required: true, message: '请选择管理部门', trigger: 'change' }
        ],
        scopeService: [
          { required: true, message: '请输入服务范围', trigger: 'change' }
        ],
        renewal: [
          { required: true, message: '请选择续签状态', trigger: 'change' }
        ],
        dateTender: [
          { required: true, message: '请选择招标年月', trigger: 'change' }
        ],
        bidding: [
          { required: true, message: '请选择招标方式', trigger: 'change' }
        ],
        company: [
          { required: true, message: '请输入公司名称', trigger: 'change' }
        ],
        address1: [
          { required: true, message: '请输入公司地址', trigger: 'change' }
        ],
        phone1: [
          { message: '请输入正确的固定电话或手机号', pattern: phoneReg, trigger: 'change' }
        ],
        phone2: [
          { message: '请输入正确的固定电话或手机号', pattern: phoneReg, trigger: 'change' }
        ]
        // evaluate: [
        //   { required: true, message: '请对业务情况评价', trigger: 'change' }
        // ],
        // awardRecord: [
        //   { required: true, message: '请输入奖励处罚记录', trigger: 'change' }
        // ],
        // assessYear: [
        //   { required: true, message: '请选择考核年度', trigger: 'change' }
        // ],
        // conclusion: [
        //   { required: true, message: '请选择考核结论', trigger: 'change' }
        // ],
        // opinion: [
        //   { required: true, message: '请选择推荐意见', trigger: 'change' }
        // ]
      }
    }
  },
  computed: {
    assessYears() {
      const tmpArr = []
      const myDate = new Date()
      const startYear = myDate.getFullYear() - 5 // 起始年份
      const endYear = myDate.getFullYear() + 5 // 结束年份
      for (let i = startYear; i <= endYear; i++) {
        tmpArr.push({
          value: i,
          label: i
        })
      }
      return tmpArr
    },
    // 续签状态
    bidDisabled() {
      if (!Object.is(this.performance['renewal'], '第二次续签')) {
        return true
      }
      return false
    }
  },
  watch: {},
  created() {},
  async mounted() {
    this.getData()
  },
  methods: {
    bid() {
      if (this.performance['bidding'] === '') {
        this.performance['tenderDep'] = ''
      }
      if (this.performance['bidding'] === '公开招投标') {
        this.performance['tenderDep'] = '卫建中心'
      }
      if (this.performance['bidding'] === '内部招投标') {
        this.performance['tenderDep'] = '上海市第六人民医院'
      }
    },
    // 合计
    customSummaryMethod(param) {
      const { columns, data } = param
      const sums = []
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '总计'
          return
        }
        if (index === 1) {
          sums[index] = '年度营业额(万元)'
          return
        }
        if (index === 3) {
          sums[index] = '当前年平均考核成绩(%)'
          return
        }
        if (data) {
          const values = data.map(item => Number(item[column.property]))
          if (!values.every(value => isNaN(value))) {
            sums[index] = values.reduce((prev, curr) => {
              const value = Number(curr)
              if (!isNaN(value)) {
                return prev + curr
              } else {
                return prev
              }
            }, 0)
            if (index === 2) {
              sums[index] = sums[index].toFixed(2)
            }
            if (index === 4) {
              sums[index] = Number(
                (sums[index] / this.performance['performanceParams'].length).toFixed(1)
              )
            }
          } else {
            sums[index] = ''
          }
        }
      })
      // console.log(sums)
      return sums
    },
    // 获取合同信息
    async getData() {
      try {
        const r = await getContractPerformanceByConId(
          this.$route.params['cid']
        )
        const contract = r['data']['performance']
        this.performance = contract
        this.performance['performanceParams'] = r['data']['performanceParams']
        if (!contract['dateStart'] || !contract['dateEnd']) {
          this.dateStartToEnd = []
        } else {
          this.dateStartToEnd = [contract['dateStart'], contract['dateEnd']]
        }
      } catch (e) {
        console.log(e)
      }
    },
    // 打印
    async printing() {
      try {
        window.open(`${process.env.BASE_API}/contract/downloadPerformance?conId=${this.$route.params['cid']}&authorization=${getToken()}`)
      } catch (e) {
        console.log(e)
      }
    },
    // 保存
    async submit() {
      const data = {
        performance: this.performance,
        performanceParams: this.performance['performanceParams']
      }
      data['performance']['dateStart'] = this.dateStartToEnd[0]
      data['performance']['dateEnd'] = this.dateStartToEnd[1]
      // console.log(data)
      try {
        const performanceFlag = await this.$refs['performanceRule'].validate()
        if (performanceFlag) {
          await performanceFormSubmit(data)
          this.$message({
            message: '履约评价修改成功！',
            type: 'success'
          })
          this.getData()
        }
      } catch (e) {
        console.log(e)
      }
    }
  }
}
</script>

<style scoped>
.oneTitle {
  color: #777;
  margin: 15px 0;
}

/* .table {
  padding: 8px;
  height: 58px;
  line-height: 38px;
  border: 1px solid #ddd;
  border-collapse: collapse;
  margin-right: -1px;
  margin-bottom: -1px;
  text-align: center;
} */

.el-select {
  width: 80%;
}

.el-input {
  width: 80%;
}
</style>
