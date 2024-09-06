const router=require('express').Router();
const verify=require("../middleware/jwtverify");
const handle=require('../controllers/auth').authorize;
const userController=require('../controllers/user');

//use verify middleware after frontend handling
router.get('/',/*verify,*/userController.getIndexPage);
router.get('/signup',userController.getSignUpPage);
router.post('/signup',userController.postSignup);
router.get('/signin',userController.getSignInPage);
router.post('/signin',userController.postsignin);
router.get('/cart',/*verify,*/handle,userController.getcartpage);
router.post('/cart/:ID',handle,userController.postCart);
router.post('/removeCartItem/:ID',handle,userController.removeCartItem);
// frontend handle delete methode
router.post('/deleteCart',/*verify,*/handle,userController.clearCart);
router.get('/changepassword',/*verify,*/handle,userController.getChangePassword);
router.post('/changepassword',/*verify,*/handle,userController.postChangePassword);
router.get('/logout',userController.postlogout);
router.get('/checkout',userController.getCheckoutpage);
router.post('/checkout',userController.postcheckoutpage);
router.post('/search',userController.postSearch);
router.get('/orders',userController.getOrdersPage);
router.get('/orderDetails/:ID',userController.getOrderDetails);
router.post('/deleteOrder/:ID',userController.deleteOrder);
router.get('/forgetpassword',userController.getforgetpassword);
router.post('/forgetpassword',userController.postforgetpassword);
router.get('/resetpassword/:userId/:token',userController.getresetpassword)
router.post('/resetpassword/:userId/:token',userController.postresetpassword)
router.get('/verify/:token',userController.getverify)

module.exports=router;