<template>
  <div>
    <CustomHeader/>
    <b-container id="contents-container">
      <!-- タイトル欄 -->
      <div class="container">
        <div v-if="title != undefined" class="h1">{{title}}</div>
      </div>
      <hr>
      <!-- 詳細欄 -->
      <div class="container">
        <div v-if="description != undefined">{{description}}</div>
      </div>
      <hr>
      <!-- 選択肢欄 -->
      <div class="container">
        <div v-for="(answer, index) in answers" v-bind:key="index" class="options-container">
          <AnswerContent @sendIndex="setIndex" v-bind:answer="{text: answer.text, index: index, votes: answer.votes, isVoted: answer.isVoted}"/>
        </div>
      </div>
      <!-- 選択肢追加入力欄 -->
      <b-input-group class="container">
        <b-form-input placeholder="選択肢" v-model="candidate" class="add-option-form"></b-form-input>
        <b-button v-on:click="addAnswer" variant="outline-dark">追加する</b-button>
      </b-input-group>
    </b-container>
    <b-button v-on:click="vote">投票する</b-button>
  </div>
</template>

<script>
import {db} from '../../plugins/firebase'
import CustomHeader from '../CustomHeader'
import AnswerContent from './AnswerContent'
export default {
  name: 'DetailsPage',
  data: function() {
    return {
      answers: [],
      title: "",
      description: "",
      candidate: "",
      selectedIndex: "",
      questionID: "",
    }
  },
  components: {
    CustomHeader,
    AnswerContent
  },
  props: [
    'docID'
  ],
  computed:{
    getStoreID(){
      return this.$store.getters.docID
    },
    getUserID(){
      return this.$store.getters.userID
    }
  },
  mounted: async function(){
    if(this.docID == null){
      //ページリロード
      //storeから値を取得
      this.questionID = this.getStoreID
    } else{
      //ページ遷移でのアクセス
      this.questionID = this.docID
      //storeに値を保存
      this.$store.dispatch('doUpdate', this.questionID)
    }
    var ref = db.collection("Questions").doc(this.questionID)
    // 投稿のタイトルと詳細を取得
    ref.get().then(doc => {
      if(doc.exists){
        this.title = doc.data().title
        this.description = doc.data().description
      }
    })
    // 回答一覧を取得
    ref.collection("Answers").get().then(querySnapshot => {
      querySnapshot.forEach(async (doc) => {
        var isVoted = await this.isVotedBySelf(doc.id)
        console.log(isVoted)
        var answerData = {
          id: doc.id,
          text: doc.data().text,
          votes: doc.data().votesNum,
          isVoted: isVoted
        }
        this.answers.push(answerData)
      })
    })
  },
  methods:{
    addAnswer: function(){
      //回答を追加する
      db.collection('Questions').doc(this.questionID).collection('Answers').add({
        text: this.candidate
      })
      .then(() => {
        console.log("Answer successfully written!");
        var answerData = {
          text: this.candidate,
          votesNum: 0
        }
        this.answers.push(answerData)
        this.candidate = ""
      })
      .catch(function(error) {
          console.error("Error writing document: ", error);
      });
    },
    setIndex: function(index){
      this.selectedIndex = index
    },
    vote: async function(){
      var answerID = this.answers[this.selectedIndex].id
      var userRef = db.collection("Users").doc(this.getUserID).collection("Questions").doc(this.questionID)
      var dbRef = db.collection('Questions').doc(this.questionID).collection('Answers')
      await this.controlVote(userRef, dbRef, answerID)
      await this.updateAnswerID(userRef, answerID)
    },
    controlVote: function(userRef, dbRef, answerID){
      return new Promise(resolve => {
        // 同じ回答に投票していないか確認する
        userRef.get().then(snapshot => {
          try{
            var preAnswerId = snapshot.data().answerId
          } catch{
            // 初めての投票
            // 投票する回答に投票数を1増やす
            dbRef.doc(answerID).get().then(snapshot => {
              if(snapshot.exists){
                var num = snapshot.data().votesNum
                var ansText = snapshot.data().text
                // 表示する票数を増やす
                for(var i in this.answers){
                  if(ansText == this.answers[i].text){
                    this.answers[i].votes++
                  }
                }
                dbRef.doc(answerID).update({
                  votesNum: num+1
                })
              resolve(answerID)
              }
            })
          }
          if(snapshot.exists){
            if(preAnswerId != null){
              if(preAnswerId == answerID){
                // 前回を同じ回答に投票している
                console.log("同じ回答です")
              } else {
                // 投票する回答に投票数を1増やす
                dbRef.doc(answerID).get().then(snapshot => {
                  if(snapshot.exists){
                    var num = snapshot.data().votesNum
                    var ansText = snapshot.data().text
                    // 表示する票数を増やす
                    for(var i in this.answers){
                      if(ansText == this.answers[i].text){
                        this.answers[i].votes++
                        this.answers[i].isVoted = !this.answers[i].isVoted
                      }
                    }
                    dbRef.doc(answerID).update({
                      votesNum: num+1
                    })
                  }
                })
                // 前に回答していた投票を1減らす
                dbRef.doc(preAnswerId).get().then(snapshot => {
                  if(snapshot.exists){
                    var preAnsNum = snapshot.data().votesNum
                    var preAnsText = snapshot.data().text
                    // 表示する票数を減らす
                    for(var i in this.answers){
                      if(preAnsText == this.answers[i].text){
                        this.answers[i].votes--
                        this.answers[i].isVoted = !this.answers[i].isVoted
                      }
                    }
                    dbRef.doc(preAnswerId).update({
                      votesNum: preAnsNum-1
                    })
                  }
                  resolve(answerID)
                })
              }
            }
          }
        })
      })
    },
    updateAnswerID: async function(userRef, answerID){
      // Usersテーブルに投票した回答を保存する
      userRef.set({
        answerId: answerID
      })
      .then(function() {
          console.log("Document successfully written!");
      })
      .catch(function(error) {
          console.error("Error writing document: ", error);
      });
    },
    isVotedBySelf: function(answerID){
      return new Promise(resolve => {
        db.collection("Users").doc(this.getUserID).collection("Questions").doc(this.questionID)
        .get().then(snapshot => {
          if(snapshot.exists){
            if(snapshot.data().answerId == answerID){
              resolve(true)
            } else {
              resolve(false)
            }
          }
        })
      })
    }
  },
}
</script>

<style scoped>
#contents-container{
  padding: 30px;
}

.container {
  margin-bottom: 20px;
}

.options-container{
  margin-bottom: 5px;
}

.add-option-container{
  display: flex;
}

</style>