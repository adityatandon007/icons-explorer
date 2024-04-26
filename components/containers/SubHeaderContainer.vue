<template>
  <div class="pt-5 sub-header">
    <div v-if="!reverseImage" class="px-5 pb-5">
      <div class="d-flex justify-content-between align-items-center">
        <h2 class="mb-2 font-weight-bold">{{ heading }}</h2>
      </div>
      <div class="d-flex">
        <div class="font-14 text-secondary overflow-auto">
          <p class="font-weight-normal mb-0">{{ description }}</p>
        </div>
      </div>
    </div>
    <div v-else class="px-5 pb-5">
      <div class="d-flex align-items-center">
        <div class="d-flex align-items-center justify-content-center p-2 mr-5 image-wrapper">
          <picture>
            <img loading="lazy" src="" class="image-ctx">
          </picture>
          <div class="d-flex align-items-center justify-content-center overlay" @click="$bvModal.show('rev-search-modal')">
            <img src="~/assets/img/reverse-image-search.svg" alt="Image Search" width="24">
          </div>
        </div>
        <div>
          <h2 class="d-inline-block mb-0">Search by image</h2>
          <div>Showing {{ count }} similar-looking Design assets</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: { count: Number, query:String, assetType:String, description:String, reverseImage: Boolean },
  computed: {
    heading () {
      return `${this.count} ${this.query} ${this.assetType}`
    }
  }
}
</script>
<style lang="scss" scoped>
.sub-header {
  background: #FAFAFC;
}
.image-wrapper {
  position: relative;
  width: 96px;
  height: 96px;
  border: 2px solid #3aa0ff;
  border-radius: 8px;
  .image-ctx {
    width: 100%;
    height: 100%;
    max-width: 88px;
    max-height: 88px;
    border-radius: 4px;
  }
  .overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    cursor: pointer;
    transition: background-color 0.3s ease;
    border-radius: 6px;
    &:hover {
      background-color: rgba(0,0,0,0.6);
    }
  }
}
</style>