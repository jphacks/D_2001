<template>
  <div>
    <CustomHeader/>
    <b-container class="contents-container">
      <div class="section-container profile-container">
        <div>UserName :</div>
        <div v-text="userName" class="username-text"></div>
      </div>
      <div class="section-container profile-container">
        <div>GitHub歴 :</div>
        <div v-text="periodOfGitHub" class="username-text"></div>
        <div>年</div>
      </div>
      <div class="section-container">
        <b-tabs justified class="profile-post-list-container">
          <b-tab title="投稿" active>
            <div v-for="(question, index) in questions" v-bind:key="index">
              <PostContent v-bind:docID="question.docID" />
            </div>
          </b-tab>
          <b-tab title="お気に入り">
            <div v-for="(question, index) in staredQuestions" v-bind:key="index">
              <PostContent v-bind:docID="question.docID" />
            </div>
          </b-tab>
        </b-tabs>
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
      staredQuestions: [],
      periodOfGitHub: "",
    }
  },
  props:[
    "userID"
  ],
  computed:{
    getUserName(){
      return this.$store.getters.userName
    },
    getUserID(){
      return this.$store.getters.userID
    },
    getPeriodOfGitHub(){
      return this.$store.getters.periodOfGitHub
    }
  },
  mounted: function(){
    console.log(this.userID)
    db.collection("Users").doc(this.userID).get().then(doc => {
      if(doc.exists){
        // ユーザー名の取得
        this.userName = doc.data().name
        // GitHub歴の取得
        var now = new Date()
        var milliDiffTime = now.getTime() - new Date(doc.data().createAt.seconds * 1000).getTime()
        var diffYear = Math.floor(milliDiffTime / 1000 / 60 / 60 / 24 / 365)
        this.periodOfGitHub = diffYear
      }  
    })
    // ユーザーIDの取得
    var userID = this.userID
    //自分の投稿一覧を取得する
    var ref = db.collection('Questions').orderBy('time', 'desc')
    var staredRef = db.collection("Users").doc(userID).collection("Questions")
    ref.get().then(snapshot => {
      if (snapshot.empty) {
        console.log('No matching documents.');
        return;
      }
      snapshot.forEach(doc => {
        //自分の投稿一覧を取得する
        if(doc.data().userID == userID){
          //documentIDを配列で保持する
          var questionData = {
            docID: doc.id
          }
          this.questions.push(questionData)
        }
        //お気に入りした投稿一覧を取得する
        staredRef.doc(doc.id).get().then(snapshot => {
          if(snapshot.exists && snapshot.data().stared){
            var questionData = {
              docID: doc.id
            }
            this.staredQuestions.push(questionData)
          }
        })
      });
    })
    .catch(err => {
      console.log('Error getting documents', err);
    });
  },
}
</script>

<style scoped>
.contents-container{
  margin-top: 30px;
}

.section-container{
  margin-bottom: 30px;
  background-color: #ffffff;
}

.profile-container{
  display: flex;
  justify-content: flex-start;
  padding: 30px;
}

.profile-container > *{
  font-size: x-large;
}

.username-text{
  margin-left: auto;
  text-align: right;
  font-weight: bold;
}
</style>