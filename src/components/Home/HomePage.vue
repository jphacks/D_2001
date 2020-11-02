<template>
  <div>
    <CustomHeader/>
    <b-container id="contents-container">
      <QuestionsList/>
    </b-container>
  </div>
</template>

<script>
import CustomHeader from '../CustomHeader'
import QuestionsList from './QuestionsList'

export default {
  name: 'HomePage',
  components: {
    CustomHeader,
    QuestionsList
  }
}
</script>

<style>
#contents-container {
  background-color: #FFFFFF;
}
</style>
