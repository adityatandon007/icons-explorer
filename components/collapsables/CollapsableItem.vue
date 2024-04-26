<template>
  <div class="collapse-container">
    <button block :v-b-toggle="id" class="collapse-btn btn-block btn-zero" @click="collapse = !collapse">
      <span class="font-size-sm">{{ name }}</span>
      <b-icon :icon="collapse ? 'chevron-down' : 'chevron-right'"></b-icon>
    </button>
    <b-collapse :visible="collapse" :id="id">
      <slot name="collapse-content"></slot>
    </b-collapse>
  </div>
</template>
<script>
export default {
  data () {
    return {
      collapse: this.visible
    }
  },
  props: { name: String, visible: Boolean, id: String }
}
</script>
<style lang="scss">
.collapse-container {
  border-bottom: 1px solid #EBEDF5;
  .collapse-btn {
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: #000;
    padding: 1.25rem 1.5rem;
    position: relative;
  }
}
</style>
