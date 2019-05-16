<template>
	<div class="main">
		<div class="goodsList">
			<a href="javascript:void(0)" class="addItem" @click.prevent = 'addItems'>
				<div class="addIcon">
					+ 
				</div>
			</a>
		</div>
		<div class="goodsList" v-for = 'item in arr' :key='item.productId' :title="item.productName">
			<img class="goodsImg" :src="item.productImage" >
			<br>
			<div class="name">
				{{item.productName}}
			</div>
			<div class="price">
				{{item.salePrice}}
			</div>
			<a class="deleteBtn" href="javascript:void(0)" @click.prevent = 'deleteItem(item.productId)'>删除</a>
		</div>
	</div>
</template>

<script>
import axios from 'axios'
import vm from '@/bus.js'
export default{
	name:'goodsListPage',
	data(){
		return {
			name:'aaa',
			price:100,
			arr:[]
		}
	},
	methods:
	{
		addItems:function(){
			vm.$emit('hideAddItem')
		},
		deleteItem:function(val){
			axios.post('/goods/removeGoods',{
				productId:val
			}).
			then(res=>{
				const data = res.data;
				if(data.status)
				{
					alert(data.msg);
					this.renderData();
				}
				else
				{
					alert(`error:${data.msg}`)
				}
			})
		},
		renderData:function()
		{
			axios.post('/goods/adminList',{
			})
				.then(res=>{
			const data = res.data;
			if(!data.status)
			{
				alert('error')
			}
			else
			{
				this.arr = data.msg;
			}
		})
		}
	},
	mounted:function(){
		this.renderData()
	},
}
</script>

<style lang='stylus' scoped>
.main
	overflow:hidden;
	padding:0 10%;
	@media screen and (max-width: 700px)
		padding:0%;
	.goodsList
		float:left;
		width:13%;
		margin:10px 0px 0% 3.5%;
		cursor:pointer;
		border:2px solid transparent;
		background:white;
		box-sizing:border-box;
		transition:all .2s;
		&:nth-child(6n-4)
			margin-left:2%;
		&:first-child
		.addIcon
			text-align:center;
			margin-left:2%;
			width:95.6%;
			font-size:50px;
		.name, .price
			text-align:center;
			font-weight:bold;
			font-size:18px;
			overflow:hidden;
			text-overflow:ellipsis
			white-space:nowrap;
		.price
			font-size:20px
		.goodsImg
			width:100%
			height:140px;
		.deleteBtn
			display:block;
			width:100%;
			margin:10px -2px -3px ;
			text-align:center
			line-height:30px;
			border:2px solid #d1434a;
			color:#d1434a
			transition:all .3s
			&:hover
				background:#d1434a
				color:white
		&:hover
			border:2px solid #d1434a;
</style>