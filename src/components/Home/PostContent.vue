<template>
  <div class="post-content" @click="toDetails(title, description)">
    <div class="title">
      <div v-text="title"></div>
    </div>
    <div class="description">
      <div v-text="description"></div>
    </div>
  </div>
</template>

<script>
import {db} from '../../plugins/firebase'
export default{
  name: "PostContent",
  props: ['docID'],
  data: function(){
    return{
      title: "",
      description: "",
    }
  },
  mounted: function() {
    console.log(this.docID)
    db.collection('Questions').doc(this.docID).get().then(doc => {
      if(doc.exists){
        this.title = doc.data().title
        this.description = doc.data().description
      }
    })
  },
  methods: {
    toDetails(qtitle, qdescription){
      this.$router.push({name: 'DetailsPage', params: {title: qtitle, description: qdescription}});
    }
  }
}
</script>