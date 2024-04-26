<template>
  <div class="vue-horizontal-list" ref="container">
    <div class="vhl-navigation">
      <div @click="prev" v-if="hasPrev" class="vhl-btn-left">
        <b-icon icon="chevron-left"></b-icon>
      </div>

      <div @click="next" v-if="hasNext" class="vhl-btn-right">
        <b-icon icon="chevron-right"></b-icon>
      </div>
    </div>

    <div class="vhl-container" :style="style.container">
      <div
        class="vhl-list"
        ref="list"
        :class="options.list.class"
        @scroll="scrollHandler"
      >
        <div
          v-for="item in items"
          ref="item"
          class="vhl-item"
          :class="options.item.class"
          :style="style.item"
        >
          <slot v-bind:item="item.item">{{
            item
          }}</slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: { itemList: Array },
  data () {
    return {
      position: 0,
      width: {
        container: 1214,
        window: 576,
      },
      scrollTimer: null
    }
  },
  mounted () {
    this.$resize = () => {
      this.width.window = window.innerWidth
      this.width.container = this.$refs.container.clientWidth
    }

    this.$resize()
    window.addEventListener('resize', this.$resize)
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.$resize)
  },
  computed: {
    items () {
      return [
        ...this.itemList.map((value) => ({ type: 'item', item: value }))
      ]
    },
    itemsLength () {
      return this.items.length
    },

    options () {
      return {
        item: {
          class: '',
          padding: 8
        },
        list: {
          class: '',
          windowed: 1200,
          padding: 24
        },
        responsive: [
          { end: 576, size: 1 },
          { start: 576, end: 768, size: 3 },
          { start: 768, end: 992, size: 5 },
          { start: 992, end: 1200, size: 7 },
          { start: 1200, size: 8 }
        ]
      }
    },

    style () {
      const style = {
        container: {},
        item: {}
      }
      const workingWidth = this.workingWidth
      const size = this.size
      style.item.paddingLeft = `${this.options.item.padding / 2}px`
      style.item.paddingRight = `${this.options.item.padding / 2}px`
      style.container.marginLeft = `-${this.options.item.padding / 2}px`
      style.container.marginRight = `-${this.options.item.padding / 2}px`
      style.item.width = `${(workingWidth - (size - 1) * this.options.item.padding) / size}px`

      return style
    },

    itemWidth () {
      return (
        (this.workingWidth - (this.size - 1) * this.options.item.padding) / this.size
      )
    },
    workingWidth () {
      return this.width.container
    },
    size () {
      const width = this.workingWidth
      return this.options.responsive.find((value) => {
        return (
          (!value.start || value.start <= width) &&
          (!value.end || value.end >= width)
        );
      }).size
    },
    hasNext () {
      return this.itemsLength > this.position + this.size
    },
    hasPrev () {
      return this.position > 0
    },
  },
  methods: {
    go (position) {
      const maxPosition = this.itemsLength - this.size
      this.position = position > maxPosition ? maxPosition : position
      const left = this.itemWidth * this.position + this.position * this.options.item.padding
      this.$refs.list.scrollTo({ top: 0, left: left, behavior: 'smooth' })
    },
    prev () {
      this.go(this.position - this.size)
    },
    next () {
      this.go(this.position + this.size)
    },
    // On horizontal scroll re-evaluate the actual position
    scrollHandler() {
      clearTimeout(this.scrollTimer)

      // Renew timer
      this.scrollTime = setTimeout(() => {
        const parentLeftOffset = this.$refs['list'].getBoundingClientRect().left
        let items = this.items.map((item, index) => {
          const itemLeftOffset = this.$refs.item[index].getBoundingClientRect().left
          return Math.abs(itemLeftOffset - parentLeftOffset)
        })
        this.position = items.indexOf(Math.min(...items))
      }, 50)
    }
  }
}
</script>

<style scoped>
.vue-horizontal-list {
  position: relative;
}

.vhl-navigation {
  display: flex;
  align-items: center;
  position: absolute;
  width: 100%;
  height: 100%;
  margin-top: 0px;
}

.vhl-btn-left,
.vhl-btn-right {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 24px;
  background: white;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
  z-index: 2;
}

.vhl-btn-left:hover,
.vhl-btn-right:hover {
  cursor: pointer;
}

.vhl-btn-left {
  margin-left: -24px;
  margin-right: auto;
}

.vhl-btn-right {
  margin-left: auto;
  margin-right: -24px;
}

.vhl-container {
  overflow-y: hidden;
  height: 100%;
  margin-bottom: -24px;
}

.vhl-list {
  display: flex;
  padding-bottom: 24px;
  margin-bottom: -24px;
  overflow-x: scroll;
  overflow-y: hidden;
  scroll-behavior: smooth;
  -webkit-overflow-scrolling: touch;
  scroll-snap-type: x mandatory;
}

.vhl-item {
  box-sizing: content-box;
  padding-top: 24px;
  padding-bottom: 24px;
  z-index: 1;
}

.vhl-list > * {
  scroll-snap-align: start;
  flex-shrink: 0;
}
</style>
