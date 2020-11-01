<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
import router from './router'

export default {
  name: 'App',
  router,
}
</script>

<style>
#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #333333;
  background-color: #F6F6F4;
  min-height: 100vh;
  padding-top: 64px;
}

#contents-container {
  max-width: 1140px;
  margin-top: 30px;
  margin-left: auto;
  margin-right: auto;
  background-color: #FFFFFF;
}
</style>
