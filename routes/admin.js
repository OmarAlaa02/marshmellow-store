const router = require('express').Router();
const adminController = require('../controllers/admin');
const handle = require('../controllers/auth').authorizeAdmin;
const admintoken = require("../middleware/admin-token");
const multer = require('multer');
const path = require('path');


const diskStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'images'); 
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + path.extname(file.originalname); 
        cb(null, uniqueSuffix); 
    }
});


const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Only image files are allowed!'), false);
    }
};


const upload = multer({
    storage: diskStorage,
    fileFilter: fileFilter
});

router.get('/signin', adminController.getSignInPage);
router.post('/signin', adminController.postSignInPage);
router.get('/home', /*admintoken,*/ handle, adminController.getAdminHomePage);
router.get('/addproduct', /*admintoken,*/ handle, adminController.getAdminAddPage);


router.post('/addproduct',upload.single('imgURL'), handle, adminController.postaddProduct);

router.get('/editproduct/:ID', /*admintoken,*/ handle, adminController.getAdminEditPage);
router.post('/editproduct/:ID',upload.single('imgURL'), handle, adminController.posteditProduct);

// Improved frontend request for product deletion
router.get('/delete/:ID', /*admintoken,*/ handle, adminController.postdeleteproduct);
router.get('/orders', handle, adminController.getAdminOrders);
router.get('/orders/:ID', handle, adminController.getOrderDetails);
router.post('/updateOrderStatus/:ID', handle, adminController.postUpdateStatus);
router.get('/logout', adminController.postAdminLogout);

module.exports = router;