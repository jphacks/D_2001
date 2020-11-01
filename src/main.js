import Vue from 'vue'
import App from './App.vue'
// import firebase from 'firebase/app';
import './plugins/firebase'

Vue.config.productionTip = false

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const config = {
//   apiKey: "AIzaSyC3SF6gjp3OvKDKJ9mFvhY4d5FUarlJ_Iw",
//   authDomain: "name-it-38fb8.firebaseapp.com",
//   databaseURL: "https://name-it-38fb8.firebaseio.com",
//   projectId: "name-it-38fb8",
//   storageBucket: "name-it-38fb8.appspot.com",
//   messagingSenderId: "769981424574",
//   appId: "1:769981424574:web:5cf55b20aae1b1afe80fef",
//   measurementId: "G-BL24RV2HJK"
// };
// firebase.default.initializeApp(config)

new Vue({
  render: h => h(App),
}).$mount('#app')
