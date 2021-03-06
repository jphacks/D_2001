<template>
  <div>
    <CustomHeader/>
    <b-container id="contents-container">
    <!-- 投稿者情報蘭 -->
      <div v-on:click="toProfilePage" id="user-text-container" class="h5">
          <div id="user-name-text"> ユーザー名 : {{contributor.name}} <br> {{periodOfGitHub}}</div>
      </div> 
      <!-- {{contributor}} -->
      <!-- {{periodOfGitHub}} -->
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
          <AnswerContent @sendIndex="setIndex" v-bind:answer="{text: answer.text, index: index, votes: answer.votes, isVoted: answer.isVoted, voting: answer.voting}"/>
        </div>
      </div>
      <!-- 選択肢追加入力欄 -->
      <b-input-group class="section-container">
        <b-form-input placeholder="選択肢" v-model="candidate" class="add-option-form"></b-form-input>
        <b-button v-on:click="addAnswer" variant="outline-dark">追加する</b-button>
      </b-input-group>
      <div class="section-container vote-btn-container">
        <div v-if="userExists">※あなたの投票で{{pollOfUser}}票入ります</div>
        <b-button v-if="userExists" v-on:click="vote" variant="primary">投票する</b-button>
        <div v-if="!userExists">※投票するにはログインしてください</div>
        <b-button v-if="!userExists" disabled v-on:click="vote" variant="primary">投票する</b-button>
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
      contributor: [],
      periodOfGitHub: "",
      pollOfUser: 0,
      userExists: false,
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
    },
    getPeriodOfGitHub(){
      return this.$store.getters.periodOfGitHub
    }
  },
  mounted: async function(){
    // 自分の投票数を取得
    if(this.getUserID == ""){
      this.userExists = false
    }else {
      this.userExists = true
      this.pollOfUser = Math.floor((this.getPeriodOfGitHub / 2)) + 1
    }
    // URLからドキュメントIDを取得
    this.docID = this.$route.params.id
    var ref = db.collection("Questions").doc(this.docID)
    // 投稿のタイトル・詳細・投稿者を取得
    ref.get().then(doc => {
      if(doc.exists){
        this.contributor.userID = doc.data().userID
        this.title = doc.data().title
        this.description = doc.data().description
        db.collection("Users").doc(doc.data().userID)
        .get().then(doc => {
          if(doc.exists){
            this.contributor.name = doc.data().name
            var createTime = doc.data().createAt.seconds
            var now = new Date()
            var milliDiffTime = now.getTime() - new Date(createTime * 1000).getTime()
            var diffYear = Math.floor(milliDiffTime / 1000 / 60 / 60 / 24 / 365)
            this.periodOfGitHub = "GitHub歴 : "+diffYear + "年"
          }
        })
      }
    })
    // 回答一覧を取得
    ref.collection("Answers").get().then(querySnapshot => {
      querySnapshot.forEach(async (doc) => {
        var isVoted = await this.isVotedBySelf(doc.id)
        console.log(isVoted)
        var answerData
        if(isVoted != "not voting"){
          answerData = {
            id: doc.id,
            text: doc.data().text,
            votes: doc.data().votesNum,
            isVoted: isVoted,
            voting: true, //投票したことがある
          }
        } else{
          answerData = {
            id: doc.id,
            text: doc.data().text,
            votes: doc.data().votesNum,
            isVoted: false,
            voting: false, //投票したことがない
          }
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
                        this.answers[i].votes += this.pollOfUser
                        this.answers[i].isVoted = !this.answers[i].isVoted
                      }
                    }
                    dbRef.doc(answerID).update({
                      votesNum: num + this.pollOfUser
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
                        this.answers[i].votes -=  this.pollOfUser
                        this.answers[i].isVoted = !this.answers[i].isVoted
                      }
                    }
                    dbRef.doc(preAnswerId).update({
                      votesNum: preAnsNum - this.pollOfUser
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
                this.answers[i].votes +=  this.pollOfUser
                this.answers[i].isVoted = !this.answers[i].isVoted
              }
              this.answers[i].voting = true
            }
            dbRef.doc(answerID).update({
              votesNum: num + this.pollOfUser
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
        if(this.getUserID == ""){
          resolve(false)
        }
        db.collection("Users").doc(this.getUserID).collection("Questions").doc(this.docID)
        .get().then(snapshot => {
          if(snapshot.exists){
            if(snapshot.data().answerId == null){
              resolve("not voting")
            }else if(snapshot.data().answerId == answerID){
              resolve(true)
            } else {
              resolve(false)
            }
          } else{
            resolve("not voting")
          }
        })
      })
    },
    toProfilePage: function(){
      if(this.$route.path == "/profile"){
        // ページリロード
        // this.$router.go({ name: 'ProfilePage' })
      } else{
        this.$router.push({name: 'ProfilePage', params: {userID: this.contributor.userID}});
      }
    },
  },
}
</script>

<style scoped>
#contents-container{
  padding: 30px;
  margin-top: 30px;
  background-color: #FFFFFF;
}

#user-text-container{
  cursor: pointer;
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