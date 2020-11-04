<template>
  <div>
    <CustomHeader/>
    <b-container class="contents-container">
      <div class="leading-container">
        <h2>ネーミングにみんなで答えを！</h2>
        <div>
          name_itにようこそ！<br>
          このサイトは命名の悩みを投稿してみんなにアンケートをとれるエンジニア支援サイトになります。エンジニアの知見を活かして悩ましい命名に正解を見つけていきましょう！
        </div>
      </div>
      <QuestionsList/>
    </b-container>
  </div>
</template>

<script>
import CustomHeader from '../CustomHeader'
import QuestionsList from './QuestionsList'

export default {
  name: 'HomePage',
  components: {
    CustomHeader,
    QuestionsList
  }
}
</script>

<style scoped>
.leading-container{
  padding: 30px;
  margin-bottom: 30px;
  background-color: #FFFFFF;
}

.contents-container {
  margin-top: 30px;
  margin-bottom: 30px;
}
</style>
