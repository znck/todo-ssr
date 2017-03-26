import Vue from 'vue'
import VueRouter from 'vue-router'

import Page from './components/Page.vue'

Vue.use(VueRouter)

const router = new VueRouter({
  mode: 'history',
  exact: true,
  routes: [
    {
      name: 'home',
      path: '/:type?',
      component: Page,
      props: (route) => ({ type: route.params.type })
    }
  ]
})

const app = new Vue({
  router,
  render: h => h(
      'div',
      { domProps: { id: 'app' } },
      [h('keep-alive', null, [h('router-view')])]
  )
})

export { app, router }
