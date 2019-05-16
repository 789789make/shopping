<template>
	<div class="address">
		<div class="addressContainer">
		<process-line
		:addressProcess = 'true'
		:orderProcess = false
		:payProcess = false
		:orderInfo = false
		>
		</process-line>
			<h2 class="title">
				地址选择
			</h2>
			<div class="addressList">
				<ul>
					<template v-for='(items,index) in addressList' :keys='items.id'>
					<li class="item" :class="{selectAddress:selectAddressIndex == index}" @click = 'setDefaultAddress(items.id,index)'>
						<p class="name">{{items.name}}</p>
						<p class="addressInfo">{{items.address}}</p>
						<p class="tel">{{items.tel}}</p>
						<p class="default" v-show = 'selectAddressIndex == index'>默认地址</p>
						<i class="iconfont delItem" @click.stop='delAddress(items.id)'>&#xe6a6;</i>
					</li>
					</template>
					<li class="item" @click = 'addAddress'>
						<i class="iconfont addIcon">&#xe64d;</i>
						<p class="addText">增加地址</p>
					</li>
				</ul>
			</div>
			<h2 class="title">
				配送方式
			</h2>
			<div class="methods">
				<ul>
					<li class="item addAddress selectAddress">
						<p class="methodsName">默认</p>
						<p class="price">2元</p>
						<span class="desc">20-30分钟送达</span>
					</li>
				</ul>
			</div>
			<router-link :to="{path:'/orderInfo'}" v-if='ifAddress' class="nextStep">下一步</router-link>
			<a href="javascript:void(0)" v-if='!ifAddress' @click='noAddressChoose' class="nextStep">下一步</a>
		</div>
	</div>
</template>

<style lang='stylus' scoped>
@import '~css/singleLine.styl'
.selectAddress
	border:3px solid #ee7a23!important
.address
	.addressContainer
		padding:20px 10%
		overflow:hidden
		.nextStep
			padding:1% 3%
			cursor:pointer
			float:right
			margin-right:2%;
			font-size:15px;
			font-weight:bolder
			border-radius:5px;
			letter-spacing:5px
			color:#d1434a
			border:2px solid #d1434a
			background:white
			transition: all .3s
			&:hover
				background:#d1434a
				color:white
		.title
			margin-top:2%
			color:rgba(0,0,0,.7)
			font-size:20px;
			font-weight:bolder
			letter-spacing:10px
			text-align:center
		.addressList,.methods
			width:100%
			ul
				overflow:hidden
				width:100%
				li
					float:left;
					padding:20px
					height:170px
					width:23%
					margin-left:1.5%
					box-sizing:border-box
					border:3px solid rgba(0,0,0,.2)
					cursor:pointer
					margin-top:10px
					position:relative
					transition: all .3s
					&:hover
						border:3px solid #ee7a23
					p
						$singleLine()
					.name,.default
						font-size:18px
						font-weight:bold
					.name
						color:grey
					.addressInfo,.tel
						font-size:15px
						color:grey
					.addressInfo
						margin-top:.1rem
					.tel
						margin-top:.3rem
					.default
						color:#ee7a23
					.delItem
						position:absolute;
						bottom:13%
						right:8%
						font-size:25px
						color : rgba(192,192,192,1)
						transition: all .3s
						&:hover
							color:#ee7a23
					.addIcon
						font-size:50px;
						color:rgba(0,0,0,.3)
						position:absolute;
						top:50%
						left:50%
						display:block
						transform:translate(-50%,-50%)
					.addText
						font-size:15px;
						letter-spacing:5px
						position:absolute
						top:80%;
						left:50%;
						transform:translate(-50%,-50%)
					.methodsName
						font-weight:0
						font-size:18px
					.price
						margin-top:2%
						font-weight:bolder
						font-size:20px
					.desc
						display:inline-block
						font-size:12px
						margin-top:6%
</style>
<script>
import vm from '@/bus.js'
import processLine from './processLine'
import axios from 'axios'
export default{
	name:'addressPage',
	data(){
		return {
			msg:'hhh',
			pageSize:3,
			nowPage:0,
			addressList:[],
			selectAddressIndex:'',
			checkAddressId:'',
		}
	},
	computed:{
		ifAddress:
		{
			get()
			{
				return this.addressList.length
			},
			set()
			{
				return this.addressList.length
			}
		}
		},
	mounted(){
		this.getAddress()
		vm.$on('addNewAddress',(val)=>{
			this.addressList.push(val)
			})
		vm.$on('sureDeleteAddress',(val)=>{
			axios.post('/users/removeAddress',{
				id:val
				})
			.then(res=>{
				if(res.data.status==1)
				this.getAddress()
				vm.$emit('removeAddressSucc')
				})
			})
		},
	methods:{
		setDefaultAddress(val,index)
		{
			var id = val
			axios.post('/users/setDefaultAddress',{
				'id':id
			})
			.then(res=>{
				if(res.data.status==1){
					this.getAddress()
				}
			})
			.catch(err=>{
				console.log(err)
				})
		},
		noAddressChoose(){
			alert("请确认选择地址")
		},
		delAddress(val){
			vm.$emit('delAddressComfirm',val)
		},
		addAddress()
		{
			vm.$emit('addAddress')
		},
		getAddress()
		{
			axios.post('/users/address')
			.then(res=>{
				if(res.data.status==1)
				{
					this.addressList = res.data.result;
					if(res.data.result.length)
					{
						res.data.result.forEach((item,index)=>{
						if(item.default)
						{
							this.selectAddressIndex = index;
							this.checkAddressId =  item.id
						}
						}
						)
					}
				}
				})
			.catch(err=>{
				alert(err)
				})
		}
	},
	components:{
		processLine
	}
}
</script>