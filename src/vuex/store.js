import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

import { ApiBaseUrl } from '../config'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: null
  },
  mutations: {
    SET_USER_DATA(state, userData) {
      state.user = userData
      localStorage.setItem('user', JSON.stringify(userData))
      axios.defaults.headers.common['Authorization'] = `Bearer ${
        userData.token
      }`
    },
    CLEAR_USER_DATA() {
      localStorage.removeItem('user')
      location.reload()
    }
  },
  actions: {
    async register({ commit }, credentials) {
      const { data } = await axios.post(`${ApiBaseUrl}/register`, credentials)
      commit('SET_USER_DATA', data)
    },
    async login({ commit }, credentials) {
      const { data } = await axios.post(`${ApiBaseUrl}/login`, credentials)
      commit('SET_USER_DATA', data)
    },
    logout({ commit }) {
      commit('CLEAR_USER_DATA')
    }
  },
  getters: {
    loggedIn (state) {
      return !!state.user
    }
  }
})
