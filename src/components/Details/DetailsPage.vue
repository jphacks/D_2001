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
          <AnswerContent v-bind:answer="answer.text" />
        </div>
      </div>
      <b-input-group class="container">
        <b-form-input placeholder="選択肢" v-model="candidate" class="add-option-form"></b-form-input>
        <b-button v-on:click="addAnswer" variant="outline-dark">追加する</b-button>
      </b-input-group>
    </b-container>
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
      questionID: "",
    }
  },
  components: {
    CustomHeader,
    AnswerContent
  },
  props: [
    'docID',
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