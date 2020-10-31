<template>
  <div class="input-form">
    <p>タイトル</p>
      <input v-model="title" placeholder="タイトル">
    <p>詳細</p>
      <textarea v-model="description" placeholder="説明を記入してください"></textarea>
    <p>選択肢</p>
    <div v-for="(option,index) in optionList" :key="index" class="option">
      <input v-model="option.text" placeholder="選択肢">
    </div>
    <button v-on:click="addOption">+</button>
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
    }
  }
}
</script>