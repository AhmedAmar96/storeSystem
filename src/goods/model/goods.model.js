const mongoose = require("mongoose");
const goodsSchema = require("../schema/goods.schema");

const Goods = mongoose.model("goods", goodsSchema);

module.exports = Goods;