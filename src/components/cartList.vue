<template>
	<div>
	<div class="cartItemInfo" v-for = 'item in cartData'>
		<span class=" select" :class='{selected:item.check}' @click = 'handleAddToOrder(item.productId,item.check,item)'><i class="iconfont" v-if='item.check'>&#xe637;</i></span>
		<img :src="item.productImage" alt="" class="itemImg" />
		<span class="desc">{{item.productName}}</span>
		<span class="price">{{itemPrice(item.salePrice)}}</span>
		<span class="num"><a href="javascript:" class="addOne" @click='changeOne(item.productId,item,"+")'>+</a><input class="buyNum" v-model = 'item.productNum' disabled="true"><a href="" class="minOne" href="javascript:" @click='changeOne(item.productId,item,"-")'>-</a></span>
		<span class="total">{{itemPrice(item.salePrice*item.productNum)}}</span>
		<a href="javascript:" class="del iconfont" @click = 'removeCartItem(item)' >&#xe6a6;</a>
	</div>
	</div>
</template>

<script>
import vm from '@/bus.js'
import axios from 'axios'
export default{
	name:'cartList',
	props:['cartData'],
	data(){
		return{
			num:1,
			ifSelected:false,
			totalPrice:999,
			addTime:0,
		}
	},
	computed:{
		itemNum:function(){
			return this.num>=0?this.num:0
		},
		itemPrice:function(){
			return function(val)
			{
			return '¥'+(val%1==0?val+'.0':val)
			}
		}
	},
	methods:{
		handleAddToOrder(productId,checked,item){
			axios.post('/goods/changeCheck',{
				productId:productId,check:!checked
			}).then(res=>{
				if(res.data.status == 1){
					item.check = !checked
				}
			}).catch(err=>{
				console.log(err);
			})
		},
		removeCartItem(val){
			vm.$emit('removeCartItem',val)
		},
		changeOne(val,item,way){
			if(way == '+')
			{
				axios.post('/goods/addCart',{
				productId:val,way:'+'
			}).then(res=>{
				if(res.data.status == '1'){
					item.productNum++
					this.$store.commit('addCartNums',1)
				}
			})
			}
			else
			{
				if(item.productNum == 0){
					alert('单个购物车商品最小值为0')
					return 
				}
				axios.post('/goods/addCart',{
				productId:val,way:'-'
			}).then(res=>{
				if(res.data.status == '1'){
					item.productNum = (item.productNum>0?--item.productNum:0)
					this.$store.commit('addCartNums',-1)
				}
			})
			}
			
		}
	},
	mounted(){
	
	}
}
</script>

<style lang='stylus' scoped>
@import '~css/singleLine.styl'
.cartItemInfo
	padding:20px 10px;
	border-bottom:1px solid rgba(192,192,192,.5)
	background:white
	position:relative
	.select
		box-sizing:border-box
		width:20px
		height:20px
		border:1px solid black;
		border-radius:20px;
		margin-right:5px
		cursor:pointer
		color:black;
		line-height:18px;
		text-align:center
		transition: all .2s
		i
			font-size:10px;
	.selected
		background:#ee7a23
		color:white
		border:none
	.itemImg
		width:8%
		padding:1%
		margin-right:1%
		border:1px solid rgba(0,0,0,.2)
	span
		display:inline-block;
		text-align:center
		$singleLine()
		font-size:15px;
	.desc
		width:24%
		font-weight:bold
	.price
		width:15%
	.num
		width:17.5%
		.addOne,.minOne
			color:black;
			display:inline-block
			padding:2px 10px;
			background:rgba(192,192,192,.4)
			font-size:12px;
		.buyNum
			width:20%
			text-align:center
			border: 1px solid rgba(192,192,192,.4)
			margin:0px 5px
			font-size:15px
	.total
		margin-left:3.5%
		width:11%
	.del
		position:absolute
		width:10%
		right:1%
		top:45%
		transform:translate(0,-50%)
		font-weight:bolder
		font-size:25px
		text-align:center
		color:grey
		transition:all .3s
		&:hover
			color:red
</style>