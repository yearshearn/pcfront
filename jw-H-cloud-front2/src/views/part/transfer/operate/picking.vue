<template>
  <el-container>
    <el-header>
      <el-row :gutter="15">
        <el-col :span="2">
          <router-link :to="path.picking" tag="span" event="click">
            <el-button
              :type="path.picking == $route.path ? 'primary' : '' "
              @click="operations('picking')">领料</el-button>
          </router-link>
        </el-col>
        <el-col :span="2">
          <router-link :to="path.returning" tag="span">
            <el-button
              :type="path.returning == $route.path ? 'primary' : '' "
              @click="operations('returning')">退料</el-button>
          </router-link>
        </el-col>
        <el-col :span="2">
          <router-link :to="path.purchasing" tag="span">
            <el-button
              :type="path.purchasing == $route.path ? 'primary' : '' "
              @click="operations('purchasing')">采购</el-button>
          </router-link>
        </el-col>
        <el-col :span="2">
          <router-link :to="path.backing" tag="span">
            <el-button
              :type="path.backing == $route.path ? 'primary' : '' "
              @click="operations('backing')">退供应商</el-button>
          </router-link>
        </el-col>
        <el-col :span="3" align="center">
          <router-link :to="path.reboot" tag="span">
            <el-button
              :type="path.reboot == $route.path ? 'primary' : '' "
              @click="operations('reboot')">一键退库</el-button>
          </router-link>
        </el-col>
      </el-row>
    </el-header>
    <el-main>
      <picking v-if="picking" :type-id="operation['typeId']"/>
      <returning v-if="returning" :type-id="operation['typeId']"/>
      <purchase v-if="purchase" :type-id="operation['typeId']"/>
      <backing v-if="backing" :type-id="operation['typeId']"/>
      <reboot v-if="reboot" :type-id="operation['typeId']"/>
    </el-main>
  </el-container>
</template>

<script>

import {
  default as picking
} from './components/picking'

import {
  default as returning
} from './components/returning'

import {
  default as purchase
} from './components/purchasing'

import {
  default as backing
} from './components/supplier'

import {
  default as reboot
} from './components/reboot'

export default {
  components: {
    // 领料
    picking,
    // 退料
    returning,
    // 采购
    purchase,
    // 退供应商
    backing,
    // 一键退库
    reboot
  },
  filters: {},
  props: {},
  data() {
    return {
      path: {
        picking: '/part/transfer',
        returning: '/part/transfer/returning',
        purchasing: '/part/transfer/purchasing',
        backing: '/part/transfer/backing',
        reboot: '/part/transfer/reboot'
      },
      // 操作
      operation: {
        type: 'picking',
        list: []
      }
    }
  },
  computed: {
    // 领料
    picking() {
      const operationType = ['picking']
      if (operationType.includes(this.operation['type'])) {
        return true
      }
      return false
    },
    // 退料
    returning() {
      const operationType = ['returning']
      if (operationType.includes(this.operation['type'])) {
        return true
      }
      return false
    },
    // 采购
    purchase() {
      const operationType = ['purchasing']
      if (operationType.includes(this.operation['type'])) {
        return true
      }
      return false
    },
    // 退供应商
    backing() {
      const operationType = ['backing']
      if (operationType.includes(this.operation['type'])) {
        return true
      }
      return false
    },
    // 一键退库
    reboot() {
      const operationType = ['reboot']
      if (operationType.includes(this.operation['type'])) {
        return true
      }
      return false
    }
  },
  created() {
  },
  async mounted() {},
  methods: {
    // 操作类型
    operations(type) {
      if (!Object.is(this.operation['type'], type)) {
        this.operation['type'] = type
        // console.log(this.operation.type)
      }
    }
  }
}
</script>

<style scoped>
  .el-container{
    margin: 30px 30px 0;
  }
</style>
