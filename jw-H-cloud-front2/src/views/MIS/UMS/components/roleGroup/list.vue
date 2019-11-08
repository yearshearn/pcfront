<template >
  <div style="padding:30px;">
    <el-container>
      <!-- 侧边栏 -->
      <el-aside width="400px">
        <el-tree
          :data="treeData"
          :props="defaultProps"
          highlight-current
          empty-text="暂无数据"
          node-key="groupId"
          @node-click="handleTreeNodeClick"
        />
      </el-aside>
      <el-container>
        <!-- 头部 -->
        <el-header>
          <el-row>
            <el-col :span="6">
              <el-button type="primary" @click="createDept">新增角色组</el-button>
            </el-col>
            <el-col :span="6" :offset="12">
              <el-input
                v-model="search['search']"
                clearable
                placeholder="搜索"
                @clear="getListByPid(true)"
                @keyup.enter.native="getListByPid(true)">
                <el-button slot="append" icon="el-icon-search" @click="getListByPid(true)"/>
              </el-input>
            </el-col>
          </el-row>
        </el-header>
        <!-- 主体 -->
        <el-main>
          <el-table
            v-loading="isLoading"
            ref="table"
            :data="listData"
            :row-style="tableStripeCallBack"
            max-height="620"
            border
            align="center">
            <el-table-column prop="date" align="center" label="#" width="80" type="index"/>
            <el-table-column prop="groupName" align="center" label="名称" min-width="50%"/>
            <!-- <el-table-column prop="lcd" align="center" label="编码"/> -->
            <el-table-column prop="realPath" show-overflow-tooltip align="center" min-width="50%" label="全路径"/>
            <!-- <el-table-column prop="fcd" align="center" label="电话"/> -->
            <el-table-column
              align="center"
              prop="state"
              show-overflow-tooltip
              width="100"
              label="状态">
              <template slot-scope="{row}">
                <el-tag :type="row.state | roleGroupStatusFilter">
                  {{ row.state | roleGroupStatusNameFilter }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column align="center" label="操作选项">
              <template slot-scope="scope">
                <el-button
                  :disabled="isLoading"
                  size="mini"
                  @click="updateDetails(scope.row)"
                >编辑</el-button>
                <el-button
                  v-if="scope.state === 0 || scope.state === '0'"
                  :disabled="isLoading"
                  size="mini"
                  @click="changeStatus(scope['row']['groupId'],1)"
                >停用</el-button>
                <el-button
                  v-if="scope.state === 1 || scope.state === '1'"
                  :disabled="isLoading"
                  size="mini"
                  @click="changeStatus(scope['row']['groupId'],0)"
                >启用</el-button>
                <!-- <el-button size="mini">启用</el-button> -->
              </template>
            </el-table-column>
          </el-table>
          <el-row style="text-align:center">
            <el-col :span="24">
              <el-pagination
                :current-page="paginationData['currentPage']"
                :page-sizes="pageSizes"
                :page-size="paginationData['pageSize']"
                :total="paginationData['total']"
                style="padding-top:10px"
                layout="total, sizes, prev, pager, next, jumper"
                @size-change="handleSizeChange"
                @current-change="currentChange"/>
            </el-col>
          </el-row>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import { roleGroupStatusFilter, roleGroupStatusNameFilter } from '@/filter/ums/roleGroup'

import {
  getRoleGroupTreeList,
  getRoleGroupListByParentId,
  updateRoleGroupStatus
} from '@/api/mis/ums/roleGroup'

import { tableStripeCallBack } from '@/utils/style'

import { pageSizes } from '@/utils/globalConfig'

export default {
  filters: { roleGroupStatusFilter, roleGroupStatusNameFilter },
  data() {
    return {
      pageSizes,
      isLoading: false,
      listData: [],
      treeData: [],
      defaultProps: {
        children: 'options',
        label: 'groupName',
        value: 'groupId'
      },

      search: {
        search: '',
        real: ''
      },
      selectedNodeId: '',
      treeFullPath: '',
      paginationData: {
        currentPage: 1,
        pageSize: 10,
        total: 0
      }
    }
  },
  watch: {
    selectedNodeId(v) {
      this.getListByPid(true)
    }
  },
  created() {},
  mounted() {
    this.getTreeList()
    this.getListByPid()
  },
  methods: {
    // 表格隔行颜色
    tableStripeCallBack,
    async changeStatus(id, status) {
      this.isLoading = true
      try {
        const body = {
          groupId: id,
          state: status
        }
        await updateRoleGroupStatus(body)
      } catch (e) {
        console.log(e)
      } finally {
        this.getListByPid()
      }
    },
    async getListByPid(search, jump) {
      this.isLoading = true
      try {
        if (search) {
          this.search['real'] = this.search['search']
          this.paginationData['currentPage'] = 1
        }
        if (jump) {
          this.search['search'] = this.search['real']
        }
        const params = {
          pageNum: this.paginationData['currentPage'],
          pageSize: this.paginationData['pageSize']
        }
        if (search) {
          params['groupName'] = this.search['real']
        }
        if (this.selectedNodeId) {
          params['parentGroupId'] = this.selectedNodeId
        }
        const r = await getRoleGroupListByParentId(params)
        this.listData = r['data']['list']
        this.paginationData['total'] = r['data']['count']
      } catch (e) {
        console.log(e)
      } finally {
        this.$refs.table.bodyWrapper.scrollTop = 0
        this.isLoading = false
      }

      // console.log(r)
    },
    handleTreeNodeClick(v, node) {
      const data = node.data
      // console.log(node) groupId
      // 查找子一级
      // this.selectedNodeId = v['groupId']
      // 查找本级
      // console.log(node)
      if (node['level'] <= 1) {
        this.selectedNodeId = ''
      } else {
        this.selectedNodeId = node.parent.data.groupId
      }
      // console.log(node)
      const temp = []
      if (node['level'] < 2) {
        temp.push(data['groupId'])
      } else {
        this.getParent(node, temp)
      }
      this.treeFullPath = temp
      // console.log(this.treeFullPath)
    },
    getParent(node, temp) {
      if (node['level'] === 0) {
        return ''
      }
      if (node['data']['groupId']) {
        temp.unshift(node['data']['groupId'])
      }
      if (node.parent) {
        const r = this.getParent(node.parent, temp)
        if (r) {
          temp.unshift(r)
        }
      }
    },
    async getTreeList() {
      try {
        const r = await getRoleGroupTreeList()
        this.treeData = r['data']
        // this.treeData.unshift({
        //   groupId: '',
        //   groupName: '只显示顶级'
        // })
      } catch (e) {
        console.log(e)
      }
    },
    currentChange(targetPage) {
      this.paginationData['currentPage'] = targetPage
      this.getListByPid(false, true)
    },
    createDept() {
      // console.log('add')
      this.$router.push({
        name: 'roleGroupCreate',
        params: {
          fullPathId: this.treeFullPath
        }
      })
    },
    updateDetails(v) {
      console.log(v)
      this.$router.push({
        name: 'roleGroupEdit',
        params: {
          roleGroupId: v['groupId'],
          fullPathId: this.treeFullPath
        }
      })
    },
    handleSizeChange(size) {
      this.paginationData['pageSize'] = size
      this.paginationData['currentPage'] = 1
      this.getListByPid()
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
</style>
