<template>
  <div>
    <CustomHeader/>
    <InputForm/>
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