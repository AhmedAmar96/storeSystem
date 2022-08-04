const mongoose = require("mongoose");
const customersSchema = require("../schema/customers.schema");

const Customers = mongoose.model("customers", customersSchema);

module.exports = Customers; 