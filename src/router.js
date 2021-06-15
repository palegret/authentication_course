import Vue from 'vue'
import Router from 'vue-router'

import Dashboard from './views/Dashboard.vue'
import Home from './views/Home.vue'
import LoginUser from './views/LoginUser.vue'
import RegisterUser from './views/RegisterUser.vue'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: Dashboard,
      meta: { requiresAuth: true }
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterUser
    },
    {
      path: '/login',
      name: 'login',
      component: LoginUser
    }
  ]
})

router.beforeEach((to, from, next) => {
  const routeRequiresAuth = to.matched.some(record => record.meta.requiresAuth)
  const loggedIn = localStorage.getItem('user')

  if (routeRequiresAuth && !loggedIn) {
    next('/')
  }

  next()
})

export default router
