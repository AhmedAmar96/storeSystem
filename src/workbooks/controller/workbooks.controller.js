const { StatusCodes } = require("http-status-codes");
const PaginationService = require("../../../common/services/PaginationService");
const findService = require("../../../common/services/findService");
const Workbooks = require("../model/workbooks.model");
const Goods = require("../../goods/model/goods.model");

//get all Workbooks
exports.getWorkbooksHandelr = async (req, res) => {
    const { searchKey, page, size } = req.query;
    const { skip, limit } = PaginationService(page, size);
    const models = {
        model : Workbooks,
        childModel : Goods
    }
    const popul = {
        userPath: "createdBy",
        modelRef: "workbooksId",
        userSelect: "username",
        // modelSelect: "productName"
    }
    try {
        const data = await findService(models, skip, limit, searchKey, [
            "workbooksType"
        ], popul)
        res.json({ message: "success", data });
    } catch (error) {
        res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json({ message: "error", error: error.message });
    }
};

//Add Workbooks
exports.addWorkbooksHandelr = async (req, res) => {
    try {
        const { workbooksType, createdBy } = req.body;
        const findWorkbooks = await Workbooks.findOne({ workbooksType });
        if (findWorkbooks) {
            res
                .status(400)
                .json({ message: "The Workbooks already exists" })
        } else {
            const newWorkbooks = new Workbooks({ workbooksType, createdBy });
            const data = await newWorkbooks.save();
            res
                .status(StatusCodes.CREATED)
                .json({ message: "created success", data });
        }
    } catch (error) {
        res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json({ message: "error", error: error.message });
    }
}

//Delete workbooks
exports.deleteWorkbooksHandelr = async (req, res) => {
    try {
        const { _id } = req.params;
        await Workbooks.deleteOne({ _id });
        res.json({ message: "delete workbooks success" });
    } catch (error) {
        res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json({ message: "error", error: error.message });
    }
}

//update workbooks
exports.updateWorkbooksHandelr = async (req, res) => {
    try {
        const { _id } = req.params;
        const { workbooksType } = req.body;
        await Workbooks.updateOne({ _id }, {workbooksType});
        res.json({ message: "update workbooks success" });
    } catch (error) {
        res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json({ message: "error", error: error.message });
    }
}
