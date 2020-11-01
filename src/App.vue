<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
// import CustomHeader from './components/CustomHeader.vue'
// import InputForm from './components/InputForm.vue'
import router from './router'

export default {
  name: 'App',
  router,
  // components: {
  //   CustomHeader,
  //   InputForm,
  // }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
