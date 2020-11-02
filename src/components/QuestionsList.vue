<template>
<div>
  <router-link to="/post">
    <button>投稿</button>
  </router-link>
  <br>
  <table class="table table-bordered table-hover">
      <tr v-for="(question, index) in questions" v-bind:key="index" @click="toDetails(question.title, question.description)">
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
  mounted: function(){
    //マウント時に投稿一覧を取得する
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
  },
  methods: {
    toDetails(qtitle, qdescription){
      this.$router.push({name: 'DetailsPage', params: {title: qtitle, description: qdescription}});
    }
  }
}
</script>