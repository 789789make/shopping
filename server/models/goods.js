//调用mongodb接口
const mongoose = require('mongoose')
var  Schema = mongoose.Schema
//商品模型
var productSchema = new Schema({
	"productId":String,
	"productName":String,
	"salePrice":Number,
	"productImage":String,
	"productNum":Number,
	'check':Boolean
})
module.exports = mongoose.model('goods',productSchema)