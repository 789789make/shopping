const mongoose = require('mongoose')

const Schema = mongoose.Schema;

const userSchema = new Schema({
	"userName":String,
	"userId":String,
	"userPwd":String,
	"userAddress":[
	{
		name:String,
		tel:String,
		address:String,
		postalCode:String,
		default:Boolean,
		id:String
	}
	],
	"cartList":
	[
	{
		"productId":String,
		"productName":String,
		"salePrice":Number,
		"productImage":String,
		"check":Boolean,
		"productNum":Number
	}
	],
	"orderList":
	[
		{
			"freeCost":Number,
			"address":Object,
			"goodsList":Array,
			"totalCost":Number,
			"createDate":String,
			"id":String,
			"status":Number,
			"sendCost":Number,
			'userId':String
		}
	]
})
module.exports = mongoose.model('user',userSchema)
//相当于 module.exports = mongoose.model('user',userSchema,'users')
// 第三个参数为查找的集合