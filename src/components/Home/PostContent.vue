<template>
  <div class="post-content" @click="toDetails()">
    <div class="post-texts">
      <div v-text="title" class="title-texts"></div>
      <div v-text="description" class="description-texts"></div>
      <div v-text="diffTime"></div>
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
      diffTime: "",
    }
  },
  mounted: function() {
    console.log(this.docID)
    db.collection('Questions').doc(this.docID).get().then(doc => {
      if(doc.exists){
        this.title = doc.data().title
        this.description = doc.data().description
        this.diffTime = this.getDiffTime(doc.data().time.seconds)
      }      
    })
  },
  methods: {
    toDetails(){
      this.$router.push({name: 'DetailsPage', params: {docID: this.docID}});
    },
    getDiffTime: function(postTime){
      var now = new Date()
      // 差分（ミリ秒
      var milliDiffTime = now.getTime() - new Date(postTime * 1000).getTime()
      var hourDiffTime = Math.floor(milliDiffTime / 1000 / 60 / 60)
      if(hourDiffTime < 1){
        return "1時間以内"
      } else if (hourDiffTime >= 1 && hourDiffTime < 24){
        return hourDiffTime + "時間前"
      } else {
        return Math.floor(hourDiffTime / 24) + "日前"
      }
      
    }
  }
}
</script>

<style>
.post-content{
  height: 100px;
  border-bottom: 2px solid;
  border-color: #dddddd;
  padding: 7px 30px;
  cursor: pointer;
}

.post-texts > *{
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
}

.title-texts{
  font-size: 1.3rem;
  font-weight: bold;
  margin-bottom: 3px;
  -webkit-line-clamp: 1;
}

.description-texts{
  -webkit-line-clamp: 2;
}
</style>
