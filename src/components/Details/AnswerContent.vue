<template>
  <b-button v-on:click="selected" block>
    {{ answer.text }} :  {{ answer.votes }}票
    <img src="../../assets/checkbox-icon-24px.svg" alt="check box icon" v-if="answer.isVoted">
  </b-button>
</template>

<script>
export default{
  name: "AnswerContent",
  props: ['answer'],
  methods:{
    selected: function(){
      this.$emit("sendIndex", this.answer.index);
    }
  },
}
</script>

<style>
.answer-content{
  text-align: center;
  width: 500px;
  height: 70px;
  border: 2px solid;
  border-color: gray;
  border-radius: 2em;
  margin: 2px auto;
  padding-top: 15px;
}
.answer-content :hover{
  cursor: pointer;
}
</style>