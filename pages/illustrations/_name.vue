<template>
  <div>
    <section>
      <div v-if="$fetchState.pending" class="px-5 py-5">
        <b-skeleton-img no-aspect height="96px" />
      </div>
      <SubHeaderContainer v-else :count="count" :query="search" :asset-type="assetTypesMap[filters.asset.value]" description="Lorem ipuum dolor lorem ipsum dolor" />
    </section>
    <main>
      <div class="d-block sticky-filter">
        <div class="w-100">
          <section class="d-flex">
            <div class="d-flex justify-content-between align-items-center mr-6 pl-4 pr-5 py-3 open-sidebar">
              <div class="d-flex align-items-center pl-3">
                <span class="d-flex align-items-center font-weight-bold">
                  <img src="~/assets/img/filters.svg" width="18" alt="Filter icon" class="mr-3"> <span>Filters</span>
                </span>
              </div>
            </div>
            <div class="d-flex assets-nav pt-3">
              <nuxt-link exact :to="navLinks['all']" class="mr-5 font-weight-bold" exact-active-class="exact-active-link">
                <div>All Assets</div>
              </nuxt-link>
              <nuxt-link exact :to="navLinks['3d']" class="mr-5 font-weight-bold" exact-active-class="exact-active-link">
                <div>3D Illustrations</div>
              </nuxt-link>
              <nuxt-link exact :to="navLinks['lottie']" class="mr-5 font-weight-bold" exact-active-class="exact-active-link">
                <div>Lottie Animations</div>
              </nuxt-link>
              <nuxt-link exact :to="navLinks['illustrations']" class="mr-5 font-weight-bold" exact-active-class="exact-active-link">
                <div>Illustrations</div>
              </nuxt-link>
              <nuxt-link exact :to="navLinks['icons']" class="mr-5 font-weight-bold" exact-active-class="exact-active-link">
                <div>Icons</div>
              </nuxt-link>
            </div>
          </section>
        </div>
      </div>
      <div class="d-flex">
        <div class="sidebar open-sidebar">
          <div class="d-flex justify-content-center align-items-center py-5 filter-border">
            <div class="d-flex align-items-center">
              <strong class="font-weight-bold ml-2 mr-5">IconScout Exclusive</strong>
            </div>
            <div>
              <b-form-checkbox :checked="exclusive" @input="update($event, 'exclusive')" name="exclusive" switch></b-form-checkbox>
            </div>
          </div>
          <CollapsableItem v-for="(filter, key) in filters" :key="key" :id="key" :visible="filter.visible" :name="filter.name">
            <div slot="collapse-content" class="px-5">
              <b-form-group v-slot="{ ariaDescribedby }">
                <b-form-radio-group
                  :checked="filter.value"
                  @input="update($event, key)"
                  :options="filter.types"
                  :aria-describedby="ariaDescribedby"
                  :name="`${key}-selector`"
                  class="radio-filters"
                  plain
                  stacked>
                </b-form-radio-group>
              </b-form-group>
            </div>
          </CollapsableItem>
          <CollapsableItem id="categories" name="Category" :visible="false"></CollapsableItem>
        </div>
        <section class="px-5 results">
          <div class="scrollable-tags mb-4">
            <HorizontalScrollableList :itemList="items">
              <template v-slot:default="{ item }">
                <nuxt-link :to="item.link">
                  <b-button variant="default" size="sm" class="font-weight-normal">{{ item.name }}</b-button>
                </nuxt-link>
              </template>
            </HorizontalScrollableList>
          </div>
          <div class="container-fluid px-0 pb-0 bg-white position-relative">
            <div class="mb-6 mt-3">
              <div v-if="$fetchState.pending" class="items-grid">
                <b-skeleton v-for="(i, key) in (results.length + 20)" :key="key" height="210px" width="280px" />
              </div>
              <div v-else-if="$fetchState.error">
                <h3 class="font-weight-bold">Nothing Found!</h3>
                  <p class="font-14">
                    We couldn't find any assets that match your search.
                  </p>
              </div>
              <div v-else class="items-grid">
                <AssetCard v-for="(i, key) in results" :key="key" />
              </div>
              <div v-if="results.length" v-observe-visibility="{ callback: handleScrolledToBottom, throttle: 500 }"></div>
            </div>
            <div class="create-account-wrapper" v-if="freeAccessExceeded">
              <div class="d-flex create-account-content">
                <p class="font-weight-bold font-size-lg"> Create an account to view {{ count }} {{ search }} {{ assetTypesMap[filters.asset.value] }} </p>
                <button type="button" class="btn btn-primary btn-lg">
                <span class="mr-3">Get Started - It's Free</span>
                </button>
                <div class="font-14 text-center pt-3 px-6">
                <span class="mr-1">Already have an account?</span>
                <a href="#">Log in</a>.
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  </div>
</template>

<script>
import SubHeaderContainer from '../../components/containers/SubHeaderContainer.vue'
import HorizontalScrollableList from '../../components/scrollables/HorizontalScrollableList.vue'
import CollapsableItem from '../../components/collapsables/CollapsableItem.vue'
import AssetCard from '../../components/cards/AssetCard.vue'
export default {
  components: {
    SubHeaderContainer,
    HorizontalScrollableList,
    CollapsableItem,
    AssetCard
  },
  data () {
    return {
      results: [],
      search: '',
      count: 0,
      freeAccessExceeded: false,
      filters: {
        asset: {
          value: '',
          types: [
            { text: 'All Asset', value: 'all-assets' },
            { text: 'Lottie Animations', value: 'lottie-animations' },
            { text: '3D Illustrations', value: '3d-illustrations' },
            { text: 'Illustrations', value: 'illustrations' },
            { text: 'Icons', value: 'icons' }
          ],
          visible: true,
          name: 'Asset Type' 
        },
        price: {
          value: '',
          types: [
            { text: 'Free', value: 'free' },
            { text: 'Premium', value: 'premium' },
            { text: 'All', value: 'all' }
          ],
          visible: true, 
          name: 'Price'
        },
        view: {
          value: '',
          types: [
            { text: 'Pack', value: 'pack' },
            { text: 'Individual', value: 'individual' }
          ],
          visible: true, 
          name: 'View',
        },
        sort: {
          value: '',
          types: [
            { text: 'Trending', value: 'popular' },
            { text: 'Featured', value: 'featured' },
            { text: 'Recent', value: 'latest' },
            { text: 'Relevant', value: 'relevant' }
          ],
          visible: true,
          name: 'Sort by'
        }
      },
      exclusive: false,
      page: 1,
      lastPage: 1,
      navLinks: {},
      assetTypesMap: {
        'all-assets': 'All Assets',
        'lottie-animations': 'Lottie Animations',
        '3d-illustrations': '3D Illustrations',
        'illustrations': 'Illustrations',
        'icons': 'Icons'
      },
      items: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16].map((i) => {
        return { name: `Design ${i} assets`, link: '/' };
      }),
    }
  },
  async fetch () {
    const { path, params, query } = this.$route
    const { price, view, sort, exclusive} = query
    const assetType = path.split('/')[1] || 'all-assets'
    this.filters = {
      asset: { ...this.filters.asset, value: assetType },
      price: { ...this.filters.price, value: price || 'free' },
      view: { ...this.filters.view, value: view || 'pack' },
      sort: { ...this.filters.sort, value: sort || 'popular' },
    }
    this.exclusive = exclusive !== 'true' ? false : true
    this.navLinks = {
      'all': { name: `all-assets-name`, params, query },
      'lottie': { name: `lottie-animations-name`, params, query },
      '3d': { name: `3d-illustrations-name`, params, query },
      'illustrations': { name: `illustrations-name`, params, query },
      'icons': { name: `icons-name`, params, query },
    }
    this.search = params.name
    try {
      const { info, results } = await this.$axios.$get(`https://rickandmortyapi.com/api/character/?page=${this.page}`)
      this.results = this.page > 1 ? [...this.results, ...results] : [...results]
      this.lastPage = info.pages
      this.count = info.count
      this.freeAccessExceeded = this.page > 2 
    } catch (error) {
      this.error = `Failed to load ${q} ${this.assetTypesMap[assetType]}`
    }
  },
  methods: {
    update (value, key) {
      if (key !== 'exclusive') {
        this.filters[key].value = value
      } else {
        this.exclusive = value
      }
      this.page = 1
      const { path, params, query } = this.$route
      if (key !== 'asset') {
        this.$router.push({ path, query: { ...query, [key]: value } })
      } else {
        this.$router.push({ name: `${value}-name`, params, query })
      }
    },
    handleScrolledToBottom (isVisible) {
      if (!isVisible) { return }
      if (this.freeAccessExceeded || (this.page >= this.lastPage)) { return }
      this.page++
      this.$fetch()
    }
  },
  watch: {
    '$route.query': '$fetch'
  }
}
</script>
<style lang="scss">
.sticky-filter {
  position: sticky;
  top: 4.75rem;
  z-index: 999;
  background: #FAFAFC;
  border-bottom: 1px solid #EBEDF5;
}
.open-sidebar {
  width: 16.125rem;
  flex: 0 0 16.125rem;
  border-right: 1px solid #EBEDF5;
}
.clear {
  border: 0;
  background: transparent;
  cursor: pointer;
  padding: 0;
}
.sidebar {
  position: sticky;
  top: 7.8125rem;
  height: calc(100vh - 125px);
  overflow-y: auto;
  border-right: 1px solid #EBEDF5;
}
.custom-switch .custom-control-label::before {
  box-shadow: none !important;
}
.filter-border {
  border-bottom: 1px solid #EBEDF5;
}
.radio-filters {
  .form-check {
    margin-bottom: 0.75rem;
  }
}
.results {
  flex-grow: 1;
  position: relative;
  overflow: hidden;
}
.tag {
  border: 1px solid 
}
.items-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 0.75rem;
}
.create-account-wrapper {
  width: 100%;
  height: 26.25rem;
  background: linear-gradient(180deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.9) 21.98%, rgba(255,255,255,0.99) 100%);
  left: 0;
  bottom: 0;
  position: absolute;
  z-index: 1;
}
.create-account-content {
  width: 100%;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 1;
  left: 0;
  position: absolute;
  top: 67%;
  transform: translateY(-50%);
}
</style>
