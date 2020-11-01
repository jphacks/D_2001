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
      name: 'InputForm',
      component: InputForm
    },
    {
      path: '/page2',
      name: 'QuestionsList',
      component: QuestionsList
    }
  ]
})