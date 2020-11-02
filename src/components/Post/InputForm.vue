<template>
  <div class="input-form">
    <div class="container">
      <h2>タイトル</h2>
      <b-form-input placeholder="タイトル" v-model="title"></b-form-input>
    </div>
    <div class="container">
      <h2>詳細</h2>
      <b-form-textarea placeholder="説明を記入してください" v-model="description" rows="10" no-resize></b-form-textarea>
    </div>
    <div class="container">
      <h2>選択肢</h2>
      <div v-for="(option,index) in optionList" :key="index" class="option">
        <input v-model="option.text" placeholder="選択肢">
      </div>
      <button v-on:click="addOption">+</button>
    </div>
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
  background-color: #FFFFFF;
  padding: 30px;
}

.container{
  margin-bottom: 10px;
}

h2 {
  margin-bottom: 5px;
}

.post-button{
  margin: 0 30px;
  width: 150px;
}
</style>