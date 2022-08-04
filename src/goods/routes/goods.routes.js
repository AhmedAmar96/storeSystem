const router = require('express').Router();
const isAuthoraized = require('../../../common/middelware/isAuthoraized');
const { ADD_GOODS, GET_GOODS, DElETE_GOODS, UPDATE_GOODS } = require('../../users/endPoints');
const { getGoodsHandelr, addGoodsHandelr, deleteGoodsHandelr, updateGoodsHandelr } = require('../controller/goods.controller');


router.get("/goods", isAuthoraized(GET_GOODS), getGoodsHandelr);
router.post("/goods", isAuthoraized(ADD_GOODS), addGoodsHandelr);
router.delete("/goods/:_id", isAuthoraized(DElETE_GOODS), deleteGoodsHandelr);
router.put("/goods/:_id", isAuthoraized(UPDATE_GOODS), updateGoodsHandelr);

module.exports = router;