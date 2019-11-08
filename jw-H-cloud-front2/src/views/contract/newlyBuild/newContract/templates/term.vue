<template>
  <div>
    <el-form
      ref="contractRule"
      :rules="contractRule"
      :model="submit['tContract']"
      label-position="right"
      label-width="115px"
    >
      <!-- 定义合同 -->
      <!-- onkeyup="value=value.replace(/[^\u4E00-\u9FA5]/g,'')"
          onpaste="value=value.replace(/[^\u4E00-\u9FA5]/g,'')"
      oncontextmenu="value=value.replace(/[^\u4E00-\u9FA5]/g,'')"-->
      <el-row>
        <el-col :span="24" align="center">
          <div class="grid-content bg-purple">定义合同</div>
        </el-col>
      </el-row>
      <el-row :gutter="15">
        <el-col :span="6">
          <el-form-item label="合同编码:" prop="conId">
            <el-input v-model="submit['tContract']['conId']" placeholder="请输入合同编码" clearable/>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="合同名称:" prop="conName">
            <el-input v-model="submit['tContract']['conName']" placeholder="请输入合同名称" clearable/>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="设备供应商:" prop="supplier">
            <el-input v-model="submit['tContract']['supplier']" placeholder="请输入供应商名称" clearable/>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="维保单位:" prop="maintDep">
            <el-input v-model="submit['tContract']['maintDep']" placeholder="请输入维保单位" clearable/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="15">
        <el-col :span="6">
          <el-form-item label="维保联系人:" prop="maintPeople">
            <el-input v-model="submit['tContract']['maintPeople']" placeholder="请输入联系人" clearable/>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="联系人电话:" prop="maintPhone">
            <el-input
              v-model="submit['tContract']['maintPhone']"
              placeholder="请输入联系人电话"
              clearable
            />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="合同编辑人:" prop="conContacts">
            <el-input v-model="submit['tContract']['conContacts']" placeholder="请输入编辑人" clearable/>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="院方责任人:" prop="resPerson">
            <el-select
              v-model="submit['tContract']['resPerson']"
              style="width:80%"
              clearable
              placeholder="请选择责任人">
              <el-option
                v-for="item in resPersonData"
                :key="item.userId"
                :label="item.userName"
                :value="item.userId"/>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="15">
        <el-col :span="6">
          <el-form-item label="合同类型:">
            <el-input value="定期" readonly/>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="合同优先级:" prop="conPriority">
            <el-select
              v-model="submit['tContract']['conPriority']"
              style="width:80%"
              clearable
              placeholder="请选择"
            >
              <el-option
                v-for="item in conPriorityArr"
                :key="item.label"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="签约期限(年):" prop="conTerm">
            <el-input
              v-model="submit['tContract']['conTerm']"
              placeholder="请输入年限"
              clearable
            />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="合同总金额:" prop="totalAmount">
            <el-input
              v-model="submit['tContract']['totalAmount']"
              placeholder="请输入合同总金额"
              clearable/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">
          <el-form-item label="起止时间:" prop="dateStart">
            <el-input v-show="false" v-model="submit['tContract']['dateStart']"/>
            <el-date-picker
              v-model="startDateToEnd"
              :picker-options="contractStartPicker"
              type="daterange"
              align="right"
              unlink-panels
              value-format="yyyy-MM-dd"
              range-separator="-"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="说明:" prop="comments">
            <el-input
              :autosize="{ minRows: 3, maxRows: 3}"
              v-model="submit['tContract']['comments']"
              type="textarea"
              resize="none"
              placeholder="请输入备注"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <!-- 维护保养计划 -->
      <el-row :gutter="15">
        <el-col :span="24" align="middle">
          <div class="grid-content bg-purple">维护保养计划</div>
        </el-col>
      </el-row>
      <el-table
        :data="submit['tClause']"
        width="100%"
        border
        height="179"
        empty-text="请添加排程事件和循环方式"
        style="margin-bottom:25px"
      >
        <el-table-column align="center" prop="continuedDays" label="事件持续(天)"/>
        <el-table-column align="center" prop="claType" label="条款类型">
          <template slot-scope="{row}">{{ row.claType | conTypeFilter }}</template>
        </el-table-column>
        <el-table-column width="320" align="center" label="地点 / 设备">
          <template slot-scope="{row}">
            <div
              v-for="(item, index) in row.places"
              :key="index">
              {{ item.blName }} -- {{ item.flName }} -- {{ item.rmName }}
              <!-- {{ index + 1 + '、' }} {{ item.blName }} -- {{ item.flName }} -- {{ item.rmName }} -- {{ item.eqName }} -->
            </div>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="modes" label="循环方式">
          <template slot-scope="{row}">{{ row.modes | conModesFilter }}</template>
        </el-table-column>
        <el-table-column align="center" prop="intervalTimes" label="间隔时间"/>
        <el-table-column align="center" prop="cirDate" label="计划日期">
          <template slot-scope="{row}">
            <div v-if="Object.is( row.modes , 'week' )">{{ row.cirDate | conIntervalWeekFilter }}</div>
            <div v-else>{{ row.cirDate }}</div>
          </template>
        </el-table-column>
        <el-table-column width="300" align="center" prop="claContent" label="内容"/>
        <el-table-column align="center" label="删除">
          <template slot-scope="scope">
            <el-button
              circle
              type="danger"
              icon="el-icon-delete"
              @click.native.prevent="deleteRow(scope.$index, submit['tClause'])"
            />
          </template>
        </el-table-column>
      </el-table>
      <!-- 排程事件 -->
      <el-row :gutter="15">
        <el-col :span="24" align="middle">
          <div class="grid-content bg-purple">排程事件</div>
        </el-col>
      </el-row>
      <el-row :gutter="15">
        <el-col :offset="6" :span="4">
          <el-form-item label="事件持续(天):">
            <el-input-number v-model="scheduling.eventDuration" :min="1" :max="10" :controls="false" style="width:100%"/>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="条款类型:">
            <el-select v-model="scheduling.claType" clearable placeholder="请选择类型">
              <el-option
                v-for="item in claTypeArr"
                :key="item.label"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <!-- <el-col :span="8" :offset="3" align="right">
          <el-button type="primary" @click.native.prevent="addPlaces">新增地点</el-button>
        </el-col> -->
      </el-row>
      <el-row>
        <el-col :span="6">
          <el-form-item label="大厦:" label-width="50px">
            <el-select
              v-model="scheduling['blId']"
              clearable
              placeholder="请选择大厦"
              @change="getPlaces('floor')"
              @clear="clearPlaces('floor')">
              <el-option
                v-for="(item,index) in scheduling['blData']"
                :key="index"
                :label="item.name"
                :value="item.blId +'|'+ item.name"/>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="楼层:" label-width="50px">
            <el-select
              v-model="scheduling['flId']"
              clearable
              placeholder="请选择楼层"
              @change="getPlaces('room')"
              @clear="clearPlaces('room')">
              <el-option
                v-for="(item,index) in scheduling['flData']"
                :key="index"
                :label="item.name"
                :value="item.flId +'|'+ item.name"/>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="房间:" label-width="50px">
            <el-select
              v-model="scheduling['rmId']"
              clearable
              placeholder="请选择房间"
              @change="getPlaces('eqId')"
              @clear="clearPlaces('eqId')">
              <el-option
                v-for="(item,index) in scheduling['rmData']"
                :key="index"
                :label="item.name"
                :value="item.rmId +'|'+ item.name"/>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col v-if="equipMent" :span="6">
          <el-form-item label="设备:" label-width="50px">
            <el-select v-model="scheduling['eqId']" clearable placeholder="请选择设备">
              <el-option
                v-for="(item,index) in scheduling['eqData']"
                :key="index"
                :label="item.eqStd"
                :value="item.eqId +'|'+ item.eqStd"/>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <!-- 定义循环方式 -->
      <el-row :gutter="15">
        <el-col :span="20" align="middle">
          <div class="grid-content bg-purple">
            循环方式
          </div>
        </el-col>
        <el-col :span="4" align="right">
          <el-button
            v-if="circulate"
            type="primary"
            @click.native.prevent="addContractDetail"
          >添加维护保养计划</el-button>
        </el-col>
      </el-row>
      <el-row :gutter="15">
        <el-col :span="8">
          <el-form-item label="循环方式:" label-width="90px">
            <el-radio-group v-model="loop.date" @change="cycle">
              <el-radio label="week" border>周</el-radio>
              <el-radio label="month" border>月</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item :label="Object.is(loop.date,'month') ? '间隔时间(月):' : '间隔时间(周):'">
            <el-input-number v-model="loop.interval" :min="1" :max="6" :controls="false"/>
          </el-form-item>
        </el-col>
        <el-col v-if="plannedDate" :span="6">
          <el-form-item label="计划日期(周):">
            <el-select v-model="loop.implement" clearable placeholder="请选择日期">
              <el-option
                v-for="item in dayArr"
                :key="item.label"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col v-else :span="8">
          <el-form-item label="计划日期(号):">
            <el-input-number v-model="loop.implement" :min="1" :max="31" :controls="false"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="内容:" label-width="60px">
            <el-input
              :autosize="{ minRows: 3, maxRows: 3}"
              v-model="loop.content"
              type="textarea"
              resize="none"
              placeholder="请输入具体内容或其他循环方式"/>
          </el-form-item>
        </el-col>
      </el-row>
      <!-- 问卷 -->
      <el-row :gutter="15">
        <el-col :span="24" align="middle">
          <div class="grid-content bg-purple">合同问卷</div>
        </el-col>
      </el-row>
      <el-row :gutter="15">
        <el-col :offset="10" :span="6" align="center">
          <el-form-item label="问卷名称:" label-width="85px" prop="queName">
            <el-input v-model="submit['tContract']['queName']" readonly placeholder="请选择或新建问卷"/>
          </el-form-item>
        </el-col>
        <el-col :span="8" align="right">
          <CreateQuestion :create-que-handle="createQueHandle" que-type="定期"/>
        </el-col>
      </el-row>
      <!-- 问卷列表 -->
      <el-table
        v-loading="question['listLoading']"
        ref="table"
        :data="question['list']"
        :row-style="tableStripeCallBack"
        border
        max-height="560"
        empty-text="请新建问卷"
        element-loading-text="获取列表中"
        @expand-change="findQuetsion">
        <el-table-column width="80" align="center" type="expand" label="详情">
          <template slot-scope="{row}">
            <el-form v-for="item in question['problemsData']" :key="item.proId" label-position="left" inline>
              <el-form-item label="问题" label-width="40px">{{ item.proOrder }}</el-form-item>
              <el-form-item>{{ item.proProblem }}</el-form-item>
            </el-form>
            <el-form>
              <el-form-item label="问卷备注:" label-width="90">
                <el-input
                  v-model="row['comments']"
                  :autosize="{ minRows: 5, maxRows: 5}"
                  style="width:50%"
                  type="textarea"
                  resize="none"
                  readonly/>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column width="80" align="center" prop="queId" label="问卷编码"/>
        <el-table-column width="400" align="center" prop="queName" label="问卷名称"/>
        <el-table-column align="center" prop="isValid" label="是否有效">
          <template slot-scope="{row}">
            <el-tag :type="row.isValid | isValidFilter">{{ row.isValid | isValidNameFilter }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="operationDaytime" label="更改时间"/>
        <el-table-column align="center" label="操作">
          <template slot-scope="scope">
            <el-button
              type="success"
              size="mini"
              @click.native.prevent="selectQuestionName(scope.$index, question['list'])"
            >选择</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 新建问卷 -->
      <el-dialog :visible.sync="question['questionDialog']" align="center" title="新建问卷">
        <el-form ref="problemRule" :model="submit['tProblem']">
          <el-row :gutter="15">
            <el-col :span="10">
              <el-form-item
                :rules="[{ required: true, message: '请输入问卷名称', trigger: 'blur' }]"
                label="问卷名称:"
                prop="queName"
              >
                <el-input v-model="submit['tProblem']['queName']" clearable style="width:200px"/>
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item label="问题名称:">
                <el-input v-model="question.questionName" clearable style="width:200px"/>
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-button
                type="primary"
                icon="el-icon-plus"
                circle
                @click.native.prevent="addQuestionName"
              />
            </el-col>
          </el-row>
          <el-table
            :data="submit['tProblem']['proProblem']"
            border
            height="309"
            empty-text="请添加问题名称"
            style="width:100%"
          >
            <el-table-column width="80" align="center" type="index" label="问题编码"/>
            <el-table-column width="500" align="center" prop="proProblem" label="问题名称"/>
            <el-table-column align="center" label="问题答案">
              <template
                slot-scope="{row}"
              >{{ row.tAnswer[0].ansAnswer }} / {{ row.tAnswer[1].ansAnswer }}</template>
            </el-table-column>
            <el-table-column align="center" label="删除">
              <template slot-scope="scope">
                <el-button
                  circle
                  type="danger"
                  icon="el-icon-delete"
                  @click.native.prevent="deleteRow(scope.$index, submit['tProblem']['proProblem'])"
                />
              </template>
            </el-table-column>
          </el-table>
        </el-form>
        <div slot="footer">
          <el-button @click.native.prevent="question['questionDialog'] = false">取 消</el-button>
          <el-button
            v-loading="question['submitLoading']"
            :disabled=" submit['tProblem']['proProblem'].length === 0 ? true : false"
            type="primary"
            @click.native.prevent="addQuestionNaire"
          >{{ question['submitLoading'] ? '提交中' : '提 交' }}</el-button>
        </div>
      </el-dialog>
      <!-- 提交 -->
      <el-row>
        <el-col :offset="5" :span="12" align="center">
          <el-pagination
            :page-sizes="pageSizes"
            :current-page="pagination['currentPage']"
            :page-size="pagination['pageSize']"
            :total="pagination['total']"
            layout="total, sizes, prev, pager, next, jumper"
            @current-change="currentChange"
            @size-change="handleSizeChange"/>
        </el-col>
        <el-col :offset="5" :span="2" align="right">
          <el-button
            :loading="contractLoading"
            type="primary"
            class="submit"
            @click.native.prevent="subMission"
          >{{ contractLoading ? '提交中' : '提交' }}</el-button>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
// 接口
import {
  getNewContract,
  getNewQuestionNaire,
  getQuestionnairesList,
  findContractResPerson,
  getQuestionnaireDetailsByQueId
} from '@/api/contract'

import { findByEquipment } from '@/api/equipment/definition'

import { getAllBuildingDataById } from '@/api/enumeration'

import { tableStripeCallBack } from '@/utils/style'

import {
  checkContractIdExist
} from '@/utils/validate/contract'

import {
  conTypesArr,
  conPriorityArr,
  claTypeArr,
  dayArr,
  tempBlArr,
  tempFlArr,
  tempRmArr,
  tempDeviceArr
} from '@/utils/enumerationList/contract'

import {
  conTypeFilter,
  conModesFilter,
  conIntervalWeekFilter,
  isValidFilter,
  isValidNameFilter
} from '@/filter/contract'

import { default as CreateQuestion } from '../dialog/createQuestion'

import { phoneReg } from '@/utils/validate/reg'

import { pageSizes } from '@/utils/globalConfig'

export default {
  components: {
    CreateQuestion
  },
  filters: {
    conTypeFilter,
    conModesFilter,
    conIntervalWeekFilter,
    isValidFilter,
    isValidNameFilter
  },
  // 子组件通过props来接收数据:
  props: {
    'conType': {
      type: String,
      default: ''
    }
  },
  data() {
    const conTermChange = (rule, value, callback) => {
      const regular = /^\d{0,1}(\.\d{0,1})?$/g
      if (!value || Object.is(value, '0')) {
        return callback(new Error('签约期限不能为空或0'))
      }
      if (value > 3) {
        callback(new Error('签约期限不能大于3年'))
      }
      if (!regular.test(value)) {
        return callback(new Error('签约期限只能输入数字加1位小数和一个点'))
      }
      callback()
    }
    const totalAmountChange = (rule, value, callback) => {
      const regular = /^\d{0,9}(\.\d{0,2})?$/g
      if (!value || Object.is(value, '0')) {
        return callback(new Error('合同总金额不能为空或0'))
      }
      if (!regular.test(value)) {
        return callback(new Error('合同总金额只能输入数字加2位小数和一个点'))
      }
      callback()
    }
    return {
      uploadData: new FormData(),
      pageSizes,
      conTypesArr,
      conPriorityArr,
      dayArr,
      claTypeArr,
      tempBlArr,
      tempFlArr,
      tempRmArr,
      tempDeviceArr,
      // 日期快捷方式
      contractStartPicker: {
        shortcuts: [
          {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              end.setTime(end.getTime() + 3600 * 1000 * 24 * 90)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近六个月',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              end.setTime(end.getTime() + 3600 * 1000 * 24 * 180)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近一年',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              end.setTime(end.getTime() + 3600 * 1000 * 24 * 365)
              picker.$emit('pick', [start, end])
            }
          }
        ]
      },
      // 开始日期和结束日期
      startDateToEnd: [],
      // 医院责任人下拉框
      resPersonData: [],
      // 提交加载中
      contractLoading: false,
      // 提交
      submit: {
        // 新建合同
        tContract: {
          // 合同编码
          conId: '',
          // 合同名称
          conName: '',
          // 设备供应商
          supplier: '',
          // 维保单位
          maintDep: '',
          // 维保联系人
          maintPeople: '',
          // 联系人电话
          maintPhone: '',
          // 编辑人
          conContacts: '',
          // 医院责任人
          resPerson: '',
          // 合同类型
          conType: this.conType,
          // 签约期限
          conTerm: '',
          totalAmount: '',
          // 合同优先级
          conPriority: '',
          // 起止时间
          dateStart: '',
          // 说明
          comments: '',
          // 判断问卷名称
          queName: ''
        },
        // 合同条款
        tClause: [],
        // 问卷
        tQuestionnaire: {
          // 问卷id
          queId: '',
          // 问卷名称
          queName: '请从问卷列表中选择'
        },
        // 新建问卷
        tProblem: {
          // 编辑者
          editor: '',
          // 问卷名称
          queName: '',
          // 问卷问题组
          proProblem: []
        }
      },
      // 排程事件
      scheduling: {
        // 事件持续天数
        eventDuration: 1,
        // 条款类型
        claType: '',
        // 大厦
        blId: '',
        blData: [],
        // 房间
        flId: '',
        flData: [],
        // 房间
        rmId: '',
        rmData: [],
        // 设备
        eqId: '',
        eqData: [],
        // 地点汇总
        places: [
          {
            blId: '',
            flId: '',
            rmId: '',
            eqId: ''
          }
        ]
      },
      // 循环方式
      loop: {
        // 循环周期
        date: 'week',
        // 间隔次数
        interval: 1,
        // 执行日期
        implement: '',
        // 具体内容
        content: ''
      },
      // 问卷
      question: {
        // 列表加载
        listLoading: false,
        // 新建问卷弹框
        questionDialog: false,
        // 提交加载
        submitLoading: false,
        // 问卷列表
        list: [],
        // 问题详情数组
        problemsData: [],
        // 问题次序
        proOrder: 1,
        // 问题名称
        questionName: ''
      },
      // 问卷分页,列表
      pagination: {
        currentPage: 1,
        pageSize: 10,
        total: 0
      },
      // 新建合同判断
      contractRule: {
        conId: [
          { required: true, message: '请输入合同编码', trigger: 'blur' },
          { validator: checkContractIdExist, trigger: 'blur' }
        ],
        conName: [
          { required: true, message: '请输入合同名称', trigger: 'blur' }
        ],
        supplier: [
          { required: true, message: '请输入设备供应商名称', trigger: 'blur' }
        ],
        maintDep: [
          { required: true, message: '请输入维保单位', trigger: 'blur' }
        ],
        maintPeople: [
          { required: true, message: '请输入维保联系人', trigger: 'blur' }
        ],
        maintPhone: [
          { required: true, message: '请输入联系人电话', trigger: 'blur' },
          { message: '请输入正确的固定电话或手机号', pattern: phoneReg }
        ],
        conContacts: [
          { required: true, message: '请输入合同编辑人', trigger: 'blur' }
        ],
        resPerson: [
          { required: true, message: '请选择院方责任人', trigger: 'blur' }
        ],
        conType: [
          { required: true, message: '请选择合同类型', trigger: 'blur' }
        ],
        conPriority: [
          { required: true, message: '请选择合同优先级', trigger: 'blur' }
        ],
        conTerm: [
          { required: true, validator: conTermChange, trigger: 'blur' }
        ],
        totalAmount: [
          { required: true, validator: totalAmountChange, trigger: 'blur' }
        ],
        queName: [
          { required: true, message: '请选择或新建问卷', trigger: 'blur' }
        ],
        dateStart: [
          { required: true, message: '请选择起止时间', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    // 设备
    equipMent() {
      const claType = ['device', '']
      if (claType.includes(this.scheduling['claType'])) {
        return true
      }
      return false
    },
    // 计划日期
    plannedDate() {
      if (Object.is(this.loop.date, 'week')) {
        return true
      }
      return false
    },
    // 添加循环方式
    circulate() {
      if (Object.is(this.submit['tClause'].length, 0)) {
        return true
      }
      return false
    }
  },
  watch: {
    // 判断起止日期
    startDateToEnd(v) {
      if (v && v[0]) {
        this.submit['tContract']['dateStart'] = v[0]
      } else {
        this.submit['tContract']['dateStart'] = ''
      }
    }
  },
  created() {},
  async mounted() {
    this.getPlaces('build')
    this.findContractResPerson()
    this.getQuestionNaireList()
  },
  methods: {
    // 表格隔行颜色
    tableStripeCallBack,
    // 循环周期发生改变时候
    cycle() {
      this.loop.interval = 1
      this.loop.implement = ''
      this.loop.content = ''
    },
    // 地点列表
    async getPlaces(type) {
      try {
        const params = {
          blId: this.scheduling['blId'].split('|')[0],
          flId: this.scheduling['flId'].split('|')[0],
          rmId: this.scheduling['rmId'].split('|')[0]
        }
        const r = await findByEquipment(params)
        this.scheduling['eqData'] = r.data
        if (Object.is(type, 'build')) {
          this.scheduling['flId'] = ''
          this.scheduling['rmId'] = ''
          const r = await getAllBuildingDataById(params)
          this.scheduling['blData'] = r['data']
        }
        if (Object.is(type, 'floor')) {
          this.scheduling['flId'] = ''
          this.scheduling['rmId'] = ''
          const r = await getAllBuildingDataById(params)
          this.scheduling['flData'] = r['data']
        }
        if (Object.is(type, 'room')) {
          this.scheduling['rmId'] = ''
          const r = await getAllBuildingDataById(params)
          this.scheduling['rmData'] = r['data']
        }
        // console.log(r['data'])
      } catch (e) {
        console.log(e)
      }
    },
    // 大厦楼层房间清除事件
    clearPlaces(type) {
      if (Object.is(type, 'floor')) {
        this.scheduling['blId'] = ''
        this.scheduling['flId'] = ''
        this.scheduling['rmId'] = ''
        this.scheduling['eqId'] = ''
      }
      if (Object.is(type, 'room')) {
        this.scheduling['flId'] = ''
        this.scheduling['rmId'] = ''
        this.scheduling['eqId'] = ''
      }
      if (Object.is(type, 'eqId')) {
        this.scheduling['rmId'] = ''
        this.scheduling['eqId'] = ''
      }
    },
    // 新增地点
    // addPlaces() {
    //   this.scheduling['places'].push({
    //     blId: '',
    //     flId: '',
    //     rmId: '',
    //     eqId: ''
    //   })
    // },
    // 添加合同内容
    // 间隔次数 interval: 1,  执行日期  implement: '',
    addContractDetail() {
      if (Object.is(this.scheduling.claType, '')) {
        this.$message({
          message: '请选择条款类型!',
          type: 'error'
        })
        return
      }
      if (Object.is(this.loop.implement, '')) {
        this.$message({
          message: '请选择计划日期!',
          type: 'error'
        })
        return
      }
      this.scheduling.places = [
        {
          blName: this.scheduling['blId'].split('|')[1],
          flName: this.scheduling['flId'].split('|')[1],
          rmName: this.scheduling['rmId'].split('|')[1],
          blId: this.scheduling['blId'].split('|')[0],
          flId: this.scheduling['flId'].split('|')[0],
          rmId: this.scheduling['rmId'].split('|')[0]
          // eqId: this.scheduling['eqId'].split('|')[0]
        }
      ]
      this.submit['tClause'].push({
        continuedDays: this.scheduling['eventDuration'],
        claType: this.scheduling['claType'],
        modes: this.loop['date'], // 循环方式
        cirDate: this.loop['implement'], // 循环日期
        intervalTimes: this.loop['interval'], // 间隔次数
        claContent: this.loop['content'].trim(),
        places: this.scheduling['places'] // 地点汇总
      })
      this.scheduling['eventDuration'] = 1
      this.scheduling['claType'] = ''
      this.scheduling['blId'] = ''
      this.scheduling['flId'] = ''
      this.scheduling['rmId'] = ''
      this.loop['date'] = 'week'
      this.loop['interval'] = 1
      this.loop['implement'] = ''
      this.loop['content'] = ''
      // console.log(this.submit['tClause'])
    },
    // 删除内容
    deleteRow(index, rows) {
      rows.splice(index, 1)
    },
    // 添加问题名称
    addQuestionName() {
      if (Object.is(this.question.questionName, '')) {
        this.$message({
          message: '问题名称不能为空！',
          type: 'error'
        })
        return
      }
      this.submit['tProblem']['proProblem'].push({
        proOrder: Number(this.question.proOrder++),
        proProblem: this.question.questionName.trim(),
        tAnswer: [
          {
            ansOrder: 1,
            ansAnswer: '是'
          },
          {
            ansOrder: 2,
            ansAnswer: '否'
          }
        ]
      })
      this.question.questionName = ''
      // console.log(this.submit['tProblem'])
    },
    // 撤销新建问卷弹框
    createQueHandle(id, queName) {
      // console.log(id, queName)
      this.submit['tQuestionnaire']['queId'] = id
      this.submit['tQuestionnaire']['queName'] = queName
      this.submit['tContract']['queName'] = queName
      this.getQuestionNaireList()
    },
    // 责任人下拉框
    async findContractResPerson() {
      try {
        const r = await findContractResPerson()
        this.resPersonData = r['data']
        // console.log(r['data'])
      } catch (e) {
        console.log(e)
      }
    },
    // 新建问卷提交
    async addQuestionNaire() {
      this.question['submitLoading'] = true
      try {
        const problemFlag = await this.$refs['problemRule'].validate()
        if (problemFlag) {
          const r = await getNewQuestionNaire(this.submit['tProblem'])
          this.submit['tQuestionnaire']['queName'] = this.submit['tProblem'][
            'queName'
          ]
          this.submit['tContract']['queName'] = this.submit['tProblem'][
            'queName'
          ]
          this.submit['tQuestionnaire']['queId'] = r['data']
          this.$message({
            message: '问卷创建成功！',
            type: 'success'
          })
          this.question['questionDialog'] = false
          this.submit['tProblem']['queName'] = ''
          this.submit['tProblem']['proProblem'] = []
        }
        // console.log(r['data'])
      } catch (e) {
        console.log(e)
      } finally {
        this.question['submitLoading'] = false
        this.getQuestionNaireList()
      }
    },
    // 问卷列表
    async getQuestionNaireList() {
      const params = {
        pageCurrent: this.pagination['currentPage'],
        pageSize: this.pagination['pageSize'],
        queType: this.conType
      }
      this.question['listLoading'] = true
      try {
        const r = await getQuestionnairesList(params)
        this.pagination['total'] = r['data']['rowCount']
        this.question['list'] = (r['data']['records']).reverse()
        // console.log(r['data']['records'])
      } catch (e) {
        console.log(e)
      } finally {
        this.question['listLoading'] = false
        this.$refs.table.bodyWrapper.scrollTop = 0
      }
    },
    // 查找问题
    async findQuetsion(row, expanded) {
      try {
        const params = {
          queId: row['queId']
        }
        // console.log(row, expanded)
        const r = await getQuestionnaireDetailsByQueId(params)
        this.question['problemsData'] = r['data']['problems']
        // console.log(r['data'])
      } catch (e) {
        console.log(e)
      }
    },
    // 问卷分页
    currentChange(targetPage) {
      this.pagination['currentPage'] = targetPage
      this.getQuestionNaireList()
    },
    // 分页跳转
    handleSizeChange(size) {
      this.pagination['pageSize'] = size
      this.pagination['currentPage'] = 1
      this.getQuestionNaireList()
    },
    // 选择合同问卷
    selectQuestionName(index, rows) {
      this.submit['tContract']['queName'] = rows[index].queName
      this.submit['tQuestionnaire']['queName'] = rows[index].queName
      this.submit['tQuestionnaire']['queId'] = rows[index].queId
    },
    // 新建合同提交
    async subMission(v) {
      this.submit.tContract['dateStart'] = this.startDateToEnd[0]
      this.submit.tContract['dateEnd'] = this.startDateToEnd[1]
      // 维护保养计划
      if (Object.is(this.submit['tClause'].length, 0)) {
        this.$message({
          message: '请添加维护保养计划！',
          type: 'error'
        })
        return
      }
      try {
        const flag = await this.$refs['contractRule'].validate()
        if (flag) {
          this.contractLoading = true
          this.uploadData.delete('tContract')
          this.uploadData.delete('tClause')
          this.uploadData.delete('tQuestionnaire')
          this.uploadData.append('tContract', JSON.stringify(this.submit.tContract))
          this.uploadData.append('tClause', JSON.stringify(this.submit.tClause))
          this.uploadData.append('tQuestionnaire', JSON.stringify(this.submit.tQuestionnaire))
          await getNewContract({ data: this.submit })
          this.$message({
            message: '合同创建成功！',
            type: 'success'
          })
          this.empty()
        }
        // console.log(r['data'])
      } catch (e) {
        console.log(e)
      } finally {
        this.contractLoading = false
      }
    },
    // 文件上传
    async uploadFunc(v) {
      this.uploadData.delete('file')
      this.uploadData.append('file', v['file'])
    },
    // 提交后清空
    empty() {
      this.startDateToEnd = []
      this.$refs['contractRule'].resetFields()
      this.submit['tClause'] = [
        { blId: '', flId: '', rmId: '' }
      ]
      this.scheduling['eventDuration'] = 1
      this.scheduling['claType'] = ''
      this.scheduling['places'] = [
        { blId: '', flId: '', rmId: '' }
      ]
      this.loop['date'] = 'week'
      this.loop['interval'] = 1
      this.loop['implement'] = ''
      this.loop['content'] = ''
      this.submit['tQuestionnaire']['queName'] = ''
    }
  }
}
</script>

<style scoped>
.el-row {
  margin-bottom: 20px;
}

.el-col {
  border-radius: 4px;
}

.el-input {
  width: 80%;
}

.el-pagination{
  margin-top: 30px;
}

.bg-purple {
  background: #d3dce6;
}

.grid-content {
  border-radius: 4px;
  min-height: 36px;
  line-height: 36px;
}
.submit{
  margin-top: 25%;
}
</style>
