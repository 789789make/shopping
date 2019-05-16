<template>
	<div class="page">
		<div class="loginPage" >	
			<i class="iconfont exit" @click='toggleDisplay'>&#xe624;</i>
			<div class="loginContainer">
				<h2 class="pageTitle">login/register</h2>	
				<div class="list">
					<i class="iconfont iconInput">&#xe625;</i>
					<input type="text" v-model = 'userName' placeholder="登录/注册用户名">
				</div>
				<div class="list">
					<i class="iconfont iconInput">&#xe644;</i>
					<input type="password" v-model = 'userPwd' placeholder="密码">
				</div>
				<div class="btn">
					<button class="lg" @click = 'login' @keyup.enter = 'login'>
						登录
					</button>
					<button class="rg" @click = 'register'>
						注册
					</button>
				</div>
			</div>
		</div>
		<!-- <div class="regPage">
			username <input type="text" v-model='username'>
			<br>
			password <input type="text" v-modl='password' name="">
			<button>注册</button>
		</div> -->
	</div>
</template>

<style lang = 'stylus' scoped>
.page
	width:100%;
	height:100%;
	background:rgba(0,0,0,.5);
	position:fixed;
	z-index:99;
	.loginPage
		overflow:hidden
		width:29%;
		min-width:410px;
		height:270px
		position:absolute;
		top:0;
		left:0;
		right:0;
		bottom:0;
		margin:auto
		background:white
		.exit
			position:absolute;
			top:3%;
			right:2%;
			transition: all .8s
			font-weight:bolder
			cursor:pointer
			&:hover
				transform:rotate(360deg)
				color:rgba(0,157,230,.5)
		.loginContainer
			width:80%;
			position:absolute
			top:50%;
			left:50%;
			transform:translate(-50%,-40%)
			.pageTitle
				font-size:20px;
				font-weight:bolder;
				color:grey
				position:absolute
				top:-22%;
				left:0%;
			.btn
				margin-top:15px
				.lg
					float:left
				.rg
					float:right
				button
					color : white
					width:40%;
					border:none;
					height:42px;
					cursor:pointer
					background:rgba(0,157,230,1)
					font-size:16px;
					font-weight: 900;
					transition: all .3s
					&:hover
						background:rgba(0,157,230,.5)	
			.list
				position:relative
				margin-bottom :10px
				line-height:42px
				input
					height:42px;
					font-size:14px
					line-height:42px;
					display:inline-block
					box-sizing:border-box
					border:3px solid grey
					width:100%;
					padding:0 10%;
					transition: all .3s
					&:focus
						border:3px solid rgba(0,157,230,.5)
				.iconInput
					position:absolute;
					font-size:20px;
					left:10px;
</style>
<script>
	import axios from 'axios'
	export default{
		name:'loginPage',
		data(){
			return {
				userName:'',
				userPwd:'',
			}
		},
		methods:{
			toggleDisplay(){
				this.$emit('toggleDisplay')
			},
			login(){
				if(this.userName&&this.userPwd){
				axios.post('/users/login',{
					userName:this.userName+'',
					userPwd:this.userPwd+''
					}).
					then((res)=>{
						const result = res.data
						if(result.status == 0){
							alert(`${result.result}:${result.msg}`)
							this.userName=''
							this.userPwd = ''
						}
						else{
							alert(result.msg)
							if(result.result.userName == 'admin')
							{
								this.$router.push('/admin')
							}
							this.$emit('loginSuccess',result.result.userName,result.result.userCartNum)
							this.$emit('toggleDisplay',true)
						}
					})
					.catch((err)=>{
						console.log(err)
						this.userName=''
						this.userPwd = ''
						})
				}
				else{
					alert('请输入有效的信息')
				}
			},
			register(){
				if(this.userName&&this.userPwd)
				{
				axios.post('/users/register',{
						userName:this.userName+'',
						userPwd:this.userPwd+''
					}).
				then(res=>{
					const result = res.data
					if(result.status == 0){
						alert(`结果:${result.msg}`)
						this.userName = '';
						this.userPwd = ''
					}
					else{
						const result = res.data
						alert(`结果:${result.msg}`)
					}
					})
			}
			else{
				alert('请输入有效的信息')
			}
		}
		}
	}
</script>