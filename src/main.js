import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/element.js'
import VueAwesomeSwiper from 'vue-awesome-swiper'
import 'swiper/swiper-bundle.css'
// 导入字体图标
import './assets/fonts/iconfont.css'

Vue.use(VueAwesomeSwiper)

import axios from 'axios'
// 配置请求的跟路径
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
axios.interceptors.request.use(config => {
    // console.log(config)
    config.headers.Authorization = window.sessionStorage.getItem('token')
        // 在最后必须 return config
    return config
})
Vue.prototype.$http = axios

// 树形控件
import TreeTable from 'vue-table-with-tree-grid'
Vue.component('tree-table', TreeTable)

Vue.config.productionTip = false
import './assets/css/index.css'
new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')