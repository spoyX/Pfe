const express = require('express');

const router = express.Router();
const userController=require('../controllers/user.Controller')


const multer = require('multer')

let fileName = '';
const myStorage = multer.diskStorage({
    destination: './public',
    filename: (req, file, redirect)=>{
        fileName= Date.now() + '.'+ file.mimetype.split('/')[1];
        redirect(null, fileName);
    }
})
const upload = multer({storage: myStorage});


router.post('/createuseraccount', upload.single('image') , (req, res)=>{
  userController.createUserAccount(req, res, fileName);
  fileName = '';
});


router.post('/signin',userController.signIn);
router.get('/byid/:id', userController.getUserProfile );



router.post('/forgot-password', UserController.forgotPassword);


router.put('/reset-password', UserController.resetPassword);
