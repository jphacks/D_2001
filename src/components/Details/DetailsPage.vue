<template>
  <div>
    <CustomHeader/>
    <b-container id="contents-container">
      <!-- タイトル欄 -->
      <div class="title-container">
        <div v-if="title != undefined" class="h1">{{title}}</div>
        <!-- お気に入りボタン欄 -->
        <StarButton ref="star" v-bind:userID="getUserID"></StarButton>
      </div>
      <hr>
      <!-- 詳細欄 -->
      <div class="section-container">
        <vue-markdown :source="description"></vue-markdown>
      </div>
      <hr>
      <!-- 選択肢欄 -->
      <div class="section-container">
        <div v-for="(answer, index) in answers" v-bind:key="index" class="options-container">
          <AnswerContent @sendIndex="setIndex" v-bind:answer="{text: answer.text, index: index, votes: answer.votes, isVoted: answer.isVoted}"/>
        </div>
      </div>
      <!-- 選択肢追加入力欄 -->
      <b-input-group class="section-container">
        <b-form-input placeholder="選択肢" v-model="candidate" class="add-option-form"></b-form-input>
        <b-button v-on:click="addAnswer" variant="outline-dark">追加する</b-button>
      </b-input-group>
      <div class="section-container vote-btn-container">
        <b-button v-on:click="vote" variant="primary">投票する</b-button>
      </div>
      <!-- コメント -->
      <div class="section-container">
        <CommentContent v-bind:userID="getUserID"></CommentContent>
      </div>
    </b-container>
  </div>
</template>

<script>
import {db} from '../../plugins/firebase'
import CustomHeader from '../CustomHeader'
import AnswerContent from './AnswerContent'
import StarButton from './StarButton'
import CommentContent from './CommentContent'
import VueMarkdown from 'vue-markdown'
export default {
  name: 'DetailsPage',
  data: function() {
    return {
      answers: [],
      title: "",
      description: "",
      candidate: "",
      selectedIndex: "",
      docID: "",
    }
  },
  components: {
    CustomHeader,
    AnswerContent,
    StarButton,
    CommentContent,
    VueMarkdown,
  },
  computed:{
    getUserID(){
      return this.$store.getters.userID
    }
  },
  mounted: async function(){
    // URLからドキュメントIDを取得
    this.docID = this.$route.params.id
    var ref = db.collection("Questions").doc(this.docID)
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
      var candidate = this.candidate
      try{
        this.answers.forEach(function(answer){
          if(answer.text == candidate) {
            throw "既に同じ選択肢があります."
          }
        })
        //回答を追加する
        if(this.candidate == ""){
          alert("追加する選択肢には文字を入れてください")
          return
        }
        db.collection('Questions').doc(this.docID).collection('Answers').add({
          text: this.candidate,
          votesNum: 0
        })
        .then((doc) => {
          console.log("Answer successfully written!");
          var answerData = {
            id: doc.id,
            text: this.candidate,
            votes: 0,
            isVoted: false
          }
          this.answers.push(answerData)
          this.candidate = ""
        })
        .catch(function(error) {
            console.error("Error writing document: ", error);
        });
      }
      catch(e) {
        alert(e)
      }
    },
    setIndex: function(index){
      this.selectedIndex = index
    },
    vote: async function(){
      if(CustomHeader.data().currentuser == null){
        //ログインしていない
        alert("投票するにはログインしてください")
      } else {
        this.$refs.star.autoStar()
        var answerID = this.answers[this.selectedIndex].id
        var userRef = db.collection("Users").doc(this.getUserID).collection("Questions").doc(this.docID)
        var dbRef = db.collection('Questions').doc(this.docID).collection('Answers')
        await this.controlVote(userRef, dbRef, answerID)
        await this.updateAnswerID(userRef, answerID)
      }
    },
    controlVote: async function(userRef, dbRef, answerID){
      return new Promise(resolve => {
        // 同じ回答に投票していないか確認する
        userRef.get().then(async (snapshot) => {
          if(snapshot.exists){
            var preAnswerId = snapshot.data().answerId
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
            } else {
              await this.firstVote(dbRef, answerID)
              resolve()
            }
          } else {
            await this.firstVote(dbRef, answerID)
            resolve()
          }
        })
      })
    },
    firstVote: async function(dbRef,answerID){
      return new Promise(resolve => {
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
                this.answers[i].isVoted = !this.answers[i].isVoted
              }
            }
            dbRef.doc(answerID).update({
              votesNum: num+1
            })
            resolve()
          }
        })
      })
    },
    updateAnswerID: async function(userRef, answerID){
      // Usersテーブルに投票した回答を保存する
      userRef.set({
        answerId: answerID
      }, { merge: true })
      .then(function() {
          console.log("Document successfully written!");
      })
      .catch(function(error) {
          console.error("Error writing document: ", error);
      });
    },
    isVotedBySelf: function(answerID){
      return new Promise(resolve => {
        if(this.getUserID == null){
          resolve(false)
        }
        db.collection("Users").doc(this.getUserID).collection("Questions").doc(this.docID)
        .get().then(snapshot => {
          if(snapshot.exists){
            if(snapshot.data().answerId == answerID){
              resolve(true)
            } else {
              resolve(false)
            }
          } else{
            resolve(false)
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
  margin-top: 30px;
  background-color: #FFFFFF;
}

.section-container {
  margin-bottom: 20px;
}

.options-container{
  margin-bottom: 5px;
}

/* header貫通してしまうのでこれで暫定 */
.input-group{
  flex-wrap: nowrap;
}

.add-option-container{
  display: flex;
}

.vote-btn-container{
  text-align: right;
}

</style>