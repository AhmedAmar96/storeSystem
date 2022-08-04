const { StatusCodes } = require("http-status-codes");
const PaginationService = require("../../../common/services/PaginationService");
const findService = require("../../../common/services/findService");
const Goods = require("../model/goods.model");
const Workbooks = require("../../workbooks/model/workbooks.model");
const Sales = require("../../sales/model/sales.model");
const crtp = require('crypto');

//get all Goods
exports.getGoodsHandelr = async (req, res) => {
    const { searchKey, page, size } = req.query;
    const { skip, limit } = PaginationService(page, size);
    const models = {
        model : Goods,
        childModel : Sales
    }
    const popul = {
        userPath: "createdBy",
        modelRef: "goodsId",
        userSelect: "username",
        // modelSelect: "productName"
    }
    try {
        const data = await findService(models, skip, limit, searchKey, [
            "productName"
        ], popul)
        res.json({ message: "success", data });
    } catch (error) {
        res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json({ message: "error", error: error.message });
    }
};

//Add Goods
exports.addGoodsHandelr = async (req, res) => {
    try {
        const { productName, theNum, wholesalePrice, sellingPrice, createdBy, workbooksId } = req.body;
        const findWorkbooks = await Workbooks.findOne({ _id: workbooksId });
        const foundProud = await Goods.findOne({ productName });
        if (foundProud) {
            res
                .status(400)
                .json({ message: "productName already exists" })
        } else {
            if (findWorkbooks) {
                const prodCode = await crtp.randomBytes(3).toString('hex');
                const newGoods = new Goods({ productName, theNum, wholesalePrice, sellingPrice, prodCode, createdBy, workbooksId });
                const data = await newGoods.save();
                res
                    .status(StatusCodes.CREATED)
                    .json({ message: "add success", data });
            } else {
                res
                    .status(StatusCodes.BAD_REQUEST)
                    .json({ message: "invalid workbooks id" })
            }
        }
    } catch (error) {
        res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json({ message: "error", error: error.message });
    }
}

// Delete Goods
exports.deleteGoodsHandelr = async (req, res) => {
    try {
        const { _id } = req.params;
        const data = await Goods.deleteOne({ _id });
        res.json({ message: "delete success" });
    } catch (error) {
        res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json({ message: "error", error: error.message });
    }
}

//update Goods
exports.updateGoodsHandelr = async (req, res) => {
    try {
        const { _id } = req.params;
        const { productName, theNum, wholesalePrice, sellingPrice } = req.body;
        const data = await Goods.updateOne({ _id }, { productName, theNum, wholesalePrice, sellingPrice });
        res.json({ message: "update Goods success", data });
    } catch (error) {
        res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json({ message: "error", error: error.message });
    }
}

