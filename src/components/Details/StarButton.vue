<template>
  <div>
    <b-button v-on:click="pushStar" variant="primary">お気に入り</b-button>
    {{stared}}
  </div>
</template>

<script>
import {db} from '../../plugins/firebase'
export default {
  name: "StarButton",
  data: function(){
    return{
      stared: false,
    }
  },
  props:[
    "docID",
    "userID"
  ],
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
        userRef.add({
          stared: true
        })
      } else {
        // お気に入り削除
      }
    }
  },
}
</script>