import 'dotenv/config'

export default {
  router: {
    base: '/'
  },
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'Icons Explorer',
    htmlAttrs: {
      lang: 'en'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'Get your icons on icons explorer' },
      { name: 'format-detection', content: 'telephone=no' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
      '@/assets/scss/theme.scss'
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
      '@/plugins/bootstrap-vue.js',
      { src: '~plugins/vue-observe-visibility.js', ssr: false },
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    '@nuxtjs/axios'
  ],
  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
      babel:{
        plugins:[["@babel/plugin-proposal-private-property-in-object", { "loose": true }]]
      }
  }
}
