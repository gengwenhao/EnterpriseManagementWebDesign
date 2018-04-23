import Vue from 'vue'
import App from './App'
import ElementUI from 'element-ui'
import router from './router'
import VCharts from 'v-charts'
import axios from 'axios'

import 'element-ui/lib/theme-chalk/index.css'
import '../node_modules/semantic-ui-css/semantic.min.css'
import '../node_modules/font-awesome/css/font-awesome.css'

Vue.use(ElementUI)
Vue.use(VCharts)
Vue.prototype.$http = axios
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: {App},
  template: '<App/>'
})
