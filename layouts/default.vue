<template>
  <div class="layout">
    <div class="content">
      <Header />
      <nuxt />
      <Footer />
    </div>
  </div>
</template>
<script>
import Header from '@/components/shared/header/Header.vue'
import Footer from '@/components/shared/footer/Footer.vue'
export default {
  components: {
    Header,
    Footer,
  },
};
</script>
<style lang="scss">
#__layout,#__nuxt {
  height: 100%;
}
.layout {
  min-height: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
  .content {
    flex: 1 0 auto;
  }
}
</style>

