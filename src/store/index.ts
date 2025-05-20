import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        accountInfo: {},
        bankStats: {}
    },
    mutations: {
        SET_ACCOUNT_INFO(state, info) {
            state.accountInfo = info
        }
    },
    actions: {
        fetchAccountInfo({ commit }) {
            fetch('/bank-api/v1/bank/getUserBankDetail');
