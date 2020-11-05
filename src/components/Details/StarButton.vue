<template>
  <div>
    <b-button v-if="!stared" v-on:click="pushStar">
      <img src="../../assets/invisible-star-24px.svg" alt="name_it icon" class="name-it-icon" v-if="!stared" v-on:click="pushStar">
    </b-button>
    <b-button v-if="stared" v-on:click="pushStar">
      <img src="../../assets/star-24px.svg" alt="name_it icon" class="name-it-icon" v-if="stared" v-on:click="pushStar">
    </b-button>
  </div>
</template>

<script>
import {db} from '../../plugins/firebase'
export default {
  name: "StarButton",
  data: function(){
    return{
      stared: false,
      docID: "",
    }
  },
  props:[
    "userID"
  ],
  mounted: function(){
    // URLからドキュメントIDを取得
    this.docID = this.$route.params.id
    // データベースからスター状態を取得
    var userRef = db.collection("Users").doc(this.userID).collection("Questions").doc(this.docID)
    userRef.get().then(snapshot => {
      if(snapshot.exists){
        if(snapshot.data().stared != null){
          this.stared = snapshot.data().stared
        }
      }else{
        //投票もお気に入りもしていない
      }
    })
  },
  methods:{
    pushStar: function(){
      // ログインしているか確認
      if(this.userID == null){
        this.stared = !this.stared
        alert("お気に入り機能を使うにはログインしてください")
      }
      this.stared = !this.stared
      var userRef = db.collection("Users").doc(this.userID).collection("Questions").doc(this.docID)
      if(this.stared){
        // お気に入り追加
        userRef.set({
          stared: true
        }, { merge: true })
      } else {
        // お気に入り削除
        userRef.set({
          stared: false
        }, { merge: true })
      }
    },
    autoStar: function(){
      var userRef = db.collection("Users").doc(this.userID).collection("Questions").doc(this.docID)
      userRef.set({
        stared: true
      }, { merge: true })
      this.stared = true
    }
  },
}
</script>