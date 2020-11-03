<template>
  <div id="header-container">
    <div id="header" v-if="!loading">
      <div id="icon-container">
        <div id="icon"><img src="../assets/app-logo-24px.svg" width="30" height="30" style="fill: white;" alt="name_it icon"> name_it</div>
      </div>
      <!-- 投稿ボタン -->
      <router-link to="/post">
        <b-button variant="light" id="post-button">
          <img src="../assets/post-icon-24px.svg" alt="post-icon">
          投稿
        </b-button>
      </router-link>
      <!-- ユーザー情報のコンテナ -->
      <div id="user-container">
        <!-- ログインボタン -->
        <button v-on:click="login" v-if="!isUserExist" class="btn btn-light" id="login-btn">
          <img src="../assets/login-icon-24px.svg" alt="login-icon"> 
          login
        </button>
        <!-- ユーザー名 -->
        <div v-if="isUserExist">
          <div id="user-name-text"> {{ userName }} </div>
        </div> 
        <!-- ログアウトボタン -->
        <button v-on:click="logout" class="btn btn-light">logout</button> 
      </div>
    </div>
  </div>
</template>

<script>
import firebase from 'firebase/app';
import 'firebase/auth'
import {db} from '../plugins/firebase'
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
      firebase.auth().signInWithPopup(provider).then((result) => {
        // ログイン成功
        var user = result.user;
        console.log(user.displayName)
        this.isUserExist = true
        this.userName = user.displayName
        this.initializeUserdb(user)
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
        //storeに値をuserIDを保存
        this.$store.dispatch('updateUserID', user.uid)
      } else {
        console.log("未ログイン")
        this.isUserExist = false
      }
      // ログイン確認終了
      this.loading = false
    },
    initializeUserdb: function(user){
      console.log("DBの初期化  "+ user.uid)
      db.collection("Users").doc(user.uid).set({
          name: user.displayName
        })
        .then(function() {
            console.log("Document successfully written!");
        })
        .catch(function(error) {
            console.error("Error writing document: ", error);
        });
    }
  },
}
</script>

<style>
#header-container {
  position: fixed;
  top: 0px;
  left: 0px;
  width: 100%;
  background-color: #2d3047;
  color: #ffffff;
}

#header {
  display: flex;
  justify-content: flex-start;
  max-width: 1140px;
  height: 64px;
  margin-right: auto;
  margin-left: auto;
}

#icon-container {
  width: 200px;
  margin-left: 30px;
}

#icon {
  height: 100%;
  font-size: 30px;
  font-weight: bold;
  padding-top: 5px;
}

/* 投稿ボタンから右にずらしたい暫定策 */
#header > a {
  margin-left: auto;
  margin-right: 20px;
}

#post-button{
  width: 100px;
  margin: 10px auto;
}

#user-container {
  width: 200px;
  display: flex;
  justify-content: flex-end;
  margin: 10px 30px 10px 0px;
}

#user-container > * {
  margin: 0 10px;
}

#login-btn > img{
  float: left;
}

#user-name-text{
  padding-top: 6px;
  width: 100px;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 1.2rem;
}
</style>