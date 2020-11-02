<template>
  <div>
    <CustomHeader/>
     <div v-if="title != undefined">{{title}}</div>
     <div v-if="description != undefined">{{description}}</div>
  </div>
</template>

<script>
import CustomHeader from './CustomHeader'
export default {
  name: 'DetailsPage',
  components: {
    CustomHeader,
  },
  props: [
    'title',
    'description'
  ],
}
</script>