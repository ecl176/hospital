import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from "axios"
import 'ant-design-vue/dist/antd.css'
import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');
Vue.config.productionTip = false
Vue.prototype.$http = axios

import ant from 'ant-design-vue';
Vue.use(ant)
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
