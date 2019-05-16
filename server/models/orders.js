//调用mongodb接口
const mongoose = require('mongoose')
var  Schema = mongoose.Schema
//订单模型
var orderSchema = new Schema({
	"freeCost":Number,
	"address":Object,
	"goodsList":Array,
	"totalCost":Number,
	"createDate":String,
	"id":String,
	"status":Number,
	"sendCost":Number,
	'userId':String
})
module.exports = mongoose.model('orders',orderSchema)