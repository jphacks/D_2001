<template>
  <div>
    <CustomHeader/>
    <b-container id="contents-container">
      <div v-text="userName" class="h1"></div>
      <div v-for="(question, index) in questions" v-bind:key="index">
        <PostContent v-bind:docID="question.docID" />
      </div>
    </b-container>
  </div>
</template>

<script>
import CustomHeader from '../CustomHeader'
import PostContent from '../Home/PostContent'
import {db} from '../../plugins/firebase';
export default {
  name: 'ProfilePage',
  components: {
    CustomHeader,
    PostContent,
  },
  data: function(){
    return{
      userName: "",
      questions: [],
    }
  },
  computed:{
    getUserName(){
      return this.$store.getters.userName
    },
    getUserID(){
      return this.$store.getters.userID
    }
  },
  mounted: function(){
    // ユーザー名の取得
    this.userName = this.getUserName
    var userID = this.getUserID
    //マウント時に投稿一覧を取得する
    var ref = db.collection('Questions').orderBy('time', 'desc')
    ref.get().then(snapshot => {
      if (snapshot.empty) {
        console.log('No matching documents.');
        return;
      }
      snapshot.forEach(doc => {
        if(doc.data().userID != userID){
          return
        }
        //documentIDを配列で保持する
        var questionData = {
          docID: doc.id
        }
        this.questions.push(questionData)
      });
    })
    .catch(err => {
      console.log('Error getting documents', err);
    });
  },
}
</script>