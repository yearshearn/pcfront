<template style="height:100%">
  <div>
    <Details modeType="create"/>
  </div>
</template>

<script>
import { default as Details } from './template/details'
export default {
  components: { Details },
  filters: {
  },
  props: {
    mode: {
      type: String,
      default: 'create'
    }
  },
  data() {
    return {
    }
  },
  computed: {

  },
  created() {

  },
  async mounted() {
    if (this.mode === 'edit') {
      this.editInit()
    }
  },
  methods: {
    editInit() {
    }
  }
}
</script>

