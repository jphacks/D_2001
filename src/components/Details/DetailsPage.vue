<template>
  <div>
    <CustomHeader/>
    <b-container id="contents-container">
      <div class="container">
        <div v-if="title != undefined" class="h1">{{title}}</div>
      </div>
      <hr>
      <div class="container">
        <div v-if="description != undefined">{{description}}</div>
      </div>
      <hr>
      <div class="container">
        <div v-for="(answer, index) in answers" v-bind:key="index" class="options-container">
          <AnswerContent @sendIndex="setIndex" v-bind:answer="{text: answer.text, index: index}"/>
        </div>
      </div>
      <div class="container">
        <b-form-input placeholder="選択肢" v-model="candidate"></b-form-input>
        <b-button v-on:click="addAnswer" variant="outline-dark">追加する</b-button>
      </div>
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
    }
  },
  mounted: function(){
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
      querySnapshot.forEach(doc => {
        var answerData = {
          id: doc.id,
          text: doc.data().text,
        }
        this.answers.push(answerData)
      })
    })
  },
  methods:{
    addAnswer: function(){
      console.log(this.candidate)
      db.collection('Questions').doc(this.questionID).collection('Answers').add({
        text: this.candidate
      })
      .then(() => {
        console.log("Answer successfully written!");
        var answerData = {
          text: this.candidate
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
    vote: function(){
      db.collection("Users").doc("3ATDk0SAaSrxgFQRao7u").collection("Questions").doc(this.questionID).set({
          answerId: this.answers[this.selectedIndex].id
        })
        .then(function() {
            console.log("Document successfully written!");
        })
        .catch(function(error) {
            console.error("Error writing document: ", error);
        });
    }
  },
}
</script>

<style scoped>
#contents-container{
  padding: 30px;
}

.container {
  margin-bottom: 10px;
}

.options-container{
  margin-bottom: 5px;
}

</style>