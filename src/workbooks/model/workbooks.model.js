const mongoose = require("mongoose");
const workbooksSchema = require("../schema/workbooks.schema");

const Workbooks = mongoose.model("workbooks", workbooksSchema);

module.exports = Workbooks; 