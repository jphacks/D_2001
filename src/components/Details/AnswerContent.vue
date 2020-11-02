<template>
  <b-button block v-text="answer"></b-button>
  <!-- <div class="answer-content">
    <div v-text="answer" class="h2"></div>
  </div> -->
</template>

<script>
export default{
  name: "AnswerContent",
  props: ['answer'],
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