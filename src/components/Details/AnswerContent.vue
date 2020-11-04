<template>
  <b-button v-on:click="selected" block class="answer-container">
    <div class="answer-text">{{ answer.text }}</div>
    <img src="../../assets/checkbox-icon-24px.svg" alt="check box icon" v-if="answer.isVoted" class="check-icon">
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

.check-icon{
  margin-right: 5px;
}

.answer-votes{
  text-align: right;
}
</style>