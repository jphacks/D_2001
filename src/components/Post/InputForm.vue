<template>
  <div class="input-form">
    <!-- タイトル入力欄 -->
    <div class="section-container">
      <h2>タイトル</h2>
      <b-form-input placeholder="投稿のタイトルを入力してください" v-model="title"></b-form-input>
    </div>
    <!-- 詳細入力欄 -->
    <div class="section-container">
      <h2>詳細</h2>
      <b-tabs>
        <b-tab title="Write" active>
          <div class="write-container">
            <b-form-textarea placeholder="詳細な説明を入力してください" v-model="description" rows="10" max-rows="100"></b-form-textarea>
            <div class="markdown-description">
              <img src="../../assets/iconfinder_markdown_298823.svg" alt="markdown-icon" class="markdown-icon">Styling with Markdown is supported
            </div>
          </div>
        </b-tab>
        <b-tab title="Preview">
          <vue-markdown :source="description" class="preview-container"></vue-markdown>
        </b-tab>
      </b-tabs>
    </div>
    <!-- 選択肢入力欄 -->
    <div class="section-container">
      <h2>選択肢</h2>
      <div v-for="(option,index) in optionList" :key="index" class="option">
        <b-input-group>
          <b-form-input v-model="option.text" placeholder="選択肢" class=”form-inline”></b-form-input>
          <b-button variant="light" @click="deleteForm(index)">
            <img src="../../assets/delete-icon-24px.svg" alt="delete-icon">
          </b-button>
        </b-input-group>
      </div>
      <b-button v-on:click="addOption" variant="secondary">選択肢を追加</b-button>
    </div>
    <!-- 投稿ボタンなど -->
    <div class="section-container post-buttons-container">
      <router-link to="/">
        <b-button v-on:click="cancel" variant="outline-dark">戻る</b-button>
      </router-link>
      <b-button v-on:click="post" variant="primary">投稿</b-button>
    </div>
  </div>
</template>

<script>
import {db} from '../../plugins/firebase';
import VueMarkdown from 'vue-markdown'
export default {
  name: 'InputForm',
  data: function() {
    return {
      optionList: [],
      title: "",
      description: ""
    };
  },
  components: {
    VueMarkdown
  },
  computed:{
    getUserID(){
      return this.$store.getters.userID
    }
  },
  methods: {
    addOption() {
      const option ={
        text: "",
      }
      this.optionList.push(option);
    },
    deleteForm(index){
      // indexの要素を削除
      this.optionList.splice(index,1)
    },
    cancel() {
      console.log("キャンセルしました")
    },
    post() {
      var optionList = this.optionList
      var hasEmpty = false
      optionList.forEach( option =>{
        if(option.text == ""){
          hasEmpty = true
        }
      })
      try{
        for(let i=0; i<this.optionList.length; i++) {
          for(let j=i+1; j<this.optionList.length; j++) {
            if(this.optionList[i].text == this.optionList[j].text) {
              throw "同じ選択肢があります."
            }
          }
        }
        if(this.title != "" && this.description != ""){
          if(this.optionList.length >= 1){
            if(!hasEmpty){
              //firestoreにタイトルと詳細をpushする
              db.collection('Questions').add({
                title : this.title,
                description : this.description,
                time: new Date(),
                userID: this.getUserID,
              })
              .then(function() {
                  console.log("Document successfully written!");
              })
              .catch(function(error) {
                  console.error("Error writing document: ", error);
              });
              db.collection("Questions").where("title", "==", this.title).where("description", "==", this.description)
              .get()
              .then(function(querySnapshot) {
                  querySnapshot.forEach(function(doc) {
                    console.log(doc.id);
                    optionList.forEach(function( value ) {
                      db.collection("Questions").doc(doc.id).collection("Answers").add({
                        text : value.text,
                        votesNum: 0
                      })
                    })
                  });
              })
              .then(function() {
                  console.log("Answer successfully written!");
              })
              .catch(function(error) {
                  console.log("Error getting documents: ", error);
              });
              // HomePageに遷移する
              this.$router.push({name: 'HomePage', params: {docID: this.docID}});
            } else {
              alert("空欄の選択肢があります")
            }
          } else{
            alert("選択肢を追加してください．")
          }
        } else {
          alert("タイトルまたは詳細が空欄です.")
        }
      }
      catch(e) {
        alert(e)
      }
    }
  }
}
</script>

<style scoped>
.input-form {
  background-color: #FFFFFF;
  padding: 30px;
}

.section-container{
  margin-bottom: 2rem;
}

h2 {
  margin-bottom: 1rem;
}

.write-container{
  /* height固定のためのマジックナンバー */
  min-height: 288px;

  padding: 5px;
  border: 1px solid #ced4da;
  border-top: 0px;
  border-radius: 0 0 0.25rem 0.25rem;
}

/* .write-container > *{
  margin-top: 10px;
} */

.markdown-description{
  padding: 5px 10px;
}

.markdown-icon{
  width: 1rem;
  margin-right: 5px;
}

.preview-container{
  /* height固定のためのマジックナンバー */
  min-height: 288px;
  
  padding: 20px;
  border: 1px solid #ced4da;
  border-top: 0px;
  border-radius: 0 0 0.25rem 0.25rem;
}

.option{
  margin-bottom: 1rem;
}

.post-buttons-container{
  text-align: right;
}

.post-buttons-container > * {
  margin-left: 20px;
}
</style>