<template>
  <div id="header-container">
    <div id="header" v-if="!loading">
      <div id="icon-container">
        <div id="icon">name_it</div>
      </div>
      <router-link to="/post">
        <b-button variant="light" id="post-button">投稿</b-button>
      </router-link>
      <div id="user-container">
        <button v-on:click="login" v-if="!isUserExist" class="btn btn-light" id="login-btn">login</button>
        <div v-if="isUserExist">
          <p id="user-name-text"> {{ userName }} </p>
        </div> 
        <button v-on:click="logout" class="btn btn-light">logout</button> 
      </div>
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
  justify-content: space-between;
  max-width: 1140px;
  height: 64px;
  margin-right: auto;
  margin-left: auto;
}

#icon-container {
  width: 500px;
}

#icon {
  height: 100%;
  font-size: 30px;
  font-weight: bold;
  padding-top: 5px;
}

#post-button{
  width: 100px;
  margin: 10px auto;
}

#user-container {
  width: 400px;
  display: flex;
  justify-content: flex-end;
  margin: 10px 30px 10px 0px;
}

#user-container > * {
  margin: 0 10px;
}

#user-name-text{
  font-size: 1.6em;
  padding: auto 0;
}
</style>