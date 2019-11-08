<template>
  <el-container>
    <el-header style="margin-top:30px">
      <el-form label-width="120px" label-position="right">
        <el-form-item label="合同类型：">
          <el-select v-model="conType" placeholder="请选择合同类型">
            <el-option
              v-for="item in conTypesArr"
              :key="item.value"
              :label="item.label"
              :value="item.value"/>
          </el-select>
        </el-form-item>
      </el-form>
    </el-header>
    <el-main style="padding-top:0">
      <transition name="fade-transform" mode="out-in">
        <Term v-if="Object.is(conType, '定期')" con-type="定期"/>
        <LongTerm v-if="Object.is(conType, '长期')" con-type="长期"/>
      </transition>
    </el-main>
  </el-container>
</template>

<script>
import {
  conTypesArr
} from '@/utils/enumerationList/contract'

import {
  Term,
  LongTerm
} from './templates'

export default {
  components: {
    Term,
    LongTerm
  },
  data() {
    return {
      conTypesArr,
      // 合同类型
      conType: ''
    }
  },
  computed: {

  },
  methods: {

  }
}
</script>
