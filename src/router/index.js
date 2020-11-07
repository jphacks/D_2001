import Vue from 'vue'
import Router from 'vue-router'

import HomePage from '../components/Home/HomePage'
import PostPage from '../components/Post/PostPage'
import DetailsPage from '../components/Details/DetailsPage'
import ProfilePage from '../components/Profile/ProfilePage'

Vue.use(Router)

export default new Router({
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
      path: '/details/:id',
      name: 'DetailsPage',
      component: DetailsPage,
      props: true
    },
    {
      path: '/profile',
      name: 'ProfilePage',
      component: ProfilePage,
    },
  ]
})