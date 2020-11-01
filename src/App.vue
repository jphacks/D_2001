<template>
  <div id="app">
    <CustomHeader/>
    <InputForm/>
  </div>
</template>

<script>
import CustomHeader from './components/CustomHeader.vue'
import InputForm from './components/InputForm.vue'

export default {
  name: 'App',
  components: {
    CustomHeader,
    InputForm,
  }
}
</script>

<style>
#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #333333;
}
</style>
