<template>
  <div class="input-form">
    <p>タイトル</p>
      <input placeholder="タイトル" v-model="title">
    <p id = "descriptionText">詳細</p>
      <textarea placeholder="説明を記入してください" v-model="description"></textarea>
    <p>選択肢</p>
    <div v-for="(option,index) in optionList" :key="index" class="option">
      <input v-model="option.text" placeholder="選択肢">
    </div>
    <button v-on:click="addOption">+</button>
    <br>
    <div class="post-buttons-container">
      <router-link to="/">
        <button v-on:click="cancel" class = "btn btn-outline-dark post-button">戻る</button>
      </router-link>
      <router-link to="/">
        <button v-on:click="post" class = "btn btn-outline-dark post-button">投稿</button>
      </router-link>
    </div>
  </div>
</template>

<script>
import {db} from '../../plugins/firebase';
export default {
  name: 'InputForm',
  data: function() {
    return {
      optionList: [],
      title: "",
      description: ""
    };
  },
  methods: {
    addOption() {
      const option ={
        text: "",
      }
      this.optionList.push(option);
      console.log(this.optionList);
    },
    cancel() {
      console.log("キャンセルしました")
    },
    post() {
      var optionList = this.optionList
      if(this.title != "" && this.description != ""){
        //firestoreにタイトルと詳細をpushする
        db.collection('Questions').add({
          title : this.title,
          description : this.description
        })
        .then(function() {
            console.log("Document successfully written!");
        })
        .catch(function(error) {
            console.error("Error writing document: ", error);
        });
        db.collection("Questions").where("title", "==", this.title).where("description", "==", this.description)
        .get()
        .then(function(querySnapshot) {
            querySnapshot.forEach(function(doc) {
              console.log(doc.id);
              optionList.forEach(function( value ) {
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

      } else {
        alert("タイトルまたは詳細が空欄です.")
      }
    }
  }
}
</script>

<style scoped>
.input-form {
  width: 80%;
  min-width: 600px;
  margin: 30px auto;
  border: 2px solid;
}

.post-buttons-container{
  width: 60%;
  text-align: right;
  margin: 60px auto;
}
.post-button{
  margin: 0 30px;
  width: 150px;
}
</style>