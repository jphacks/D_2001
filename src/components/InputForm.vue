<template>
  <div class="input-form">
    <p>タイトル</p>
      <input placeholder="タイトル" v-model="title">
    <p>詳細</p>
      <textarea placeholder="説明を記入してください" v-model="descrption"></textarea>
    <p>選択肢</p>
    <div v-for="(option,index) in optionList" :key="index" class="option">
      <input v-model="option.text" placeholder="選択肢">
    </div>
    <button v-on:click="addOption">+</button>
    <br>
    <button v-on:click="cancel">キャンセル</button>
    <button v-on:click="post">投稿</button>
  </div>
</template>

<script>
import {db} from '../plugins/firebase';
export default {
  name: 'InputForm',
  data: function() {
    return {
      optionList: [],
      title: "",
      descrption: ""
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
      if(this.title != "" && this.descrption != ""){
        //firestoreにタイトルと詳細をpushする
        db.collection('Questions').add({
          title : this.title,
          descrption : this.descrption
        })
      } else {
        alert("タイトルまたは詳細が空欄です.")
      }
    }
  }
}
</script>