<template>
	<div class="main">
		<div v-for = 'item in orderList' :key=item.id class="orders">
			<div class="orderList">
			订单号：{{item.id.split(')')[1]}}
			<br>
			<a href="javascript:" class="showGoods" @click = 'showGoods(item.id)'>详情</a>
			<a href="javascript:" class="showGoods" v-if='item.status == 0?true:false' @click = 'reviceGoods(item)'>收货</a>
			总价：{{item.totalCost>0?item.totalCost:0}}元
			<br>
			地址：{{item.address['address']}}
			<br>
			当前状态  : {{item.status==0?'处理中':'已经送达'}}
			</div>
			<template v-if = 'ifShow == item.id'>
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
				<div class="item" v-for = 'items in item.goodsList'>
					<img class="itemImg" :src="items.productImage" alt="">
					<span class="itemName">{{items.productName}}</span>
					<span class="itemSinglePrice">{{items.salePrice|showPrice}}</span>
					<span class="itemOrderNum">{{items.productNum}}</span>
					<span class="itemTotalPrice">{{totalPrice(items.salePrice,items.productNum)|showPrice}}</span>
				</div>
			</div>
			<div class="summary">
				<div class="summaryItem">
					<span class="left">商品总价:</span><span class="right">{{goodsCost(item.sendCost,item.freeCost,item.totalCost)}}元</span>
				</div>
				<div class="summaryItem">
					<span class="left">运送方式:</span><span class="right">送货上门</span>
				</div>
				<div class="summaryItem">
					<span class="left">运送费:</span><span class="right">{{item.sendCost||0}}元</span>
				</div>
				<div style="clear:both"></div>
				<div class="summaryItem">
					<span class="left">优惠:</span><span class="right">{{item.freeCost}}元</span>
				</div>
				<div class="summaryItem">
					<span class="left">支付总价:</span><span class="right">{{item.totalCost>0?item.totalCost:0|showPrice}}</span>
				</div>
			</div>
			</template>
		</div>
	</div>
</template>

<script>
import axios from 'axios'
export default{
	name:'orderList',
	data(){
		return{
			orderList:[],
			ifShow:true
		}
	},
	methods:
	{
		reviceGoods:function(value)
		{
			axios.post('/orders/sureOrder',{
				userId:value.userId,
				orderId:value.id
			})
			.then(res=>{
				alert(res.data.msg)
				this.getOrdersInfo()
			})
		},
		getOrdersInfo:function()
		{
			axios.post('/orders/ordersList')
			.then(res=>{
				this.orderList = res.data.content
			})
		},
		showGoods:function(a)
		{
			this.ifShow == a?this.ifShow=!this.ifShow:this.ifShow=a
		}
	},
	mounted:function()
	{
		this.getOrdersInfo()
	},
	filters:
	{
		showPrice:function(val){
			return '¥'+(val%1 == 0?val+'.0':val)
			}
	},
	computed:
	{
		totalPrice:function(item,nums)
		{
			return function(item,nums)
			{
				return item*nums
			}
		},
		orderInfo:function()
		{
			return ''
		},
		goodsCost:function(a,b,c)
		{
			return function(a,b,c)
			{
				return a||0+b+c
			}
		}
	},
}
</script>

<style lang='stylus' scoped>
.main
	padding:0 17%;
	min-width:650px;
	@media screen and (max-width: 700px)
		padding:0% 0%;
	.orders
		overflow:hidden;
		background:rgba(192,192,192,.2);
		margin:20px 0px;
		.orderList
			margin-top:20px;
			padding:10px 8% ;
			font-size:18px;
			line-height:30px;
			.showGoods
				float:right
				margin-top:-8px;
				margin-left:20px;
				color:#d1434a
				background:white;
				border:1px solid #d1434a;
				padding:10px 40px;
				transition:all .3s
				&:hover
					color:white;
					background:#d1434a;
		.summary
			float:right
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