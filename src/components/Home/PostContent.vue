<template>
  <div class="post-content" @click="toDetails()">
    <div class="post-texts">
      <div v-text="title" class="title-texts"></div>
      <div v-text="diffTime" class="elapsed-time-texts"></div>
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
      this.$router.push({name: 'DetailsPage', params: {id: this.docID}});
    },
    getDiffTime: function(postTime){
      //現在の時間
      var now = new Date()
      // 差分（ミリ秒）
      var milliDiffTime = now.getTime() - new Date(postTime * 1000).getTime()
      // 差分（時間）
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

<style scoped>
.post-content{
  border-bottom: 2px solid;
  border-color: #dddddd;
  padding: 5px 30px;
  cursor: pointer;
}

.post-texts > *{
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  margin-bottom: 3px;
}

.post-texts:last-child{
  margin-bottom: 0;
}

.title-texts{
  padding: 10px 0;
  font-size: 1.3rem;
  -webkit-line-clamp: 1;
}

.description-texts{
  -webkit-line-clamp: 1;
}

.elapsed-time-texts{
  vertical-align: bottom;
  text-align: right;
  font-size: 0.8rem;
  color: gray;
}
</style>
