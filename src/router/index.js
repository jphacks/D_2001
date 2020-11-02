import Vue from 'vue'
import Router from 'vue-router'

import HomePage from '../components/HomePage'
import PostPage from '../components/PostPage'
import DetailsPage from '../components/DetailsPage'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'HomePage',
      component: HomePage
    },
    {
      path: '/post',
      name: 'PostPage',
      component: PostPage
    },
    {
      path: '/details',
      name: 'DetailsPage',
      component: DetailsPage,
      props: true
    }
  ]
})