<template>
  <div id="app">
    <!-- <button v-on:click="login">login</button> -->
    <!-- <img alt="Vue logo" src="./assets/logo.png">
    <HelloWorld msg="Welcome to Your Vue.js App"/> -->
    <CustomHeader/>
  </div>
</template>

<script>
import CustomHeader from './components/CustomHeader.vue'
export default {
  name: 'App',
  components: {
    CustomHeader
  }
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
