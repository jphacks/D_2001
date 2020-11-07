<template>
  <div>
    <h3>コメント</h3>
    <div v-for="(comment, index) in comments" v-bind:key="index">
      <div class="comment-container">
        <div class="comment-title-container">
          <div v-text="comment.userName" class="user-name-text"></div>
          <div v-text="comment.time" class="time-text"></div>
        </div>
        <div v-text="comment.text" class="comment-text"></div>
        <hr>
      </div>
    </div>
    <b-form-textarea placeholder="コメントを記入してください" v-model="commentText" rows="5" no-resize></b-form-textarea>
    <div class="comment-entry-btn-container">
      <b-button v-on:click="pushComment" variant="primary" id="comment-entry-btn">コメントする</b-button>
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
          userName: doc.data().userName + "さん",
          time: this.formatDate(new Date(doc.data().time.seconds * 1000)),
        }
        this.comments.push(commentData)
      });
    })
  },
  methods: {
    pushComment: function(){
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
              userName: this.getUserName + "さん",
              time: this.formatDate(new Date()),
            }
            this.comments.push(commentData)
            this.commentText = ""
        })
        .catch(function(error) {
            console.error("Error writing document: ", error)
        });
      }
    },
    formatDate: function(dt) {
      var y = dt.getFullYear()
      var m = ('00' + (dt.getMonth()+1)).slice(-2)
      var d = ('00' + dt.getDate()).slice(-2)
      var h = ('00' + dt.getHours()).slice(-2)
      var min = ('00' + dt.getMinutes()).slice(-2)
      return (y + '/' + m + '/' + d + ' ' + h + ':' + min)
    },
  },
}
</script>

<style>
.comment-container{
  padding: 7px 30px;
}

.comment-title-container{
  display: flex;
  margin-bottom: 10px;
}

.comment-title-container > *{
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  color: gray;
}

.user-name-text{
  margin-right: auto;
  -webkit-line-clamp: 1;
}

.time-text{
  -webkit-line-clamp: 1;
  text-align: right;
  font-size: 0.8rem;
}

.comment-entry-btn-container{
  text-align: right;
}
</style>