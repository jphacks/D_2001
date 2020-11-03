<template>
  <div id="header-container">
    <b-container class="header" v-if="!loading">
      <div class="icon-container">
        <div>
          <img src="../assets/name_it_icon.png" alt="name_it icon" class="name-it-icon">
        </div>
        <div class="name-it-title">name_it</div>
      </div>
      <!-- 投稿ボタン -->
      <router-link to="/post">
        <b-button variant="light" class="post-button">
          <img src="..\assets\post-icon-24px.svg" alt="post-icon">
          投稿
        </b-button>
      </router-link>
      <!-- ユーザー情報のコンテナ -->
      <div id="user-container">
        <!-- ログインボタン -->
        <b-button v-on:click="login" v-if="!isUserExist" variant="light" >
          <img src="..\assets\login-icon-24px.svg" alt="login-icon"> login
        </b-button>
        <!-- ユーザー名 -->
        <div v-if="isUserExist">
          <div id="user-name-text"> {{ userName }} </div>
        </div> 
        <!-- ログアウトボタン -->
        <b-button v-on:click="logout" variant="light" >
          logout
        </b-button>
      </div>
    </b-container>
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

<style>
#header-container {
  position: fixed;
  top: 0px;
  left: 0px;
  width: 100%;
  height: 70px;
  background-color: #2d3047;
  color: #ffffff;
}

.header {
  display: flex;
  justify-content: flex-start;
  height: 70px;
  padding-top: 5px;
  padding-bottom: 5px;
}

.icon-container {
  margin-right: auto;
  display: flex;
}

.name-it-icon{
  width: 60px;
}

.name-it-title {
  height: 100%;
  font-size: 30px;
  font-weight: bold;
  padding-left: 10px;
  padding-top: 5px;
}

.post-button{
  width: 100px;
  height: 50px;
  margin-top: 5px;
  margin-bottom: 5px;
}

#user-container {
  width: 200px;
  margin-top: 5px;
  margin-bottom: 5px;
  display: flex;
  justify-content: flex-end;
}

#user-container > * {
  margin-left: 10px;
}

#user-name-text{
  /* テキストの高さ揃え */
  padding-top: 9px;

  width: 100px;
  text-align: center;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 1.2rem;
}
</style>