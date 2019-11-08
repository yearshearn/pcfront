<template>
  <div class="dashboard-container">
    <!-- <div class="dashboard-text">登录名:{{ name }}</div> -->
    <workOrderChart/>
    <partChart/>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

import {
  default as workOrderChart
} from './components/aramark/workOrderChart'

import {
  default as partChart
} from './components/aramark/partChart'

export default {
  name: 'Dashboard',
  components: {
    partChart,
    workOrderChart
  },
  data() {
    return {

    }
  },
  computed: {
    ...mapGetters([
      'name',
      'roles'
    ])
  },
  created() {},
  async mounted() {
  },
  methods: {

  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
