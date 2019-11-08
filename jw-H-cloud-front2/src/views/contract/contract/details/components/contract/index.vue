<template>
  <transition name="fade-transform" mode="out-in">
    <LongContract v-if="conType==='长期'" con-type="长期"/>
    <DefaultContract v-if="conType ==='定期'" con-type="定期"/>
  </transition>
</template>

<script>
import {
  conTypesArr
} from '@/utils/enumerationList/contract'

import {
  DefaultContract,
  LongContract
} from './templates'

import { default as permission } from '@/directive/permission' // 权限判断指令
// import checkPermission from '@/utils/permission' // 权限判断函数

export default {
  components: {
    LongContract,
    DefaultContract
  },
  directives: {
    permission
  },
  props: {
    conType: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      conTypesArr,
      // 合同类型
      queType: ''
    }
  },
  computed: {

  },
  methods: {

  }
}
</script>
