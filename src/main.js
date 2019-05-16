// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import 'babel-polyfill'
import router from './router'
import './assets/css/reset.css'
import './assets/css/border.css'
import './assets/css/iconfont.css'
import vueLazyLoad from 'vue-lazyload'
import infiniteScroll from 'vue-infinite-scroll'
import Vuex from 'vuex'
Vue.use(infiniteScroll)
Vue.use(Vuex);

const store = new Vuex.Store({
	state:{
		cartNum:0
	},
	mutations:{
		addCartNums(state,addNum){
			state.cartNum+=parseInt(addNum)
		},
		setCartNums(state,Num){
			state.cartNum=parseInt(Num)
		}
	}
})


Vue.config.productionTip = false
Vue.use(vueLazyLoad,{
	loading:'@/../static/lazyloading/loading-spin.svg'
})
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})


