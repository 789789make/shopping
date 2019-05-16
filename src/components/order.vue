<template>
	<div class="order">
		<process-line
		:addressProcess = true
		:orderProcess = true
		:payProcess = true
		:orderInfo = true
		>
		</process-line>
		<div class="result">
			<img src="http://imooc.51purse.com/static/ok-2.png" alt="" class="img">
			<h2 class="content">订单正在处理中，请保持联系方式畅通以便我们能及时联系到您</h2>
			<span class="orderNum">订单号:{{orderId}}</span><span class="orderCost">总价:{{totalCost|showPrice}}元</span>
		</div>
	</div>
</template>

<style lang='stylus' scoped>
.order
	padding:20px 10%
	.result
		margin-top:5%
		text-align:center
		.img
			width:10%;
		.content
			text-align:center
			font-size:20px;
			font-weight:bold;
			margin-top:50px
		.orderNum,.orderCost
			display:block
			margin-top:3%
			font-size:20px;
			font-weight:bold
			letter-spacing:2px
			color:grey
</style>

<script>
import axios from 'axios'
import processLine from './processLine'
export default{
	name:'order',
	data(){
		return{
			orderId:this.$route.query.id.split(')')[1],
			totalCost:this.$route.query.totalCost
		}
		},
	mounted:function(){
		this.deleteCart()
	},
	methods:{
		deleteCart:function(){
			axios.post('/users/cartListClear')
			.then(res=>{
				this.$store.commit('setCartNums',res.data.result.cartLength)
				})
			.catch(err=>{
				console.log(err)
				})
		}
		},
	components:{
		processLine
	},
	filters:{
		showPrice:function(val){
			return '¥'+(val%1 == 0?val+'.00':val)
	}
}
}
</script>