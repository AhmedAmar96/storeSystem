const router = require('express').Router();
const isAuthoraized = require('../../../common/middelware/isAuthoraized');
const { GET_CUSTOMERS, ADD_CUSTOMERS, DELETE_CUSTOMERS } = require('../../users/endPoints');
const { getCustomersHandelr, addCustomersHandelr, dltCustomersHandelr } = require('../controller/customers.controller');


router.get("/customers", isAuthoraized(GET_CUSTOMERS), getCustomersHandelr);
router.post("/customers", isAuthoraized(ADD_CUSTOMERS), addCustomersHandelr);
// router.put("/sales/:_id", isAuthoraized(DELETE_SALES), updateSalesHandelr);
router.delete("/customers/:_id", isAuthoraized(DELETE_CUSTOMERS), dltCustomersHandelr);

module.exports = router;