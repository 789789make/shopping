const express = require('express');
var router = express.Router();

var goods = require('./../models/goods');
var user = require('./../models/user');
const fs = require('fs');
var option = {  
        auto_reconnect: true,
        poolSize: 10,
        useNewUrlParser:true
};
var formidable = require("formidable");
var path = require('path');

var mongoose = require('mongoose');

//连接数据库
mongoose.connect('mongodb://storeadmin:haomeijia@127.0.0.1:27017/store',option)

mongoose.connection.on('connection',function(){
	console.log('success')
})

mongoose.connection.on('error',function(msg){
	console.log(msg);
})

mongoose.connection.on('disconnection',function(){
	console.log('disconnection');
})
//商品列表显示
router.get('/list',function(req,res,next){
	let page = req.query['page'];
	let pageSize = parseInt(req.query['pageSize']);
	let skipNum = (page-1)*pageSize;
	let sort = req.query['sort'];
	let param = {};
	let goodsModel=goods.find(param).skip(skipNum).limit(pageSize)
	if(sort!=0){
			goodsModel.sort({'salePrice':sort})
	}
	goodsModel.exec({},(err,data)=>{
		if(err){
			res.json({
				msg:err.message,
				status:0
			})
		}
		else{
			res.json({
				status:1,
				count:data.length,
				content:data
			})
		}
	})
})

router.post('/adminList',function(req,res,next){
	const userName = req.cookies.userName;
	console.log(userName)
	if(userName!='admin')
	{
		res.render('error')
		return;
	}
	else
	{
		let goodsList = goods.find({},function(err,doc){
		if(err)
		{
			res.json({
				msg:err.message,
				status:0
			})
		}
		else{
			res.json({
				status:1,
				msg:doc
			})
		}
	})
	}
})
router.post('/removeGoods',function(req,res,next){
	const userName = req.cookies.userName;
	const productId = req.body.productId;
	console.log(userName);
	if(userName!='admin')
	{
		res.render('error')
		return;
	}
	else
	{
		goods.findOne({'productId':productId},function(err,doc){
			if(doc)
			{
				console.log(1)
				var productImage = doc.productImage.split('/');
				var productImageName = productImage[productImage.length-1];
				goods.deleteMany({'productId':productId},function(err1,doc1){
				if(err1){
					res.json({
						status:0,
						msg:'删除失败',
						result:err1
				})
				}
				else{
					fs.unlinkSync(path.join(__dirname, './../views/static/img/')+productImageName);
					res.json({
						status:1,
						msg:'删除成功',
						result:''
				})
				}
				})
			}
			else
			{
					res.json({
						status:0,
						msg:'删除失败',
						result:err
				})
			}
		})
	}
})
router.post('/addItem',function(req,res,next){
	  var form = new formidable.IncomingForm();
	  form.parse(req, function(err, fields, files) {
		    var params = {
		    	productName:fields.name,
		    	salePrice:fields.price,
		    	productId:Math.random()*100000+'admin',
		    	productImage:'@/../static/img/'+files.image.name
		    }
          		goods.create(params,function(err,doc){
				if(err)
				{
					console.log(err)
					res.json({
								status:1,
								msg:'添加失败'
							})
				}
				else
				{
					form.uploadDir = path.join(__dirname, './../views/static/img/');
					var newPath = path.join(__dirname, './../views/static/img/')+files.image.name;
					fs.rename(files.image.path,newPath,function(err){
						if(err)
						{
							console.log(err);
							res.json({
								status:0,
								msg:'添加失败'
						})
						}
						else
						{
							res.json({
								status:1,
								msg:'添加成功'
							})
						}
					})
				}
				})
		});
})
//加入购物车
router.post('/addCart',function(req,res,next){
	var userId = req.cookies.userId
	var way = req.body.way;
	var productId = req.body.productId;
	user.findOne({'userId':userId},function(error,doc){
		if(error){
			res.json({
				status:0,
				msg:error.message
			})
		}
		else
		{	
			if(doc)
			{
				let goodsItem = '';
				doc.cartList.forEach(function(item){
					if(item.productId == productId)
					{
						goodsItem = item
						if(way == '-'){
							item.productNum = item.productNum<=0?0:--item.productNum
						}
						else
						{
							item.productNum++;
						}
					}
				});
				if(goodsItem){
					doc.save(function(error2,doc2)
					{
						if(error2)
						{
							res.json({
								status:0,
								msg:error2.message
								})
						}
						else{
							res.json({
								status:1,
								msg:'购物车操作成功',
								result:'success'
							})
						}
					})
				}
				else{
				goods.findOne({productId:productId},function(error1,doc1){
					if(error1){
						res.json({
							status:0,
							msg:error1.message
						})
					}
					else
					{
						doc1.productNum = 1;
						doc1.check = true
						doc.cartList.push(doc1)
						doc.save(function(error2,doc2){
							if(error2){
								res.json({
									status:0,
									msg:error2.message
								})
							}
							else{
								res.json({
									status:1,
									result:'success'
								})
							}
						})
					}
				})
			}
			}
		}
	})
})

router.post('/removeCart',function(req,res,next){
	const params = {
		userId:req.cookies.userId,
		productId:req.body.productId
	}
	user.update({userId:params.userId},{$pull:{'cartList':{productId:params.productId}}},function(err,doc){
		if(err){
			res.json({
				status:0,
				msg:'删除失败',
				result:err.message
			})
		}
		else{
			res.json({
				status:1,
				msg:'删除成功',
				result:''
			})
		}
	})

})

router.post('/changeCheck',function(req,res,next){
	var productId = req.body.productId;
	var userId = req.cookies.userId
	var check = req.body.check
	if(productId){
	user.updateOne({userId:userId,'cartList.productId':productId},{'cartList.$.check':check},function(err,doc){
		if(err){
			res.json({
				status:0,
				msg:err.message,
				result:''
			})
		}
		else{
			res.json({
				status:1,
				msg:'成功',
				result:''
			})
		}
	})
	}
	else{
		user.findOne({userId:userId},function(err,doc){
		if(err){
			res.json({
				status:0,
				msg:err.message,
				result:''
			})
		}
		else{
			doc.cartList.forEach(function(item){
				item.check = check;
			})
			doc.save(function(err1,doc1){
				if(err1){
					res.json({
						status:0,
						msg:'失败',
						result:err1.message
					})
				}
				else{
					res.json({
						status:1,
						msg:'成功',
						result:''
					})
				}
			})
		}
	})

	}
})
// "productId":String,
// 		"productName":String,
// 		"salePrice":Number,
// 		"productImage":String,
// 		"check":Boolean,
// 		"productNum":Number
module.exports = router

