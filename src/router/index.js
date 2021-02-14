import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    meta: {
      icon: 'home', title: 'Home'
    },
    component: () => import('../views/Home')
  },
  {
    path: '/despesas',
    name: 'Despesas',
    meta: {
      icon: 'list-ul', title: 'Despesas'
    },
    component: () => import('../views/ExpensesList')
  },
  {
    path: '/login',
    name: 'Login',
    meta: {
      title: 'Login'
    },    
    component: () => import('../views/Login')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  document.title = `${to.meta.title} - Expenses`
  
  if (!window.uid && to.name !== 'Login') {
    next({ name: 'Login' })
  } else {
    next()
  }
})

export default router
