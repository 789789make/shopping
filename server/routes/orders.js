const express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var orders = require('./../models/orders');
var user = require('./../models/user');
var option = {  
        auto_reconnect: true,
        poolSize: 10,
        useNewUrlParser:true
};
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
});

router.post('/ordersList',function(req,res,next){
	const params = 
	{
		userName:req.cookies.userName
	}
	let result = [];
	if(params.userName!='admin')
	{
		res.render('error')
	}
	else
	{
		orders.find({},function(err,doc)
		{
			if(err)
			{
				res.json({
						status:0,
						msg:'失败',
						result:err
				})
			}
			else
			{
				if(doc)
				{
					doc.forEach( function(element, index) {
						result.unshift(element)
					});
				}
				res.json({
					status:1,
					msg:'success',
					content:result
				})
			}
		})
	}
})

router.post('/sureOrder',function(req,res,next){
	const params = {
		userId:req.body.userId,
		userName:req.cookies.userName,
		orderId:req.body.orderId
	};
	if(params.userName != 'admin')
	{
		res.json({
			status:0,
			msg:'失败',
		})
	}
	else
	{
		orders.findOne({id:params.orderId},function(err,doc){
			if(err)
			{
				res.json({
						status:0,
						msg:'删除失败',
						result:err1
				})
			}
			
			else
			{
				doc.status = 1
				// console.log(doc)
				doc.save(function(err1,doc1){
					if(err1)
					{
						res.json({
						status:0,
						msg:'删除失败',
						result:err1
							})
					}
					else
					{
						user.updateOne({'userId':params.userId,'orderList.id':params.orderId},{
							'orderList.$.status':1
						},function(err2,doc2){
							if(err2)
							{
								res.json({
								status:0,
								msg:'删除失败',
								result:err1
								})
							}
							else{
								console.log(2)
								res.json({
								status:1,
								msg:'确认成功',
							})
							}
						})
						// user.findOne({userId:params.userId},function(err2,doc2){
						// 	if(err2)
						// 		res.render('error')
						// 	else
						// 	{
						// 		doc2.orderList.updateOne({'id':params.orderId},{$set:{status:1}},function(err3,doc3){
						// 			if(err3)
						// 				res.render('error')
						// 			else
						// 				res.render('next')
						// 		})
						// 	}
						// })
					}
				})
			}
		})
	}
})


module.exports = router