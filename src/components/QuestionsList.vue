<template>
<div>
  <router-link to="/post">
    <button>投稿</button>
  </router-link>
  <br>
  <button v-on:click="getQuestions">取得</button>
  <table class="table table-bordered table-hover">
      <tr v-for="(question, index) in questions" v-bind:key="index">
          <td v-text="question.title"></td>
          <td v-text="question.description"></td>
      </tr>
  </table>
</div>
</template>

<script>
import {db} from '../plugins/firebase';
export default {
  name: "QuestionsList",
  data: function() {
    return {
      questions: [],
    }
  },
  methods:{
    getQuestions: function(){
      var ref = db.collection('Questions').orderBy('title')
      ref.get()
        .then(snapshot => {
          if (snapshot.empty) {
            console.log('No matching documents.');
            return;
          }
          snapshot.forEach(doc => {
            // console.log(doc.id, '=>', doc.data().title);
            var questionData = {
              title: doc.data().title,
              description: doc.data().description,
            }
            console.log(questionData)
            this.questions.push(questionData)
          });
        })
        .catch(err => {
          console.log('Error getting documents', err);
        });
    }
  },
}
</script>