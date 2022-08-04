const mongoose = require("mongoose");
const salesSchema = require("../schema/sales.schema");

const Sales = mongoose.model("sales", salesSchema);

module.exports = Sales; 