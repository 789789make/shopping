<template>
	<div class="processLine">
		<ul class="processBlock">
			<li :class="{process:addressProcess}">送货地点</li>
			<li :class="{process:orderProcess}">确认订单</li>
			<li :class="{process:orderInfo}">付款</li>
			<li :class="{process:payProcess}">订单信息</li>
		</ul>
	</div>
</template>

<script>
export default{
	name:'processLine',
	props:['addressProcess','orderProcess','payProcess','orderInfo']
}
</script>

<style lang = 'stylus' scoped>
.processLine
	
	.processBlock
		width:100%
		overflow:hidden
		li
			float:left
			width:25%
			box-sizing:border-box
			text-align:center
			color:grey
			padding:0 0 20px 0
			border-bottom:2px solid grey
			position:relative
			font-size:15px;
			font-weight:bolder;
			letter-spacing:3px
			&:after
				width:15px;
				height:15px;
				background:grey;
				display:inline-block;
				border-radius:15px
				content:''
				position:absolute;
				bottom:0px;
				left:50%;
				transform:translate(-50%,50%)
		.process
			border-bottom:2px solid #d1434a
			color:#d1434a
			&:after
				background:#d1434a

</style>