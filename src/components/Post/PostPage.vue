<template>
  <div>
    <CustomHeader/>
    <b-container id="contents-container">
      <div class="title">質問の投稿</div>
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

.title{
  padding: 20px 30px;
  font-size: 2rem;
  background-color: white;
  margin-bottom: 30px;
}
</style>