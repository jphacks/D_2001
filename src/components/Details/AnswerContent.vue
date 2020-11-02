<template>
  <div class="answer-content">
    <div v-text="answer"></div>
  </div>
</template>

<script>
export default{
  name: "AnswerContent",
  props: ['answer'],
}
</script>