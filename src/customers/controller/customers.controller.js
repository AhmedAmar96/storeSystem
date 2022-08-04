const { StatusCodes } = require("http-status-codes");
const PaginationService = require("../../../common/services/PaginationService");
const findService = require("../../../common/services/findService");
const crtp = require('crypto');
const Customers = require("../model/customers.model");
const Sales = require("../../sales/model/sales.model");


//get all customers
exports.getCustomersHandelr = async (req, res) => {
    const { searchKey, page, size } = req.query;
    const { skip, limit } = PaginationService(page, size);
    const models = {
        model: Customers,
        childModel: Sales
    }
    const popul = {
        userPath: "createdBy",
        modelRef: "customerId",
        userSelect: "username",
        modelPath: "goodsId",
        modelSelect: "productName sellingPrice"
    }
    try {
        const data = await findService(models, skip, limit, searchKey, [
            "custmPhone"
        ], popul)
        res.json({ message: "success", data });
    } catch (error) {
        res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json({ message: "error", error: error.message });
    }
};

//Add customer
exports.addCustomersHandelr = async (req, res) => {
    try {
        const { custmName, custmPhone, custmEmail, createdBy } = req.body;
        const custmerEmail = await Customers.findOne({ custmEmail });
        const customerPhone = await Customers.findOne({ custmPhone });
        if (custmerEmail) {
            res
                .status(400)
                .json({ message: "email already exists" })
        } else if (customerPhone) {
            res
                .status(400)
                .json({ message: "mobile phone already exists" })
        } else {
            const newCustomer = new Customers({ custmName, custmPhone, custmEmail, createdBy });
            const data = await newCustomer.save();
            res
                .status(StatusCodes.CREATED)
                .json({ message: "add success", data });
        }
    } catch (error) {
        res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json({ message: "error", error: error.message });
    }
}

// Delete customer
exports.dltCustomersHandelr = async (req, res) => {
    try {
        const { _id } = req.params;
        await Customers.deleteOne({ _id });
        res.json({ message: "delete user success" });
    } catch (error) {
        res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json({ message: "error", error: error.message });
    }
}