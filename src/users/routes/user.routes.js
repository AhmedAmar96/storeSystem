const router = require('express').Router();
const isAuthoraized = require('../../../common/middelware/isAuthoraized');
const validateRequest = require('../../../common/middelware/validateRequest');
const { getUsersHandelr, addUserHandelr, signInHandelr, updateUserHandelr, deleteUserHandelr, deactAccountHandelr, verifyHandlr, updatePassHandelr, forgetPassHandelr, addAdminHandelr } = require('../controller/user.controller');
const { ADD_ADMIN, ADD_USER, GET_ALL_USERS, DELETE_USER, DEACT_ACCOUNT } = require('../endPoints');
const { signUpSchema, signInSchema, updateUserSchema, updatePassSchema } = require('../joi/userValidation');

router.get('/users', isAuthoraized(GET_ALL_USERS), getUsersHandelr);
router.get('/verify/:token', verifyHandlr);
router.post('/addAdmin', isAuthoraized(ADD_ADMIN), validateRequest(signUpSchema), addAdminHandelr);
router.post('/addUser', isAuthoraized(ADD_USER), validateRequest(signUpSchema), addUserHandelr);
router.post('/auth', validateRequest(signInSchema), signInHandelr);
router.put('/users', validateRequest(updateUserSchema), updateUserHandelr);
router.delete('/deleteUser/:_id', isAuthoraized(DELETE_USER), deleteUserHandelr);
router.patch('/users/deactAccount/:_id', isAuthoraized(DEACT_ACCOUNT), deactAccountHandelr);
router.patch('/passowrd', validateRequest(updatePassSchema), updatePassHandelr);
router.post('/users/forgetPassword', forgetPassHandelr);


module.exports = router;