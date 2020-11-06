<template>
  <b-button v-on:click="selected" block class="answer-container">
    <div class="answer-text">{{ answer.text }}</div>
    <div v-for="n in displayList" :key="n">
      <img src="../../assets/checkbox-icon-24px.svg" alt="check box icon" v-if="answer.isVoted" class="check-icon">
    </div>
    <div class="answer-votes">{{ answer.votes }} 票</div>
  </b-button>
</template>

<script>
export default{
  name: "AnswerContent",
  props: ['answer'],
  data: function(){
    return {
      displayList: [],
    }
  },
  computed:{
    getPeriodOfGitHub(){
      return this.$store.getters.periodOfGitHub
    }
  },
  mounted: function(){
    // 自分の投票数を取得
    var pollOfUser = Math.floor((this.getPeriodOfGitHub / 2)) + 1
    for(var i=0; i<pollOfUser; i++){
      this.displayList.push(i)
    }
  },
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