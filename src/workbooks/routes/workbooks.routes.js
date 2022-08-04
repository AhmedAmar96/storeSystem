const router = require('express').Router();
const isAuthoraized = require('../../../common/middelware/isAuthoraized');
const { ADD_WORKBOOKS, GET_WORKBOOKS, DELETE_WORKBOOKS, PATCH_WORKBOOKS } = require('../../users/endPoints');
const { addWorkbooksHandelr, getWorkbooksHandelr, deleteWorkbooksHandelr, updateWorkbooksHandelr } = require('../controller/workbooks.controller');

router.get("/workbooks", isAuthoraized(GET_WORKBOOKS), getWorkbooksHandelr);
router.post("/workbooks", isAuthoraized(ADD_WORKBOOKS), addWorkbooksHandelr);
router.delete("/workbooks/:_id", isAuthoraized(DELETE_WORKBOOKS), deleteWorkbooksHandelr);
router.patch("/workbooks/:_id", isAuthoraized(PATCH_WORKBOOKS), updateWorkbooksHandelr);

module.exports = router;