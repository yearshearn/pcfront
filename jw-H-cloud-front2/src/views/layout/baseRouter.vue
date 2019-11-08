<template>
  <!-- <div class="app-main"> -->
  <transition name="fade-transform" mode="out-in">
    <!-- or name="fade" -->
    <!-- <router-view :key="key"></router-view> -->
    <router-view/>
  </transition>
  <!-- </div> -->
</template>

<script>
export default {
  name: 'AccountMain',
  computed: {
    // key() {
    //   return this.$route.name !== undefined ? this.$route.name + +new Date() : this.$route + +new Date()
    // }
  }
}
</script>

<style scoped>
.app-main {
  /*50 = navbar  */
  min-height: calc(100vh - 50px);
  position: relative;
  overflow: hidden;
}
</style>
