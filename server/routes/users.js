const express = require('express')
var router = express.Router()
var mongoose = require('mongoose');
var user = require('./../models/user');
var orders = require('./../models/orders');
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
})
router.get('/',function(req,res,next){
	let param = {};
	let goodsModel=user.find(param)
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
router.post('/login',(req,res,next)=>{
	let param = {
		userName : req.body.userName,
		userPwd : req.body.userPwd
	}
	return new Promise((resolve,reject)=>{
		user.findOne(param,function(error,doc){
		if(error){
			reject({status:0,msg:error.message,result:'登陆失败'})
		}
		else
		{
			resolve(doc)
		}
	})
	})
	.then(result=>{
		if(result){
				var cartGoodsNums = 0;
				result.cartList.map(function(item){
					cartGoodsNums+=item.productNum
				})
				res.cookie('userId',result.userId,{
					path:'/',
					maxAge : 1000*60*60
				})
				res.cookie('userName',result.userName,{
					path:'/',
					maxAge : 1000*60*60
				})
				res.json({
					status:1,
					msg:'登录成功',
					result:{
						userName:result.userName,userCartNum:cartGoodsNums
					}
				})
			}
		else
		{
			res.json({
					status:0,
					msg:'用户名或密码错误',
					result:'登陆失败'
				})
		}
	})
	.catch(error=>{
		res.json(error)
	})
})

router.post('/register',function(req,res,next){
	let params = {
		userName:req.body.userName,
		userPwd:req.body.userPwd,
	}
	return new Promise((resolve,reject)=>{
		user.findOne({userName:params.userName},function(err,doc){
			if(err){
				console.log(err);
				reject({msg:err.message,status:0,result:'错误'})
			}
			else{
				resolve(doc)
			}
		})
	})
	.then(result=>{
		if(!result)
		{
			user.find({},function(er,result1){
				params.userId = params.userName+new Date()
				user.insertMany(params,function(err1,doc1){
				if(err1){
					console.log('1');
					res.json({
						status:0,
						msg:err1.message,
						result:'注册失败'
					})
				}
				else{
					res.json({
						status:1,
						msg:'注册成功',
					})
				}
			})
			})
		}
		else
		{
			res.json({
				status:0,
				msg:'用户名或者密码已经存在',
				result:'注册失败'
			})
		}
	})
	.catch(err2=>{
		console.log(err2);
		res.json(
			err2
		)
	})
})

router.post('/loginOut',function(req,res,next){
	res.cookie('userId','',{
		path:'/',
		maxAge:-1
	})
	res.json({
		status:1,
		msg:'登出成功!'
	})
})

router.get('/checkLogin',function(req,res,next){
	if(req.cookies.userId){
		user.findOne({userId:req.cookies.userId},function(err,doc){
			if(err){
				res.json({
				status:0,
				msg:err.message,
				result:'error'
				})
			}
			else{
				var cartGoodsNums = 0
				if(doc.cartList)
				{
					doc.cartList.forEach(function(item){
					cartGoodsNums+=item.productNum
					})
				}
				res.json({
				status:1,
				msg:'',
				result:{userName:req.cookies.userName,cartNums:cartGoodsNums}
				})
			}
		})
		
	}
	else{
		res.json({
			status:0,
			msg:'未登录'
		})
	}
})

router.get('/cartList',function(req,res,next){
	var userId = req.cookies.userId;
	user.findOne({userId:userId},function(err,doc){
		if(err)
		{
			res.json({
				status:0,
				msg:err.message
			})
		}
		else{
			if(doc){
				res.json({
					status:1,
					msg:'',
					result:doc.cartList
				})
			}
		}
	})
})

router.post('/cartListClear',function(req,res,next){
	var userId = req.cookies.userId;
	user.findOne({userId:userId},(err,doc)=>{
		if(err){
			res.json({
				status:0,
				msg:err.message,
				result:'error'
			})
		}
		else{
			var cartRes = [];
			var cartLength = 0;
			doc.cartList.forEach(function(item,index){
				if(!item.check){
					cartRes.push(item)
					cartLength+=item.productNum
				}
			})
			doc.cartList = cartRes;
			doc.save((err1,doc1)=>{
				if(err1){
					res.json({
					status:0,
					msg:err1.message,
					result:'error'})
				}
				else{
					res.json({
					status:1,
					msg:'',
					result:{cartLength:cartLength}
						})
				}
			})
		}
	})
})

router.post('/address',function(req,res,next){
	var userId = req.cookies.userId;
	user.findOne({userId:userId},function(err,doc){
		if(err){
			res.json({
				status:0,
				msg:err.message,
				result:'失败'
			})
		}
		else if(doc){
			res.json({
				status:1,
				result:doc.userAddress,
				msg:'成功'
			})
		}
		else{
			res.json({
				status:1,
				result:[],
				msg:'成功'
			})
		}
	})
})

router.post('/addAddress',function(req,res,next){
	var params ={
		userId :req.cookies.userId,
		name:req.body.name,
		address:req.body.address,
		tel:req.body.tel,
		postalCode:req.body.postalCode,
		id:req.body.id
	}
	user.findOne({userId:params.userId},function(err,doc){
		const ifDefault = doc.userAddress.length?false:true
			user.updateOne({
		userId:params.userId
	},{
		'$push':{userAddress:{
			'name':params.name,
			"address":params.address,
			"postalCode":params.postalCode,
			'tel':params.tel,
			default:ifDefault,
			'id':params.id
		}
	  }
	},
	function(err,doc){
		if(err)
		{
			res.json({
				status:0,
				msg:err.message,
				result:'添加失败'
			})
		}
		else{
			res.json({
				status:1,
				msg:'成功',
				result:''
			})
		}
	}
	)
	})
})

router.post('/removeAddress',function(req,res,next)
{
var params = {
	userId:req.cookies.userId,
	id:req.body.id
}
user.updateOne({userId:params.userId},{$pull:{'userAddress':{id:params.id}}},function(err,doc){
	if(err){
		res.json({
			status:0,
			msg:err.message,
			result:'删除失败'
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
})


router.post('/setDefaultAddress',function(req,res,next){
	var params = {
		id:req.body.id,
		userId:req.cookies.userId
	}
	if(params.id)
	{
	user.findOne({userId:params.userId},function(err,doc){
		if(err){
			res.json({
				status:0,
				result:'失败',
				msg:err.message
			})
		}
		else{
			var addressList = doc.userAddress;
			addressList.forEach(function(item){
				// item.id==params.id?item.default=true:item.default=false
				if(item.id == params.id){
					item.default = true
				}
				else{
					item.default = false
				}
			})
			doc.save(function(err1,doc1){
				if(err1){
					res.json({
						status:0,
						msg:err.message,
						result:'失败'
					})
				}
				else{
					res.json({
						status:1,
						msg:'',
						result:'成功'
					})
				}
			})
		}
	})
	}
})

router.post('/payMent',function(req,res,next){
	var params = {
		userId:req.cookies.userId,
		freeCost:req.body.freeCost,
		sendCost:req.body.sendCost
	}
	user.findOne({userId:params.userId},function(err,doc){
		if(err){
			res.json({
				status:0,
				msg:err.message,
				result:'失败'
			})
		}
		else{
			if(doc)
			{
				var address = '';
				var goodsList = [];
				var totalCost = 0;
				doc.userAddress.filter((item)=>{
					if(item.default){
						address = item
					}
				})
				doc.cartList.forEach((item,index)=>{
					if(item.check){
						goodsList.push(item)
						totalCost+=item.salePrice*item.productNum
					}
				})
				if(params.freeCost)
				{
					totalCost+=(-params.freeCost)
				}
				else if(params.sendCost)
				{
					totalCost+= params.sendCost
				}
				var nowDate = new Date()
				var order = {
					freeCost:params.freeCost,
					address,
					goodsList,
					totalCost,
					sendCost:params.sendCost,
					createDate:nowDate,
					id:params.userId+nowDate.getTime(),
					status:0,
					userId:params.userId
				}
				if(doc.orderList.length>5){
					doc.orderList.pop()
				}
				doc.orderList.unshift(order)
				doc.save(function(err1,doc1){
					if(err1){
						res.json({
							status:0,
							msg:err.message,
							result:'失败'
						})
					}
					else{
					orders.create(order,function(err2,doc2){
						if(err2)
						{
							res.json({
							status:0,
							msg:err.message,
							result:'失败'
						})
						}
						else
						{
							res.json({
							status:1,
							msg:'成功',
							result:{
								id:order.id,
								totalCost:order.totalCost
							}
						})
						}
					})	
					}
				})
			}
			else{
				res.json({
					status:0,
					msg:'查找不到用户信息',
					result:'失败'
				})
			}
		}
	})
})

router.post('/userOrder',function(req,res,next){
		const params = {
			userId:req.cookies.userId
		}
		user.findOne({userId:params.userId},function(err,doc)
		{
			if(err)
			{
				res.json({
					status:0,
					msg:err.message,
					result:'失败'
				})
			}
			else
			{
				res.json({
					status:1,
					msg:doc.orderList,
					result:'成功'
				})
			}
		})
})
module.exports = router