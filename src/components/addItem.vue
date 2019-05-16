<template>
	<div class="main">
		<div class="container">
			<span class="exit" @click = 'close'>X</span>
			<form action="/goods/addItem" method="post" enctype="multipart/form-data" onsubmit="showRes(msg)">
				<input type="text" name='name' class="info" v-model = 'itemName' key='name'>
				<br>
				名称
				<br>
				<input type="text" name="price"class="info" v-model = 'itemPrice' key=''>
				<br>
				价格
				<br>
				<input type="file" class="file" ref='inputImage' @change='showImage(this)' accept="image/*" name="image">
				<img :src="imgUrl" alt="" id='showImage' :class = '{showImg:ifShowImg}'>
				<br>
				<div class="imgName">
					{{name||'未添加图片'}}
				</div>
				<br>
				<input type="submit" class="subBtn" value="上传" >
			</form>
		</div>
	</div>
</template>
<script>
import axios from 'axios'
import vm from '@/bus.js'	
export default{
	name:'addItem',
	data()
	{
		return {
			msg:'addItemPage',
			imgUrl:'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1555508895136&di=a5741a4b86f42ce9f25f77d3337e1425&imgtype=0&src=http%3A%2F%2Fimage.tupian114.com%2F20140416%2F15015114.png',
			ifShowImg:false,
			name:'',
			itemPrice:'',
			itemName:'',
		}
	},
	methods:
	{
		showRes:function(msg)
		{
			console.log(msg);
			return false;
		},
		showImage:function(obj)
		{
			var reader = new FileReader();
			var file = this.$refs.inputImage.files[0];  
			var self = this;  
			if(file)
			{
			  	reader.readAsDataURL(file);        
	            reader.onload = function(e){
	            const newUrl = this.result;
	            self.imgUrl = newUrl;
	            self.ifShowImg = true;
	            self.name = file.name
			  	}
			}
			else
			{
				self.imgUrl = 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1555508895136&di=a5741a4b86f42ce9f25f77d3337e1425&imgtype=0&src=http%3A%2F%2Fimage.tupian114.com%2F20140416%2F15015114.png';
				self.ifShowImg = false;
				self.name = '';
			}  
		},
		close()
		{
			vm.$emit('hideAddItem')
		},
		addItem()
		{
			// var formdata =new FormData();
			// var file = this.$refs.inputImage.files[0];  
			// formdata.append('file',file,file.name);
			// formdata.append('itemName',this.itemName);
			// formdata.append('itemName',this.itemPrice);
			// console.log(formdata);
			// let config = 
			// {
			// 	headers:{
			// 		'Content-Type':'multipart/form-data'
			// 	}
			// }
			// axios.post('/goods/addItem',{
			// 	formdata,
			// },config)
			// .then(res=>{
			// 	console.log(res)
			// })
		}
	}
}
</script>
<style lang='stylus' scoped>
.main
	min-width:650px;
	position:fixed;
	width:100%;
	height:100%;
	z-index:999;
	background:rgba(192,192,192,.3)
	.container
		position:absolute;
		text-align:center;
		left:50%;
		top:50%;
		transform:translate(-50%,-50%);
		background:white;
		box-sizing:border-box;
		padding:3% 0% 2% 0%;
		width:40%;
		.exit
			position:absolute;
			top:0%;
			right:0;
			width:8%;
			padding:1% 0;
			text-align:center;
			color:#d1434a;
			cursor:pointer;
			border:2px solid #d1434a;
			transition:all .3s
			&:hover
				color:white;
				background:#d1434a;
		.info
			border:1px solid black;
			margin:10px 5px;
			padding:5px 5%;
		.file
			width:40%;
			height:210px;
			border :1px solid black;
			z-index:9999;
			text-align:center;
			position:absolute;
			left:29.5%;
			opacity:0;
			top:35%;
		.imgName
			font-size:15px;
			margin-top:10px;
			font-weight:bolder;
		img
			width:40%;
			opacity:.4
			max-height:250px;
			border:2px solid black;
		.showImg
			opacity:1;
			border:none;
		.subBtn
			padding:10px 50px;
			border:3px solid #d1434a;
			background:white;
			color:#d1434a;
			cursor:pointer;
			font-size:15px;
			font-weight:bold;
			transition:all .3s;
			&:hover
				background:#d1434a;
				color:white;
</style>