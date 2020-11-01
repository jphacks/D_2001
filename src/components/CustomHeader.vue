<template>
  <div id="header">
    <button v-on:click="login">login</button>
  </div>
</template>

<script>
import firebase from 'firebase/app';
import 'firebase/auth'
export default {
  name: 'CustomHeader',
  created: function(){
    var user = firebase.auth().currentUser;
    if (user != null) {
      console.log("ログイン済み "+user.displayName)
    }
  },
  methods:{
    login: function(){
      console.log("login")
      var provider = new firebase.auth.GithubAuthProvider();
      firebase.auth().signInWithPopup(provider).then(function(result) {
        // This gives you a GitHub Access Token. You can use it to access the GitHub API.
        // var token = result.credential.accessToken;
        // The signed-in user info.
        var user = result.user;
        console.log(user.displayName)
        // ...
      }).catch(function() {
        // Handle Errors here.
        // var errorCode = error.code;
        // var errorMessage = error.message;
        // The email of the user's account used.
        // var email = error.email;
        // The firebase.auth.AuthCredential type that was used.
        // var credential = error.credential;
        // ...
      });
    },
  }
}
</script>