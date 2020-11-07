import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from "vuex-persistedstate";

Vue.use(Vuex)

// const initialState = {
//   docID: '',
//   userID: '',
//   userName: '',
//   periodOfGitHub: 0,
// }

const store = new Vuex.Store({
  //state:コンポーネントでいうdata
  state: {
    // initialState
    docID: '',
    userID: '',
    userName: '',
    periodOfGitHub: 0,
  },

  //getters:コンポーネントでいうcomputed的なもの
  getters:{
    docID(state) {
      return state.docID
    },
    userID(state){
      return state.userID
    },
    userName(state){
      return state.userName
    },
    periodOfGitHub(state){
      console.log(state.periodOfGitHub)
      return state.periodOfGitHub
    }
  },

  //mutations:コンポーネントでいうmethod（と言うかsetter）
  //stateを唯一変更できるもの
  mutations: {
    //vuexでは引数をpayloadと呼ぶっぽい
    setDocID(state, payload){
      state.docID = payload
    },
    setUserID(state, payload){
      state.userID = payload
    },
    setUserName(state, payload){
      state.userName = payload
    },
    setPeriodOfGitHub(state, payload){
      state.periodOfGitHub = payload
    }
  },

  //actionのコミットを使うことでミューテーションを呼び出す（コンポーネントには無い概念）
  actions: {
    doUpdate({commit}, docID){
      commit('setDocID',docID)
    },
    updateUserID({commit}, userID){
      commit('setUserID', userID)
    },
    updateUserName({commit}, userName){
      commit('setUserName', userName)
    },
    updatePeriodOfGitHub({commit}, periodOfGitHub){
      commit('setPeriodOfGitHub', periodOfGitHub)
    }
  },

  plugins: [createPersistedState()]
})
export default store