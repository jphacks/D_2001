<template>
  <b-button v-on:click="selected" block class="answer-container">
    <div class="answer-text">{{ answer.text }} :</div>
    <div class="answer-votes">{{ answer.votes }} 票</div>
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

<style scoped>
.answer-container{
  text-align: left;
  display: flex;
}

.answer-text{
  margin-right: auto;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.answer-votes{
  text-align: right;
}
</style>