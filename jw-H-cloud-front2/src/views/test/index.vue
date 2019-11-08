<template>
  <div/>
</template>
<script>
export default {
  async mounted() {
    window.localStorage.setItem('token', '4E8F84277D3353F306406CBD961E5324F93F7E5D8269899ABBC84EF39C26655FA9189B02D0FD0F1CF315A6DB2729557F4E6DC6189D6D55D3E9A22D3E814FCB90BF1C67CE462BD74C88789205F4AFBE4E')
    // return
    this.$router.push('/equipment/category/list')
  }
}
</script>

