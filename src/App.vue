<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
import router from './router'
import store from './store'

export default {
  name: 'App',
  router,
  store,
}
</script>

<style>
#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #333333;
  background-color: #F6F6F4;
  min-height: 100vh;
  padding-top: 64px;
}
</style>
