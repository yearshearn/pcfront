<template >
  <div style="padding:30px;">
    <el-container>
      <!-- 侧边栏 -->
      <el-aside width="400px">
        <el-tree
          v-loading="tree['departLoading']"
          :data="tree['treeData']"
          :props="tree['treeProps']"
          highlight-current
          empty-text="暂无数据"
          node-key="id"
          @node-click="handleCheckChange"
        />
        <!-- check 当复选框被点击的时候触发 1-->
      </el-aside>
      <el-container>
        <!-- 头部 -->
        <el-header>
          <el-row>
            <el-col :span="6">
              <el-button type="primary" @click="createDept">新增部门</el-button>
            </el-col>
            <el-col :span="6" :offset="12">
              <el-input
                v-model="department['search']"
                clearable
                placeholder="部门名称或部门编码"
                @clear="departList(true)"
                @keyup.enter.native="departList(true)">
                <el-button slot="append" icon="el-icon-search" @click="departList(true)"/>
              </el-input>
            </el-col>
          </el-row>
        </el-header>
        <!-- 主体 -->
        <el-main>
          <el-table
            v-loading="list['departLoading']"
            ref="table"
            :data="list['listData']"
            :row-style="tableStripeCallBack"
            align="center"
            max-height="600">
            <el-table-column type="index" align="center" label="序号" width="120"/>
            <el-table-column prop="deptName" align="center" label="部门名称" width="120"/>
            <el-table-column prop="code" align="center" label="部门编码"/>
            <el-table-column prop="realPath" align="center" label="全路径" show-overflow-tooltip/>
            <el-table-column prop="fcu" align="center" label="创建人" show-overflow-tooltip/>
            <el-table-column prop="fcd" align="center" label="创建时间" show-overflow-tooltip/>
            <el-table-column prop="state" align="center" label="状态">
              <template slot-scope="{row}">
                <el-tag :type="row.state | accStatusFilter">{{ row.state | accStatusNameFilter }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column align="center" label="操作选项" width="200">
              <template slot-scope="scope">
                <el-button
                  :disabled="department['operationLoading']"
                  size="mini"
                  @click="updateDetails(scope.row)"
                >编辑</el-button>
                <el-button
                  v-if="scope['row']['state'] == 1"
                  :disabled="department['operationLoading']"
                  size="mini"
                  type="danger"
                  @click="updateState(scope.row['deptId'], 0)"
                >禁用</el-button>
                <el-button
                  v-if="scope['row']['state'] == 0"
                  :disabled="department['operationLoading']"
                  size="mini"
                  type="success"
                  @click="updateState(scope.row['deptId'], 1)"
                >启用</el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-row>
            <el-col align="center">
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
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import { tableStripeCallBack } from '@/utils/style'

import { pageSizes } from '@/utils/globalConfig'

import {
  getDepartList,
  departOptions,
  updateDepartmentStatus
} from '@/api/mis/dms/dmsList.js'

import { accStatusFilter, accStatusNameFilter } from '@/filter/ums/account.js'

export default {
  filters: {
    accStatusFilter,
    accStatusNameFilter
  },
  data() {
    return {
      pageSizes,
      // 部门id
      selectedNodeId: '',
      // 部门
      department: {
        // 搜索
        search: '',
        realSearch: '',
        operationLoading: false
      },
      // 列表
      list: {
        // 列表等待
        departLoading: false,
        // 列表数组
        listData: []
      },
      // 树桩
      tree: {
        treeFullPath: '',
        // 树桩列表
        treeData: [],
        // 树桩等待
        treeLoading: false,
        // 树桩分级
        treeProps: {
          children: 'options',
          label: 'deptName',
          value: 'deptId'
        }
      },
      // 分页
      pagination: {
        currentPage: 1,
        pageSize: 10,
        total: 0
      }
    }
  },
  watch: {
    selectedNodeId(v) {
      this.departList(true)
    }
  },
  created() {},
  async mounted() {
    this.departList()
    this.departTree()
  },
  methods: {
    // 表格隔行颜色
    tableStripeCallBack,
    // 新增部门
    createDept() {
      this.$router.push({
        name: 'addDepartment',
        params: {
          fullPathId: this.tree['treeFullPath']
        }
      })
      // console.log(this.tree['treeFullPath'])
    },
    // 编辑跳转
    updateDetails(row) {
      this.$router.push({
        name: 'departmentDetail',
        params: {
          deptId: row['deptId']
        }
      })
    },
    // 部门列表
    async departList(search, jump) {
      this.department['departLoading'] = true
      try {
        const params = {
          pageNum: this.pagination['currentPage'],
          pageSize: this.pagination['pageSize']
        }
        if (search) {
          params['pageNum'] = 1
          this.department['realSearch'] = this.department['search']
          params['key'] = this.department['realSearch']
        }
        if (jump) {
          this.department['search'] = this.department['realSearch']
        }
        if (this.selectedNodeId) {
          params['parentDeptId'] = this.selectedNodeId
        }
        const r = await getDepartList(params)
        this.pagination['pageSize'] = r['data']['pageSize']
        this.pagination['total'] = r['data']['count']
        this.list['listData'] = r['data']['list']
        // console.log(this.list['listData'], this.pagination['pageSize'])
      } catch (e) {
        console.log(e)
      } finally {
        this.list['departLoading'] = false
        this.$refs.table.bodyWrapper.scrollTop = 0
      }
    },
    // 树桩
    async departTree() {
      this.tree['treeLoading'] = true
      try {
        const r = await departOptions()
        this.tree['treeData'] = r['data']
      } catch (e) {
        console.log(e)
      } finally {
        this.tree['treeLoading'] = false
      }
    },
    // 树桩节点发生改变
    async handleCheckChange(v, node) {
      const data = node.data
      const temp = []
      // this.selectedNodeId = v['deptId']
      if (node['level'] <= 1) {
        this.selectedNodeId = ''
      } else {
        this.selectedNodeId = node.parent.data.deptId
      }
      if (node['level'] < 2) {
        temp.push(data['deptId'])
      } else {
        this.getParent(node, temp)
      }
      this.tree['treeFullPath'] = temp
      // console.log(this.tree['treeFullPath'])
    },
    // 递归筛选
    getParent(node, temp) {
      if (node['level'] === 0) {
        return ''
      }
      if (node['data']['deptId']) {
        temp.unshift(node['data']['deptId'])
      }
      if (node.parent) {
        const r = this.getParent(node.parent, temp)
        if (r) {
          temp.unshift(r)
        }
      }
    },
    // 分页
    currentChange(targetPage) {
      this.pagination['currentPage'] = targetPage
      this.departList(false, true)
    },
    // 分页跳转
    handleSizeChange(size) {
      this.pagination['pageSize'] = size
      this.pagination['currentPage'] = 1
      this.departList()
    },
    // 改变状态
    async updateState(id, status) {
      this.department['operationLoading'] = true
      try {
        const body = {
          deptId: id,
          state: status
        }
        await updateDepartmentStatus(body)
        this.$message({
          message: '操作成功！',
          type: 'success'
        })
      } catch (e) {
        console.log(e)
      } finally {
        this.department['operationLoading'] = false
        this.departList()
      }
    }
  }
}
</script>

<style scoped>
  .el-header {
    line-height: 60px;
  }

  .el-aside {
    background: rgba(253, 253, 253, 1);
    box-shadow: 0px 0px 2px 0px rgba(0, 0, 0, 0.5);
    border-radius: 4px;
  }

  .el-tree {
    height: 100%;
  }

  .el-pagination{
    margin-top: 30px;
  }
</style>
