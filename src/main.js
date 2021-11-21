import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/element.js'
import VueAwesomeSwiper from 'vue-awesome-swiper'
import 'swiper/swiper-bundle.css'


Vue.use(VueAwesomeSwiper)

Vue.config.productionTip = false
import './assets/css/index.css'
new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')