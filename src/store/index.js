import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from "vuex-persistedstate";

Vue.use(Vuex)

const initialState = {
  docID: ''
}

const store = new Vuex.Store({
  //state:コンポーネントでいうdata
  state: {
    initialState
  },

  //getters:コンポーネントでいうcomputed的なもの
  getters:{
    docID(state) {
      console.log(state.docID)
      return state.docID
    }
  },

  //mutations:コンポーネントでいうmethod（と言うかsetter）
  //stateを唯一変更できるもの
  mutations: {
    //vuexでは引数をpayloadと呼ぶっぽい
    setDocID(state, payload){
      state.docID = payload
    }
  },

  //actionのコミットを使うことでミューテーションを呼び出す（コンポーネントには無い概念）
  actions: {
    doUpdate({commit}, docID){
      commit('setDocID',docID)
    }
  },

  plugins: [createPersistedState()]
})
export default store