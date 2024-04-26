<template>
  <header class="header sticky-top">
    <b-navbar>
      <b-navbar-brand href="/" class="mr-3">
        <img src="~/assets/img/iconscout-logo.svg" alt="Iconscout Logo" title="Iconscout Logo" width="192">
      </b-navbar-brand>
      <div class="search-bar mx-3">
        <div class="d-flex w-100 position-relative">
          <b-input-group class="search-wrap">
            <template #prepend>
              <b-dropdown :text="assetTypesMap[selectedAssetType].slice(0, 3)" class="btn-rounded" size="sm" variant="default" toggle-class="asset-dd p-1 font-12">
                <b-dropdown-item-button v-for="(value, key) in assetTypesMap" :key="key" :value="key" @click="updateSelectedAsset" >
                  {{ value }}
                </b-dropdown-item-button>
              </b-dropdown>
            </template>

            <b-form-input
              class="search-input" 
              type="text" 
              placeholder="Search from 8.6 Million+ assets"
              ref="searchInput"
              :value="searchValue"
              @update="updateSearchValue"
              @keydown.enter.prevent="goToSelectedAssetPage"
            ></b-form-input>
            <template #append>
              <b-button variant="default" size="sm" class="p-2 btn-image-search" @click="$bvModal.show('rev-search-modal')">
                <img src="~/assets/img/reverse-image-search.svg" alt="Image Search" width="24">
              </b-button>
            </template>
          </b-input-group>
        </div>
      </div>
      <b-navbar-nav class="flex-row">
        <b-nav-item>Explore</b-nav-item>
        <b-nav-item>Tools</b-nav-item>
        <b-nav-item>All Features</b-nav-item>
        <b-nav-item>Free Assets</b-nav-item>
        <b-nav-item>Learn</b-nav-item>
      </b-navbar-nav>
      <b-navbar-nav class="flex-row ml-auto d-flex">
        <b-nav-item>
          <b-button variant="default" class="btn-rounded">Log in</b-button>
        </b-nav-item>
        <b-nav-item>
          <b-button variant="primary" class="btn-rounded">Sign up</b-button>
        </b-nav-item>
      </b-navbar-nav>
    </b-navbar>
    <ReverseSearchModal />
  </header>
</template>
<script>
import ReverseSearchModal from '../../modals/ReverseSearchModal.vue';
export default {
  components: {
    ReverseSearchModal
  },
  data() {
    return {
      selectedAssetType: 'all-assets',
      searchValue: '',
      assetTypesMap: {
        'all-assets': 'All Assets',
        'lottie-animations': 'Lottie Animations',
        '3d-illustrations': '3D Illustrations',
        'illustrations': 'Illustrations',
        'icons': 'Icons'
      }
    };
  },
  methods: {
    updateSearchValue (val) {
      this.searchValue = val
    },
    updateSelectedAsset (event) {
      const {value} = event.target
      this.selectedAssetType = value
      if (this.searchValue) {
        this.goToSelectedAssetPage()
      }
    },
    goToSelectedAssetPage () {
      const {query} = this.$route
      this.$router.push({path: `/${this.selectedAssetType}/${this.searchValue}`, query})
    }
  },
  async fetch () {
    const { path, params, query } = this.$route
    this.updateSearchValue(params.name)
    this.selectedAssetType = path.split('/')[1] || 'all-assets'
  },
  watch: {
    '$route.path': function (newPath, oldPath) {
      console.log('path changed', newPath, oldPath)
      if (newPath !== oldPath) {
        const newAssetType = newPath.split('/')[1] || 'all-assets'
        this.selectedAssetType = newAssetType
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.header {
  background: #fff;
  box-shadow: 0px 2px 4px rgba(0,0,0,0.08), 0px 8px 12px rgba(0,0,0,0.04);
}
.search-bar {
  width: 350px;
  .search-wrap {
    position: relative;
    flex: 1;
    .search-input {
      padding: 0.5rem 2.25rem;
      font-size: 0.875rem;
      background-color: #EBEDF5;
      background-image: url('~assets/img/search-icon.svg');
      background-repeat: no-repeat;
      background-position: 8px center;
      height: 44px;
      text-overflow: ellipsis;
      &:focus {
        box-shadow: none;
        background-color: #fff;
        border-color: #D8DBEB;
      }
    }
  }
}
</style>
