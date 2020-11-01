<template>
  <div>
    <CustomHeader/>
    <QuestionsList/>
  </div>
</template>

<script>
import CustomHeader from './CustomHeader'
import QuestionsList from './QuestionsList'

export default {
  name: 'HomePage',
  components: {
    CustomHeader,
    QuestionsList
  }
}
</script>