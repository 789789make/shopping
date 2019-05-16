<template>
	<div class="payPage">
		<process-line
		:addressProcess = true
		:orderProcess = true
		:payProcess = false
		:orderInfo =true
		>
		</process-line>
		<h2 class="tips">
			支付完成前请勿离开页面....
		</h2>
		<h2 class="tips" v-if = 'paySuccess'>
			支付成功，马上跳转....
		</h2>
	</div>
</template>

<style lang='stylus' scoped>
.payPage
	padding:20px 17%
	.tips
		margin-top:50px
		text-align:center;
		font-size:20px;
		font-weight:bold
</style>

<script>
import processLine from './processLine'
export default{
	name:'payPage',
	data(){
		return{
			paySuccess:false,
		}
		},
	components:{
		processLine
	},
	mounted(){
			return new Promise((resolve,reject)=>{
			setTimeout(()=>{
			this.paySuccess = true;
			resolve()
		},5000)})
			.then(()=>{
				setTimeout(()=>{
					this.$router.push({path:'/order',query:{
					id:this.$route.query.id,
					totalCost:this.$route.query.totalCost
				}})
				},3000)
				})
	}
}
</script>