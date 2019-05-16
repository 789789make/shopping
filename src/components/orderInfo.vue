<template>
	<div class="orderInfo">
		<process-line
		:addressProcess = true
		:orderProcess = true
		:payProcess = false
		:orderInfo = false
		>
		</process-line>
		<div class="title">
			确认信息
		</div>
		<div class="itemInfo">
			<span class="itemDesc">
				商品描述
			</span>
			<span class="itemPrice">
				单价
			</span>
			<span class="itemNum">
				数量
			</span>
			<span class="itemTotal">
				总价
			</span>
		</div>
		<div class="itemsList">
			<div class="item" v-for = 'items in orderList.arr'>
				<img class="itemImg" :src="items.productImage" alt="">
				<span class="itemName">{{items.productName}}</span>
				<span class="itemSinglePrice">{{items.salePrice|showPrice}}</span>
				<span class="itemOrderNum">{{items.productNum}}</span>
				<span class="itemTotalPrice">{{totalPrice(items.salePrice,items.productNum)|showPrice}}</span>
			</div>
		</div>
		<div class="summary">
			<div class="summaryItem">
				<span class="left">商品总价:</span><span class="right">{{orderList.cost|showPrice}}</span>
			</div>
			<div class="summaryItem">
				<span class="left">运送方式:</span><span class="right">送货上门</span>
			</div>
			<div class="summaryItem">
				<span class="left">运送费:</span><span class="right">{{sendCost}}元</span>
			</div>
			<div style="clear:both"></div>
			<div class="summaryItem">
				<span class="left">优惠:</span><span class="right">{{freeCost}}元</span>
			</div>
			<div class="summaryItem">
				<span class="left">支付总价:</span><span class="right">{{orderList.totalCost|showPrice}}</span>
			</div>
		</div>
		<div style="clear:both"></div>
		<router-link to="/cart" class="back">返回购物车</router-link>
		<a href="javascript:" class="next" @click='payMent'>确认无误,下一步</a>
	</div>
</template>
<style lang='stylus' scoped>
@import '~css/singleLine.styl'
span
	@singleLine()
.orderInfo
	overflow:hidden
	min-width:650px
	padding:20px 10%
	.back,.next
		display:inline-block
		text-align:center
		border: 2px solid #d1434a
		color:#d1434a
		background:white
		transition: all .3s
		&:hover
			background:#d1434a
			color:white
	.back
		margin-top:30px
		width:15%
		padding:10px 0px
	.next
		margin-top:20px
		float:right
		width:20%;
		padding:15px 0px;
	.summary
		float:right
		margin-top:10px
		margin-right:2%
		font-size:15px;
		letter-spacing:3px;
		.summaryItem
			span
				font-size:20px;
				letter-spacing:5px
			.left
				float:left
				margin-right:20px
			.right
				float:right
	.title
		font-size:25px;
		letter-spacing:5px;
		font-weight:bold;
		color:grey
		margin-top:20px;
	.itemInfo
		padding:15px 0 ;
		background:rgba(192,192,192,.7)
		font-size:20px;
		font-weight:bold;
		letter-spacing:5px
		span
			display:inline-block
			text-align:center
		.itemDesc
			width:50%
		.itemPrice
			width:20%
		.itemNum
			width:10%
		.itemTotal
			width:15%
	.itemsList
		width:100%;
		padding:0px 0 15px 0;
		box-sizing:border-box;
		margin-top:-5px
		.item
			padding:0 0 0 2%
			margin-top:5px
			background:white
			span
				display:inline-block
				text-align:center
				font-weight:bold
				font-size:18px
			.itemImg
				width:10%
			.itemName
				width:38%
			.itemSinglePrice
				width:22%
			.itemOrderNum
				width:11%
			.itemTotalPrice
				width:15%
</style>
<script>
import axios from 'axios'
import processLine from './processLine'
export default{
	name:'orderInfo',
	data(){
		return{
			data:'',
			sendCost:2,
			freeCost:0,
			orderId:''
		}
	},
	components:{
		processLine
	},
	filters:{
		showPrice:function(val){
			return '¥'+(val%1 == 0?val+'.0':val)
		}
	},
	computed:{
		totalPrice:function(item,nums){
		return function(item,nums){
		return item*nums
		}
	},
		orderList:function(){
			var obj={}
			obj.arr=[]
			obj.cost=0
			obj.totalCost = 0
			Array.prototype.slice.call(this.data).forEach(item=>{
				if(item.check)
				{
				obj.arr.push(item)
				obj.cost+=item.salePrice*item.productNum
				}
				})
			obj.totalCost = this.sendCost + obj.cost - this.freeCost
			return obj
		}
	},
	methods:{
		getOrderInfo:function(){
			axios.get('/users/cartList')
			.then(res=>{
				this.data = res.data.result
				})
		},
		payMent(){
			axios.post('/users/payMent',{
				freeCost:this.freeCost,
				sendCost:this.sendCost,
				})
			.then(res=>{
					var result = res.data;
					this.$router.push({path:'/pay',query:{
						id:result.result.id,
						totalCost:result.result.totalCost
						}
						})
				})
		}
	},
	mounted:function(){
		this.getOrderInfo()
	}
}
</script>

