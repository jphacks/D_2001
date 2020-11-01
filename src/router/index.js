import Vue from 'vue'
import Router from 'vue-router'

import InputForm from '../components/InputForm'
import QuestionsList from '../components/QuestionsList'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'QuestionsList',
      component: QuestionsList
    },
    {
      path: '/post',
      name: 'InputForm',
      component: InputForm
    }
  ]
})