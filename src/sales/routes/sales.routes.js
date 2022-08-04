const router = require('express').Router();
const isAuthoraized = require('../../../common/middelware/isAuthoraized');
const { GET_SALES, ADD_SALES, DELETE_SALES } = require('../../users/endPoints');
const { getSalesHandelr, addSalesHandelr, deleteSalesHandelr } = require('../controller/sales.controller');


router.get("/sales", isAuthoraized(GET_SALES), getSalesHandelr);
router.post("/sales", isAuthoraized(ADD_SALES), addSalesHandelr);
router.delete("/sales/:_id", isAuthoraized(DELETE_SALES), deleteSalesHandelr);
// router.put("/sales/:_id", isAuthoraized(DELETE_SALES), updateSalesHandelr);


module.exports = router;