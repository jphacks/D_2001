<template>
  <div>
    <div class="container">
      <div v-for="(comment, index) in comments" v-bind:key="index">
        <div v-text="comment.text"></div>
        <div v-text="comment.time"></div>
        <div v-text="comment.userName"></div>
      </div>
    </div>
    <div class="container">
      <h2>コメント</h2>
      <b-form-textarea placeholder="コメントを記入してください" v-model="commentText" rows="5" no-resize></b-form-textarea>
      <b-button v-on:click="pushComment" variant="primary">コメントする</b-button>
    </div>
  </div>
</template>

<script>
import {db} from '../../plugins/firebase';
export default {
  name: "CommentContent",
  data: function(){
    return {
      commentText: "",
      comments: [],
      docID: "",
    }
  },
  props:[
    "userID"
  ],
  computed:{
    getUserName(){
      return this.$store.getters.userName
    }
  },
  mounted: function(){
    // URLからドキュメントIDを取得
    this.docID = this.$route.params.id
    var ref = db.collection('Questions').doc(this.docID).collection('Comments').orderBy('time', 'asc')
    ref.get().then(snapshot => {
      if (snapshot.empty) {
        console.log('No matching documents.');
        return;
      }
      snapshot.forEach(doc => {
        //コメント情報を配列で所持する
        var commentData = {
          text: doc.data().comment,
          userName: doc.data().userName,
          time: this.formatDate(new Date(doc.data().time * 1000)),
        }
        this.comments.push(commentData)
      });
    })
  },
  methods: {
    pushComment: function(){
      console.log(this.commentText)
      if(this.userID == null){
        alert("コメントするにはログインしてください")
      } else if(this.commentText == ""){
        alert("コメントを入力してください")
      } else{
        // データベースにコメント情報をプッシュする
        db.collection('Questions').doc(this.docID).collection('Comments').add({
          comment: this.commentText,
          time: new Date(),
          userName: this.getUserName,
        })
        .then(() => {
            console.log("Document successfully written!")
             var commentData = {
              text: this.commentText,
              userName: this.getUserName,
              time: new Date(),
            }
            this.comments.push(commentData)
        })
        .catch(function(error) {
            console.error("Error writing document: ", error)
        });
      }
    },
    formatDate: function(dt) {
      var y = dt.getYear()-69
      var m = ('00' + (dt.getMonth()+1)).slice(-2)
      var d = ('00' + dt.getDate()).slice(-2)
      var h = ('00' + dt.getHours()).slice(-2)
      var min = ('00' + dt.getMinutes()).slice(-2)
      return (y + '/' + m + '/' + d + ' ' + h + ':' + min)
    },
  },
}
</script>