<template>
	<div class="cartBg" >
		<h1 class="cartTitle">
			MY CART
		</h1>
		<div class="cartContainer">
			<div class="cartLine">
				<span class="items">商品</span>
				<span class="price">价格</span>
				<span class="num">数量</span>
				<span class="total">总价</span>
				<span class="del">删除</span>
			</div>
			<div class="cartList">
				<cart-list
				:cartData = 'cartInfo'
				>	
				</cart-list>
				<div class="selectMany">
					<span class=" selectAll " :class='{allSelected:selectAllFlag}'  @click = 'selectAll()'><i class="iconfont" v-show='selectAllFlag'>&#xe637;</i></span>
					<span class="s-l">Select All</span>
					<div class="paySale">
					<span class="totalPay">合计:{{total |totalPay}}</span>
					<router-link to="/address" @click.native='toAddress' class="pay" v-show='ifHasCheck'>确认下单</router-link>
					<a href="javacript:" class="pay noCheck" v-show='!ifHasCheck'>确认下单</a>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import cartList from './cartList'
import axios from 'axios'
import vm from '@/bus.js'
export default{
	name:'cart',
	data(){
		return {
			cartInfo:'',
			productId:'',
			nothingCheck:true
		}
	},
	mounted(){
		vm.$off('sureDeleteItem')
		this.getCartInfo();
		this.recive()
	},
	computed:{
		total(){
			var res = 0;
			var that = this.cartInfo
			if(this.cartInfo[0]){
				Array.prototype.slice.call(this.cartInfo).forEach(item=>{
				if(item.check){
					res+=item.salePrice*item.productNum
				}
				})
			return res
			}
			else{
				return 0
			}
		},
		selectAllFlag(){
			var res = true
			if(this.cartInfo[0]){
				Array.prototype.slice.call(this.cartInfo).forEach(item=>{
				if(!item.check){
					res = false
				}
			})
			if(res){
				return true
			}
			else{
				return false
			}
			}
			else{
				return false
			}	
		},
		ifHasCheck(){
			var i = 0;
			if(this.cartInfo[0]){
				Array.prototype.slice.call(this.cartInfo).forEach(item=>{
				if(item.check)
				{
					i++
				}
				})
			}
			if(i)
				return true
			else
				return false
		}
	},
	methods:{
		recive(){
			vm.$on('sureDeleteItem',(val)=>{
			axios.post('/goods/removeCart',{
						productId:val.productId
					}).then(res=>{
						this.$store.commit('addCartNums',-val.productNum)
						this.getCartInfo();
					}).catch(err=>{
						this.ifRemoveTip = false
					})
		})
		},
		getCartInfo(){
			axios.get('/users/cartList').then(res=>{
				const result = res.data
				if(result.result){
					this.cartInfo = result.result
				}
				vm.$emit('getInfo',this.cartInfo.length)
			}).catch(err=>{
				
			})
		},
		toAddress(){

		},
		selectAll(val){
			var result=this.selectAllFlag
			axios.post('/goods/changeCheck',{
				check:!result
			})
			.then(res=>{
				// if(res.data.status == 1)
				// {
				// 	this.getCartInfo()
				// }
				if(this.cartInfo){
					Array.prototype.slice.call(this.cartInfo).forEach((item)=>{
						item.check = !result
					})
				}	
			})
			.catch(err=>{
				alert(err)
			})
		}
	},
	filters:{
		totalPay:function(val){
			return '¥'+(val%1==0?val+'.0':val)
		}
	},
	components:{
		cartList
	}
}
</script>

<style lang = 'stylus' scoped>
@import '~css/singleLine.styl'
.cartBg
	padding: 0 10%;
	min-width:650px;
	overflow:hidden
	.cartTitle
		line-height:100px;
		font-size:23px;
		font-weight:bolder;
		letter-spacing:8px
	.cartContainer
		position:relative
		.cartLine
			padding:20px;
			background:grey;
			color:white
			font-size:12px;
			span
				letter-spacing:3px;
				text-align:center
				display:inline-block
				$singleLine()
			.items
				padding:0 0 0 22px
				width:37%
			.price
				width:13%
			.num
				margin-left:2%
				width:16%
			.total
				margin-left:8%
			.del
				position:absolute
				width:10%;
				right:1%
		.cartList
			.selectMany
				margin-top:20px
				padding:20px 0px 20px 10px
				.selectAll
					border:1px solid black;
					border-radius:30px;
					margin-right:20px
					cursor:pointer
					color:black;
					line-height:20px
					display:inline-block;
					width:20px;
					height:20px;
					box-sizing:border-box
					text-align:center
					transition: all .2s
					i
						font-size:10px;
				.allSelected
					background:#ee7a23
					color:white
					border:1px solid #ee7a23
				.s-l
					font-size:18px
					letter-spacing:3px
					font-weight:bold
					color:rgba(0,0,0,.5)
				.paySale
					float:right;
					.totalPay
						margin-right:50px
						font-size:18px
						letter-spacing:3px
					.pay
						display:inline-block
						margin-top:-21px
						margin-right:-1px
						padding:12px 25px 12px 40px
						text-align:center
						background:#d1434a
						transition:all .2s
						color:white
						letter-spacing:10px;
						font-size:18px
						&:hover
							background:rgba(209,67,74,.7)
					.noCheck
						background:rgba(209,67,74,.7)

				
</style>