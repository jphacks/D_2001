import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from "vuex-persistedstate";

Vue.use(Vuex)

const initialState = {
  docID: '',
  userID: '',
  userName: '',
}

const store = new Vuex.Store({
  //state:コンポーネントでいうdata
  state: {
    initialState
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
    }
  },

  plugins: [createPersistedState()]
})
export default store