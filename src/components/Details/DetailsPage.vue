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
  </div>
</template>

<script>
import {db} from '../../plugins/firebase';
import CustomHeader from '../CustomHeader'
export default {
  name: 'DetailsPage',
  data: function() {
    return {
      answers: [],
    }
  },
  components: {
    CustomHeader,
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