<template>
	<div class="tipBg">
		<div class="tipContainer">
			<p class="tipInfo">
				<slot name = 'tipInfo'></slot>
			</p>
			<div class="button">
				<slot name='leftBtn'></slot>
				<slot name = 'rightBtn'></slot>
			</div>
		</div>
	</div>
</template>

<style lang='stylus' scoped>
.tipBg
	width:100%;
	height:100%;
	min-width:700px;
	min-height:200px;
	position:fixed
	background:rgba(0,0,0,.5);
	z-index: 99;
	.tipContainer
		width:500px;
		height:250px;
		background:white
		position:relative
		left:50%
		top:53%
		margin:-150px 0 0 -250px
		.tipInfo
			font-size:13px
			color:grey
			position:absolute
			left:50%;
			top:33%
			transform:translate(-50%,-50%)
		.button
			display:flex
			position:absolute
			left:50%;
			top:70%
			transform:translate(-50%,-50%)
			a
				display:inline-block
				margin:0 20px;
				flex:0.5
				font-size:13px
				width:150px;
				height:40px
				line-height:40px;
				text-align:center
				top:75%!important
				cursor:pointer
				transition: all .2s
				border: none
				font-size:15px;
				border-radius:10px;
				font-weight:bolder
				letter-spacing: 5px
				overflow:hidden;
				text-overflow:ellipsis
				white-space:nowrap
				background:white;
				color:#d1434a
				border:2px solid #d1434a
				&:hover
					color:white
					background:#d1434a

</style>

<script>
export default{
	name:'tips',

}
</script>