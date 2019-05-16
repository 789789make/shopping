<template>
	<div class="addAddress">
		<div class="container">
			<div class="content">
			<div class="item">姓名<br><input type="text" v-model='name' name="" placeholder="不能为空"></div>
			<div class="item">联系电话:<input type="text" v-model='tel' name="" placeholder="不能为空"></div>
			<div class="item">地址<br><input type="text" v-model='address' name="" placeholder="不能为空" ></div>
			<div class="item">邮政编码<input type="text" v-model='postalCode' name="" placeholder="可选"></div>
			<a href="javascript:" @click='addAddress' class="add">添加地址</a>
			<a href="javascript:" @click='back' class="back">返回</a>
			</div>
		</div>
	</div>
</template>

<style lang='stylus' scoped>
.addAddress
	background:rgba(0,0,0,.5)
	position:fixed
	width:100%
	height:100%
	z-index:999
	.container
		color:grey
		min-width:300px
		width:24%;
		height:44%
		min-height:420px
		background:white;
		position:absolute;
		top:30%
		left:38%
		box-sizing:border-box;
		.content
			position:absolute
			top:50%
			left:50%
			transform:translate(-50%,-50%)
			font-size:18px
			font-weight:bold
			.item
				input
					padding:0 20px;
					width:100%;
					height:40px;
					box-sizing:border-box;
					border:2px solid grey
					transition:all .2s
					&:focus
						border:2px solid #ee7a23
			.add,.back
				margin-top:5%
				padding:5px 0px;
				display:block;
				box-sizing:border-box;
				width:100%
				background:white;
				border:2px solid #d1434a
				color :#d1434a
				text-align:center
				transition: all .3s
				&:hover
					background:#d1434a
					color:white
</style>

<script>
import vm from '@/bus.js'
import axios from 'axios'
export default{
	name:'addAddress',
	data(){
		return{
			name:'',
			address:'',
			tel:'',
			postalCode:''
		}
	},
	methods:{
		addAddress(){
			if(this.name&&this.address&&this.tel){
				var addDate = new Date()
				axios.post('/users/addAddress',{
					name:this.name,
					address:this.address,
					tel:this.tel,
					postalCode:this.postalCode,
					id:this.name+addDate
					})
				.then(res=>{
					vm.$emit('addAddress')
					vm.$emit('addNewAddress',
					{
					name:this.name,
					address:this.address,
					tel:this.tel,
					postalCode:this.postalCode,
					id:this.name+addDate
					})
					})
				.catch(err=>{
					console.log(err)
					})
			}
			else{
				alert('名字/电话/地址不能为空')
			}
		},
		back(){
			this.$emit('hideAddAddress')
		}
	}
}
</script>