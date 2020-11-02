<template>
  <div>
    <CustomHeader/>
     <div v-if="title != undefined">{{title}}</div>
     <div v-if="description != undefined">{{description}}</div>
     <table>
        <tr v-for="(answer, index) in answers" v-bind:key="index">
          <td v-text="answer.text"></td>
        </tr>
      </table>
      <div v-for="(h,index) in newAnswer" :key="index" class="option">
        <input v-model="h.text" placeholder="選択肢">
      </div>
      <button v-on:click="addOption">+</button>
      <br>
      <button v-on:click="cancel">キャンセル</button>
      <router-link to="/">
        <button v-on:click="post">投稿</button>
      </router-link>
  </div>
</template>

<script>
import {db} from '../plugins/firebase';
import CustomHeader from './CustomHeader'
export default {
  name: 'DetailsPage',
  data: function() {
    return {
      answers: [],
      newAnswer: [],
    }
  },
  components: {
    CustomHeader,
  },
  methods: {
    addOption() {
      const option ={
        text: "",
      }
      this.newAnswer.push(option);
      console.log(this.newAnswer);
    },
    cancel() {
      console.log("キャンセルしました")
    },
    post() {
      var newAnswer = this.newAnswer
      db.collection("Questions").where("title", "==", this.title).where("description", "==", this.description)
      .get()
      .then(function(querySnapshot) {
          querySnapshot.forEach(function(doc) {
            console.log(doc.id);
            newAnswer.forEach(function( value ) {
              db.collection("Questions").doc(doc.id).collection("Answers").add({
                content : value
              })
              console.log(value);
            })
          });
      })
      .then(function() {
          console.log("Answer successfully written!");
      })
      .catch(function(error) {
          console.log("Error getting documents: ", error);
      });
    },
  },
  mounted: function(){
    console.log(this.title)
    var ref = db.collection("Questions").where("title", "==", this.title).where("description", "==", this.description)

    ref.get()
      .then(snapshot => {
        if (snapshot.empty) {
          console.log('No matching document.');
          return;
        }
        snapshot.forEach(doc => {
          db.collection("Questions").doc(doc.id).collection("Answers").get().then(querySnapshot => {
            querySnapshot.forEach(doc => {
              // console.log(doc.id, '=>', doc.data().content)
              var answerData = {
                text: doc.data().content.text,
              }
              // console.log(answerData)
              this.answers.push(answerData)
            })
          })
        });
      })
      .catch(err => {
        console.log('Error getting documents', err);
      });
  },
  props: [
    'title',
    'description'
  ],
}
</script>