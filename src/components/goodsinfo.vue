<template>
	<div class="goodsInfo">
		<ul >
			<li v-for = 'item in searchList' :key='item.productId'>
				<div class="info">
					<img v-lazy="item.productImage" alt="">
					<div class="desc">
						<div class="name">
							{{item.productName}}
						</div>
						<div class="buy">
							<span >{{item.salePrice|price}}</span>
							<br>
						<a href="javascript:void(0)" class="toRed" @click = addToCart(item.productId)>加入购物车</a>
						</div>
					</div>
				</div>
			</li>
		</ul>
	</div>
</template>

<script>
import axios from 'axios'

export default{
	name:'goodsinfo',
	props:['keyValue','goodsList'],
	data(){
		return {
			goods:'',
			abc:'sadsad',
			busy:false
		}
	},
	mounted:function(){
		
	},
	computed:{
		searchList:function(val){
			var self = this;
			if(this.keyValue)
			{
				return self.goodsList.filter(function(item) {
				return item.productName.indexOf(self.keyValue)!=-1?item:''
				});
			}
			else{
				return this.goodsList
			}
		},
	},
	filters:{
		price:function(val){
			return '¥'+(val%1==0?val+'.0':val)
		}
	},
	methods:{
		addToCart:function(productId){
			axios.post('/goods/addCart',{
				productId:productId
			}).then((res)=>{
				// alert(res.data.msg)
				if(res.data.status == 0){
					this.$emit('addCartButNoLogin',res.data.msg)
					this.$store.commit('addCartNum',1)
				}
				else{
					this.$emit('addCartSuccess',res.data.msg)
				}
			}).catch(err=>{
				alert(err)
			})
		}
	}
}
</script>

<style lang='stylus' scoped>
a
	color:red
.goodsInfo
	margin-top:10px;
	overflow:hidden
	ul
		overflow:hidden
		li
			float:left;
			width:20%;
			.info
				background:white
				border:3px solid rgba(192,192,192,.3)
				display:inline-block;
				width:100%;
				box-sizing:border-box;
				transition: all 0.2s;
				padding-bottom:10px;
				transition:all .5s;
				cursor:pointer
				margin-top:5px
				&:hover
					border:3px solid #d1434a
					box-shadow:0px 0px 10px
				img
					width:100%;
				.name
					margin-top:20px
					margin-left:10%
					font-weight:bold
					text-overflow:ellipsis
					overflow:hidden
					white-space:nowrap
				.buy
					margin-top:10px
					span
						margin-left:15px
						text-align:center
						color: #d1434a;
						display:inline-block;
						font-size:20px;
						font-weight:bold
						padding:20px 0;
					a
						display:inline-block
						padding:5px 0;
						text-align:center
						width:90%
						border:1px solid #d1434a
						position:relative;
						left:50%;
						transform:translate(-50%)
						color:#d1434a
					.toRed
						transition:all .3s
	
</style>
<style>

</style>