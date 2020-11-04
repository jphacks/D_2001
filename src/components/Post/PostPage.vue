<template>
  <div>
    <CustomHeader/>
    <b-container id="contents-container">
     <InputForm/>
    </b-container>
  </div>
</template>

<script>
import CustomHeader from '../CustomHeader'
import InputForm from './InputForm'

export default {
  name: 'PostPage',
  components: {
    CustomHeader,
    InputForm
  }
}
</script>

<style scoped>
#contents-container {
  margin-top: 30px;
}
</style>