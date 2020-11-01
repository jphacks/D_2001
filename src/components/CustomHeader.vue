<template>
  <div id="header" v-if="!loading">
    <button v-on:click="login" v-if="!isUserExist">login</button>
    <button v-on:click="logout">logout</button>
    <div v-if="isUserExist">
      <p> {{ userName }} </p>
    </div>
  </div>
</template>

<script>
import firebase from 'firebase/app';
import 'firebase/auth'
export default {
  name: 'CustomHeader',
  data() {
    return {
      isUserExist: false,
      userName: String,
      currentuser: firebase.auth().currentUser,
      loading: true,
    }
  },
  mounted: function(){
    // userのステータスが変わったとき（ログイン，ログアウト時）にconfirmLoginを実行する
    firebase.auth().onAuthStateChanged(this.confirmLogin);
  },
  methods:{
    login: function(){
      console.log("login")
      var provider = new firebase.auth.GithubAuthProvider();
      firebase.auth().signInWithPopup(provider).then(function(result) {
        // ログイン成功
        var user = result.user;
        console.log(user.displayName)
        this.isUserExist = true
        this.userName = user.displayName 
      }).catch(function() {
        // ログイン失敗
      });
    },
    //デバッグ用のサインアウトメソッド
    logout: function(){
      firebase.auth().signOut().then(function() {
        // Sign-out successful.
        console.log("サインアウト")
      }).catch(function(error) {
        // An error happened.
        console.log("サインアウトエラー")
        console.log(error.message)
      });
    },
    confirmLogin: function(user){
      // ユーザがログイン状態か確認する
      if (user) {
        console.log("ログイン済み "+ user.displayName)
        this.isUserExist = true
        this.userName = user.displayName
      } else {
        console.log("未ログイン")
        this.isUserExist = false
      }
      // ログイン確認終了
      this.loading = false
    },
  },
}
</script>