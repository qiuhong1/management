import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [{
        path: '/',
        redirect: '/login'
    },
    {
        path: '/login',
        name: 'Login',
        component: () =>
            import ('../components/Login')
    },
    {
        path: '/home',
        name: 'Home',
        component: () =>
            import ('../views/home/Home')
    }
]

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
})
router.beforeEach((to, from, next) => {
    if (to.path === '/login') return next()
    const tokenstr = sessionStorage.getItem('token')
    if (!tokenstr) return next('/login')
    next()
})
export default router