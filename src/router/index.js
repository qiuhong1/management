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
        redirect: '/welcome',
        children: [{
            path: '/welcome',
            component: () =>
                import ('../components/Welcome')
        }, {
            path: '/users',
            component: () =>
                import ('../views/homechild/Users')
        }, {
            path: '/rights',
            component: () =>
                import ('../views/homechild/Rights')
        }, {
            path: '/roles',
            component: () =>
                import ('../views/homechild/Roles')
        }, {
            path: '/categories',
            component: () =>
                import ('../views/homechild/goods/Cate')
        }, {
            path: '/params',
            component: () =>
                import ('../views/homechild/goods/Params')
        }, {
            path: '/goods',
            component: () =>
                import ('../views/homechild/goods/List')
        }, {
            path: '/goods/add',
            component: () =>
                import ('../views/homechild/goods/Add')
        }, {
            path: '/orders',
            component: () =>
                import ('../views/homechild/order/Order')
        }, {
            path: '/reports',
            component: () =>
                import ('../views/homechild/reports/Reports')
        }],
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