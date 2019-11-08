<template style="height:100%">
  <el-collapse-item :name="arrIndex" >
    <template slot="title" >
      <h3>{{ arrIndex + 1 }}、{{ problemData['pro_problem'] }}</h3>
    </template>
    {{ problemData }}
  </el-collapse-item>
</template>

<script>

export default {
  name: 'Clause',
  filters: {

  },
  //   props: ['clauseData'],
  props: {
    problemData: {
      type: Object,
      default: null
    },
    arrIndex: {
      type: Number,
      default: null
    }
  },
  data() {
    return {
      canEdit: false
    }
  },
  watch: {
  },
  created() {
    // this.getDetails()
  },
  async mounted() {
    // console.log(this.$route.params)
    // console.log(this.problemData)
  },
  methods: {
    changeCanEdit() {
      this.canEdit = !this.canEdit
    },
    save() {
      this.canEdit = false
    },
    cancelSave() {
      this.canEdit = false
    }
  }
}
</script>

