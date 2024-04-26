<template>
  <div>
    <article :title="item.name" class="asset-container">
      <nuxt-link exact :to="item.slug" class="link-block">
        <picture class="thumb">
          <img :alt="item.name" loading="lazy" :src="item.urls.thumb">
        </picture>
      </nuxt-link>
      <div class="overlay-content">
        <div class="header">
          <button name="Add to collection" type="button" class="btn btn-default btn-icon btn-action">
            <img src="~/assets/img/folder-plus.svg" alt="add to collection">
          </button>
        </div>
        <h3 class="title">{{item.name}}</h3>
        <div class="footer">
          <button name="download" type="button" class="btn btn-default btn-icon btn-action">
            <img src="~/assets/img/download-asset.svg" alt="download-asset">
          </button>
        </div>
      </div>
    </article>
  </div>
</template>
<script>
export default {
  props: { item: Object }
}
</script>
<style lang="scss" scoped>
.asset-container {
  display: block;
  border-radius: 12px;
  background-color: #FAFAFC;
  position: relative;
  width: 280px;
  height: 210px;
  .link-block {
    padding: 0.5rem 0.75rem;
    height: 100%;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    .thumb {
      position: relative;
      overflow: hidden;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100%;
      width: 100%;
      > img {
        pointer-events: none;
        max-width: 100%;
        max-height: 100%;
        transition: all 0.3s ease;
      }
    }
    > video {
      pointer-events: none;
      max-width: 100%;
      max-height: 100%;
      transition: all 0.3s ease;
    }
  }
  .overlay-content {
    opacity: 0;
    &::before {
      content: '';
      display: block;
      background: rgba(46,51,76,0.1);
      transition: opacity 0.15s linear;
      border-radius: 12px;
      pointer-events: none;
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
    }
    .header {
      position: absolute;
      right: .75rem;
      top: .75rem;
    }
    .title {
      position: absolute;
      left: .75rem;
      bottom: .75rem;
      font-size: .875rem;
      font-weight: 400;
      line-height: 1.5rem;
      margin: 0;
      max-width: calc(100% - 80px);
      color: #737999;
      pointer-events: none;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .footer {
      position: absolute;
      right: .75rem;
      bottom: .75rem;
    }
    .btn-action {
      width: 36px;
      height: 36px;
      padding: 0.25rem;
      transition: all 0.22s;
      box-shadow: 0 1px 3px rgba(0,0,0,0.08),0 4px 8px rgba(0,0,0,0.04);
    }
  }
  &:hover {
    .overlay-content {
      opacity: 1;
      &::before {
        opacity: 1;
      }
    }
    .link-block {
      .thumb {
        > img {
          transform: scale(1.05);
        }
      }
      video {
        transform: scale(1.05);
      }
    }
  }
}
</style>