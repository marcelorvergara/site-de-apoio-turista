import Vue from 'vue';
import Vuex from 'vuex'

Vue.use(Vuex);

export const store = new Vuex.Store({
    state:{
        poi:[],
        loc: [],
        mostraMapa: false,
        mostraServicos: false,
        gKey:'',
        user: {
            loggedIn: false,
            data: null
        }
    },
    getters:{
        mostrarMapa(state){
            return state.mostraMapa
        },
        user(state){
            return state.user
        },
        SET_LOGGED_IN(state, value) {
            state.user.loggedIn = value;
        },
        SET_USER(state, data) {
            state.user.data = data;
        },
        gKey(state){
            return state.gKey
        },
        getPoi(state){
            return state.poi
        }
    },
    mutations:{
        setLat(state,lat){
          state.lat = lat
        },
        setLng(state,lng){
          state.lng = lng
        },
        setLoc(state,loc){
          state.loc.push(loc)
        },
        mostrar(state,val){
            state.mostraMapa = val;
        },
        setServicos(state,val){
            state.mostraServicos = val
        },
        SET_LOGGED_IN(state, value) {
            state.user.loggedIn = value;
        },
        SET_USER(state, data) {
            state.user.data = data;
        },
        setPoi(state,data){
            state.poi.push(data)
        }
    },
    actions: {
        fetchUser({ commit }, user) {
            commit("SET_LOGGED_IN", user !== null);
            if (user) {
                commit("SET_USER", {
                    displayName: user.displayName,
                    email: user.email
                });
            } else {
                commit("SET_USER", null);
            }
        }
    }
})