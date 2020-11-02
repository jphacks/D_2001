<template>
  <div class="post-content" @click="toDetails()">
    <div class="post-texts">
      <div v-text="title" class="h2"></div>
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
    toDetails(){
      this.$router.push({name: 'DetailsPage', params: {docID: this.docID}});
    }
  }
}
</script>

<style>
.post-content{
  border-bottom: 2px solid;
  border-color: #dddddd;
  margin: 2px auto;
  height: 100px;
}
.post-texts{
  width: 80%;
  margin: 0 auto;
  padding-top: 10px;
  text-align: left;
}
.post-content :hover{
  cursor: pointer;
}
</style>
