<template>
	<div class="goodlist">
		<div class="container">
			<div class="sort">
				<div class="sortBy">
					<input type="text" class="search" v-model='key' placeholder="输入想搜索的关键词">
					Sort by : <a 
							href="javascript:"
							@click.prevent = 'clickDefaultSort' 
							:class="{active:sortWay=='default'}"
							>
							default &nbsp;
							</a> 
						<a 
						href="javascript:" 
						@click.prevent = 'clickSort'
						:class="{active:sortWay!='default'}"
						>
						price
						<span class="iconfont sortIcon" :class={downSort:!ifUpSort}>&#xe65b;</span>
						</a>
				</div>
			</div>
			<div class="info">
					<goods-info 
					:keyValue='key'
					:goodsList='data'
					v-on:addCartButNoLogin = 'addCartButNoLogin'
					@addCartSuccess = 'addCartSuccess'
					>
					</goods-info>
			</div>
			<!-- <img src="@/../static/loading/loading-spinning-bubbles.svg" alt=""> -->
			
			<!-- <div v-if = 'ifMobileLoadShow' @click = 'loadMore' class="loadMore" v-text ='msg'>
				
			</div> -->
			<div v-if = 'ifMobileLoadShow' @click = 'loadMore' class="loadMore isLoading" v-text ='msg'>
				
			</div>
			<div class="loadMore" v-show = '!ifLoading' >
				同学你已经翻到底了哦~
			</div>
		</div>
	</div>
</template>

<style lang = 'stylus' scoped>
.active
	color : red
.goodlist
	padding:0 17%;
	.container
		padding:5% 0 0 0
		.loadMore
			padding:30px 0 10px 0; 
			text-align:center;
			color:grey;
			font-weight:bold
		.isLoading
			cursor:pointer
			transition:all .3s
			&:hover
				color:black
		.sort
			.sortBy
				font-size : 18px;
				padding-right: 5%
				line-height:50px
				text-align:right
				background:white
				.sortIcon
					transition: all .3s
					display:inline-block
				.downSort
					transform: rotate(180deg)
				.search
					margin-right:1%;
					border: 2px solid rgba(192,192,192,.3)
					padding:5px 5px 5px 20px
					&:focus
						border: 2px solid rgba(209,67,74,.7)
</style>

<script>
	import goodsInfo from './goodsinfo'
	import vm from '@/bus.js'
	import axios from 'axios'
	export default
	{
		name:'goodlist',
		data(){
			return{
				sortWay:'default',
				key:'',
				data:[],
				page:1,
				pageSize:10,
				sort:0,
				busy:true,
				ifLoading:true,
				ifAddTip:true,
				ifReomveTip:false,
				ifLoginTip:false,
				webFunc:'',
				msg:''
			}
		},
		computed:
		{
			ifUpSort:function()
			{
				return this.sortWay=='up'
			},
			ifDownSort:function()
			{
				return this.sortWay=='down'
			},
			// ifPcLoadShow(){
			// 	return this.webFunc=='pc'&&this.ifLoading
			// },
			ifMobileLoadShow(){
				return this.ifLoading
			}
		},
		methods:
		{
			clickSort:function()
			{	
				this.msg = '点击加载更多'
				this.sortWay=='default'?this.sortWay='up':this.sortWay=='up'?this.sortWay='down':this.sortWay='up'
				this.sortWay=='up'?this.sort=1:this.sort=-1
				this.page = 1
				this.getGoodsInfo()
			},
			clickDefaultSort:function()
			{
				this.msg = '点击加载更多'
				this.sortWay='default'
				this.sort=0
				this.page = 1
				this.getGoodsInfo()
			},
			getGoodsInfo:function(flag)
			{
				this.ifLoading = true
			// var param = 
			// {
			// 	page:this.page,
			// 	pageSize:this.pageSize,
			// 	sort:this.sort
			// }
			axios.get(`/goods/list?page=${this.page}&pageSize=${this.pageSize}&sort=${this.sort}`).then(res=>{
				if(res.data.status=='1')
				{
					if(flag)
					{
						if(res.data.count==0||res.data.count!=this.pageSize){
							// this.busy = true
							this.ifLoading=false
						}
						else
						{
							// if(this.webFunc=='pc'){
							// 	this.busy = false
							// }
							// else{
							// 	this.busy = true
							// }
							this.ifLoading = true
							
						}
						this.data = this.data.concat(res.data.content)
					}
					else
					{
						this.data = res.data.content
						this.busy = false
					}
				}
				else
				{
					this.data = []
				}	
			}).catch(error=>{
				console.log(`获取失败${error}`)
			})
			},
			loadMore:function(){
				// alert(666)
			// if(this.webFunc == 'pc'){
			// 	this.busy = false
			// }
			// else{
			// 	this.msg='正在获取中....'
			// }
			this.msg='正在获取中....'
			setTimeout(()=>{
			this.page++;
			this.getGoodsInfo(true)
			},500)
			},
			addCartSuccess(val){
				vm.$emit('addCartSuccess',val)
				this.$store.commit('addCartNums',1)
			},
			addCartButNoLogin(val){
				vm.$emit('addCartButNoLogin',val)
			}		
		},
		components:{
			goodsInfo
		},
		mounted:function(){
			// this.webFunc = /Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent) ? 'mobile':'pc'
			// this.busy = this.webFunc=='pc'?true:false
			this.msg = !this.busy?'':'点击加载更多'
			this.getGoodsInfo()
			// alert(this.webFunc)
		 }
	}
</script>