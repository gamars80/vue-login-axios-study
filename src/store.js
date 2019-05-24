import Vue from "vue"
import Vuex from "vuex"
import router from "./router"
import axios from "axios"

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    userInfo: null,
    allUsers: [
      { id: 1, name: "gamars", email: "gamars@gmail.com", password: "11111" },
      {
        id: 2,
        name: "gamars2",
        email: "gamars2@gmail.com",
        password: "11111"
      }
    ],
    isLogin: false,
    isLoginError: false
  },
  mutations: {
    //로그인 성공시
    loginSuccess(state, payload) {
      state.isLogin = true
      state.isLoginError = false
      state.userInfo = payload
    },
    //로그인 실패시
    loginError(state) {
      state.isLogin = false
      state.isLoginError = true
    },
    //로그아웃
    logout(state) {
      state.isLogin = false
      state.isLoginError = false
      state.userInfo = null
    }
  },
  actions: {
    //로그인 시도
    login({ dispatch }, loginObj) {
      //로그인 -> 토큰반환 통신
      axios
        .post("https://reqres.in/api/login", loginObj)
        .then(res => {
          //성공시 토큰 블라블라
          //토큰을 헤더에 포함시켜서 유저정보를 요청
          let token = res.data.token
          //토큰을 로컬스토로지에 저장
          localStorage.setItem("access_token", token)
          dispatch("getMemberInfo")

          console.log(res)
        })
        .catch(() => {
          alert("이메일과 비밀번호를 확인하세요")
        })
      // //전체 유저에서 해당 이메일로 유저를 찾는다
      // let selectedUser = null
      // state.allUsers.forEach(user => {
      //   if (user.email === loginObj.email) {
      //     selectedUser = user
      //   }
      // })
      // // if (selectedUser === null) commit("loginError")
      // if (selectedUser === null || selectedUser.password !== loginObj.password)
      //   commit("loginError")
      // else {
      //   commit("loginSuccess", selectedUser)
      //   router.push({ name: "mypage" })
      // }
      //commit("loginSuccess")
    },
    logout({ commit }) {
      commit("logout")
      router.push({ name: "home" })
    },
    getMemberInfo({ commit }) {
      //로컬스토로지에 저장되어 있는 토큰을 불러온다
      let token = localStorage.getItem("access_token")
      let config = {
        headers: {
          "access-token": token
        }
      }
      //토큰 -> 멤버의 정보 반환
      //새로고침 -> 토큰만 가지고  멤버정보를 요청
      axios
        .get("https://reqres.in/api/users/2", config)
        .then(res2 => {
          //               avatar: "https://s3.amazonaws.com/uifaces/faces/twitter/josephstein/128.jpg"
          // email: "janet.weaver@reqres.in"
          // first_name: "Janet"
          // id: 2
          // last_name: "Weaver"
          let userInfo = {
            first_name: res2.data.data.first_name,
            last_name: res2.data.data.last_name,
            id: res2.data.data.id,
            avatar: res2.data.data.avatar
          }
          commit("loginSuccess", userInfo)
          //아래처럼도 가능
          // commit("loginSuccess", res2.data.data)
          console.log(res2)
        })
        .catch(() => {
          alert("이메일과 비밀번호를 확인하세요")
        })
    }
  }
})
