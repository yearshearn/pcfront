import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// import locale from 'element-ui/lib/locale/lang/en' // lang i18n 引入英文包

import '@/styles/index.scss' // global css

// import VeBar from 'v-charts/lib/bar.common'
// import VePie from 'v-charts/lib/pie.common'
import VCharts from 'v-charts'
import App from './App'
import store from './store'
import router from './router'

import '@/icons' // icon
import '@/permission' // permission control

/**
 * This project originally used easy-mock to simulate data,
 * but its official service is very unstable,
 * and you can build your own service if you need it.
 * So here I use Mock.js for local emulation,
 * it will intercept your request, so you won't see the request in the network.
 * If you remove `../mock` it will automatically request easy-mock data.
 */
import '../mock' // simulation data
import '@/directive/dragger'

Vue.use(ElementUI)
Vue.use(VCharts)
// Vue.component(VeBar.name, VeBar)
// Vue.component(VePie.name, VePie)

Vue.config.productionTip = false
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
