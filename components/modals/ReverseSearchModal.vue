<template>
  <b-modal id="rev-search-modal" content-class="reverse-image-modal" hide-footer>
     <template #modal-header>
       <div class="d-flex justify-content-between align-items-center w-100">
         <h6 class="d-inline-block font-weight-normal mb-0">Reverse Image Search</h6>
         <div class="d-flex align-items-center">
           <button class="clear">
             <b-icon icon="exclamation-circle" scale="1"></b-icon>
           </button>
           <button class="clear ml-5 mr-1" @click="closeModal">
             <b-icon icon="x" scale="1.5"></b-icon>
           </button>
         </div>
       </div>
     </template>
     <Cropper />
   </b-modal>
</template>
<script>
import Cropper from '../cropper/Cropper.vue'
export default {
  props: { image: String },
  components: {
    Cropper
  },
  data () {
    return {
      imgSrc: ''
    }
  },
  methods: {
    closeModal () {
      this.imgSrc = ''
      this.$bvModal.hide('rev-search-modal')
    },
  },
  watch: {
    image: function(newVal, oldVal) {
      if (newVal !== oldVal) {
        this.imgSrc = newVal
      }
    }
  }
}
</script>
<style scoped>
::v-deep .reverse-image-modal {
 border-radius: 12px;
 .modal-header {
   border-bottom: none;
 }
 .modal-body {
   padding: 0 1rem;
 }
}
</style>