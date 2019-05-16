<template>
	<div>
		<login-page v-if = 'loginClick' @toggleDisplay = 'toggleDisplay'  @loginSuccess = 'loginSuccess'></login-page>
		<tip v-show = 'ifAddTip'>
			<p slot='tipInfo'>添加购物车成功</p>
			<a href="javascript:void(0)" slot='leftBtn' @click = 'ifAddTip = false'>继续购物</a>
			<router-link to="/cart" slot='rightBtn' @click.native = 'ifAddTip=false'>去购物车</router-link>
		</tip>
		<tip v-show = 'ifRemoveTip'>
			<p slot='tipInfo'>确定删除这个商品？</p>
			<a href="javascript:void(0)" slot='leftBtn' @click='sureRemove(item)'>Yes</a>
			<a href="javascript:void(0)" slot='rightBtn' @click = 'ifRemoveTip = false'>No</a>
		</tip>
		<tip v-show = 'ifAddressTip'>
			<p slot='tipInfo'>确定删除这个地址？</p>
			<a href="javascript:void(0)" slot='leftBtn' @click='sureRemoveAddress(addressId)'>Yes</a>
			<a href="javascript:void(0)" slot='rightBtn' @click = 'ifAddressTip = false'>No</a>
		</tip>
		<tip v-show = 'ifLoginTip'>
			<p slot='tipInfo'>当前未登录</p>
			<a href="javascript:void(0)" slot='leftBtn' @click = 'ifLoginTip =false;loginClick = true'>去登录</a>
			<router-link to= '/' slot='rightBtn' @click.native = 'backToIndex'>返回</router-link>
		</tip>
		<add-address v-if='ifAddAddress' @hideAddAddress='hideAddAddress'></add-address>
		<add-item v-if = 'addItemPage'></add-item>
		<div class="header">
			<div class="logo">
				<router-link to='/'>
					好美佳超市
				</router-link>
			</div>
			<div class="login">
				<span class='userName'v-if='ifLogin' @click='toAdmin'>{{userName}}</span>
				<a href="javascript:void(0)" v-if='!ifLogin' @click = 'toggleDisplay' >登录</a>
				<a href="javascript:void(0)" v-if='ifLogin' @click = 'loginOut'>登出</a>
				<router-link to='/cart' class="iconfont cart" @click.native = 'cartButNoLogin'>&#xe6b9;<span class="buyNum" v-show='cartNum'>{{cartNum}}</span></router-link>
			</div>
		</div>
		<div class="nav">
			<router-link :to='userName=="admin"?"/admin":"/"' @click='backToGoods'>home</router-link> &gt; {{nowRouter}}
			<router-link :to='userName=="admin"?"/admin/order":"/userOrder"' @click.native = 'cartButNoLogin' class='userOrder'>我的订单</router-link>
		</div>
	</div>
</template>
<style lang = 'stylus' scoped>
a
	transition: all .3s;
	text-decoration:none
	color:rgba(0,0,0,.8);
.header
	background : white;
	padding : 25px 10%;
	overflow: hidden;
	font-size:20px;
	.logo
		float : left 
	.login
		cursor:pointer
		float : right
		.userName
			transition:all .2s;
			&:hover
				color:#d1434a
		.cart
			margin-left:20px;
			font-size:20px;
			position:relative
			.buyNum
				position:absolute
				font-size:12px;
				color:white
				display:inline-block;
				border:1px solid red;
				text-align:center
				left:18px;
				top:-2px;
				width:15px;
				height:15px;
				line-height:15px
				background:red
				border-radius:50%

.nav
	background : rgba(192,192,192,.2);
	padding: 15px 10%;
	font-size : 18px;
	.userOrder
		float:right;
		font-size:16px;
</style>
<style>
a:hover{
	color:red
}
</style>
<script>
	import axios from 'axios'
	import loginPage from './login'
	import vm from '@/bus.js'
	import tip from './tip'
	import addAddress from './addAddress'
	import addItem from './addItem'
	export default{
		name:'pageheader',
		data(){
			return {
				ifLogin:false,
				userName:'',
				num:'',
				loginClick:false,
				ifAddTip:false,
				ifRemoveTip:false,
				ifLoginTip:false,
				productId:'',
				item:'',
				addAddressTip:true,
				ifAddAddress:false,
				ifAddressTip:false,
				addressId:'',
				addItemPage:false
			}
		},
		components:{
			loginPage,tip,addAddress,addItem
		},
		computed:{
			nowRouter(){
				return this.$route.path.split('/')[1]?this.$route.path.split('/')[1]:'goods'
			},
			cartNum(){
				return this.$store.state.cartNum
			}
		},
		mounted(){
			this.receive();
			this.checkLogin();
		},
		methods:{
			toAdmin:function()
			{
				this.userName == 'admin'?this.$router.push('/admin'):this.$router.push('/')
			},
			sureRemoveAddress(val){
					vm.$emit('sureDeleteAddress',val)
			},
			closeAddItem(){
					this.addItemPage = !this.addItemPage;
			},
			hideAddAddress(){
				this.ifAddAddress=!this.ifAddAddress
			},
			backToGoods()
			{
				this.nowPage = 'goods'
			}
			,
			cartButNoLogin(){
				if(!this.ifLogin){
				this.$router.push('/');
				this.ifLoginTip = true
			}
			},
			backToIndex(){
				this.$router.push('/');
				this.ifLoginTip =false
			},
			checkLogin(){
		      axios.get('/users/checkLogin')
		      .then(res=>{
		      	  const data = res.data;
		          if(res.data.status == 1)
		          {
					this.ifLogin = true
					this.userName = data.result.userName
					this.$store.commit('setCartNums',data.result.cartNums)
					if(this.userName == 'admin')
							{
								this.$router.push('/admin')
							}
		          }
		          else{
		          	// this.ifLoginTip = true
		          	if(this.$route.path!='/')
		          	this.ifLoginTip = true
		          }
		      })
		      .catch(err=>{
		        console.log(err);
		      })
		    },
			toggleDisplay(sig){
				this.loginClick = !this.loginClick
				if(!sig)
				{
					this.$router.push('/')
				}
			},
			loginSuccess(val1,val2){
				this.ifLogin = true
				this.userName = val1
				if(val2)
				this.$store.commit ('setCartNums',val2)
			},
			loginOut(){
				axios.post('/users/loginOut')
				.then(res=>{
					const result = res.data;
					alert(result.msg)
					this.ifLogin = !this.ifLogin;
					this.userName = '';
					this.$router.push('/')
					this.$store.commit('setCartNums',0)
				})
				.catch(err=>{
					const result = res.data;
					alert(result.msg)
				})
			},
			receive(){
				vm.$on('addCartSuccess',()=>{
					this.ifAddTip = !this.ifAddTip
				})
				vm.$on('addCartButNoLogin',()=>{
					this.ifLoginTip = !this.ifLoginTip
				})
				vm.$on('removeCartItem',(val)=>{
					this.ifRemoveTip = true
					this.item = val
				})
				vm.$on('removeAddressSucc',()=>{
					this.ifAddressTip = false
				})
				vm.$on('getInfo',function(val){
					this.num = val
				})
				vm.$on('addAddress',()=>{
					this.ifAddAddress=!this.ifAddAddress
				})
				vm.$on('delAddressComfirm',(val)=>{
					this.ifAddressTip = true
					this.addressId = val
				})
				vm.$on('hideAddItem',()=>{
				this.addItemPage = !this.addItemPage;
				})
				// vm.on('goCart',()=>{
				// 	this.nowPage = 'cart'
				// })
			},
			sureRemove(val){
					console.log(666);
					vm.$emit('sureDeleteItem',val)
					this.ifRemoveTip = false
			}
		}
	}
</script>