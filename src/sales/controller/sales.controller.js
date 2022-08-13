const { StatusCodes } = require("http-status-codes");
const PaginationService = require("../../../common/services/PaginationService");
const findService = require("../../../common/services/findService");
const Sales = require("../model/sales.model")
const Goods = require("../../goods/model/goods.model");
const Customers = require("../../customers/model/customers.model");
const crtp = require('crypto');


//get all sales
exports.getSalesHandelr = async (req, res) => {
    const { searchKey, page, size } = req.query;
    const { skip, limit } = PaginationService(page, size);
    const models = {
        model: Sales
    }
    const popul = {
        userPath: "createdBy",
        userSelect: "username",
        prntModelRef: "goodsId",
        modelSelect: "productName sellingPrice",
        prntModelRef2: "customerId",
        modelSelect2: "custmName custmPhone",
    }
    try {
        const data = await findService(models, skip, limit, searchKey, [
            "custmPhoneNum"
        ], popul)
        res.json({ message: "success", data });
    } catch (error) {
        res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json({ message: "error", error: error.message });
    }
};

//Add sales
exports.addSalesHandelr = async (req, res) => {
    try {
        const { theNum, createdBy, customerId, goodsId } = req.body;
        const findGoods = await Goods.findOne({ _id: goodsId });
        if (findGoods) {

            if (findGoods.theNum <= 0) {
                res
                    .status(StatusCodes.BAD_REQUEST)
                    .json({ message: "This product is not available" });
            } else if (findGoods.theNum < theNum) {
                res
                    .status(StatusCodes.BAD_REQUEST)
                    .json({ message: "The product is not available in the required quantity" });
            } else {
                const goodsNum = findGoods.theNum - theNum;
                const newSales = new Sales({ createdBy, customerId, goodsId });
                const data = await newSales.save();
                await Goods.updateOne({ _id: findGoods._id }, { theNum: goodsNum });
                res
                    .status(StatusCodes.CREATED)
                    .json({ message: "add success", data });
            }
        }
    } catch (error) {
        res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json({ message: "error", error: error.message });
    }
}

// Delete sales
exports.deleteSalesHandelr = async (req, res) => {
    try {
        const { _id } = req.params;
        const data = await Sales.deleteOne({ _id });
        res.json({ message: "delete success", data });
    } catch (error) {
        res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json({ message: "error", error: error.message });
    }
}


