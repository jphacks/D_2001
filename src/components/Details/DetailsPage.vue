<template>
  <div>
    <CustomHeader/>
     <div v-if="title != undefined">{{title}}</div>
     <div v-if="description != undefined">{{description}}</div>
     <!-- <table>
        <tr v-for="(answer, index) in answers" v-bind:key="index">
          <td v-text="answer.text"></td>
        </tr>
      </table> -->
      <div v-for="(answer, index) in answers" v-bind:key="index">
        <AnswerContent v-bind:answer="answer.text" />
      </div>
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
    }
  },
  components: {
    CustomHeader,
    AnswerContent
  },
  props: [
    'docID',
  ],
  mounted: function(){
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
      querySnapshot.forEach(doc => {
        var answerData = {
          text: doc.data().content.text,
        }
        this.answers.push(answerData)
      })
    })
  },
}
</script>