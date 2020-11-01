<template>
  <div class="input-form">
    <p>タイトル</p>
      <input placeholder="タイトル">
    <p>詳細</p>
      <textarea placeholder="説明を記入してください"></textarea>
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
export default {
  name: 'InputForm',
  data() {
    return {
      optionList: []
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
      console.log("投稿しました")
    }
  }
}
</script>