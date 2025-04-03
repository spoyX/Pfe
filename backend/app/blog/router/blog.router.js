const express = require('express');
const blogController=require('../controller/blog.controller')
const cmmntController=require('../comments/controller/blog.controller')
const router = express.Router();
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


router.post('/create',upload.single('image'),(req,res)=>{
  blogController.createBlog(req, res, fileName)
  fileName=""
})
// Get all blogs
router.get('/getall', blogController.getBlogs);

// Get a specific blog
router.get('/byid/:id', blogController.getBlog);

// Get all comments for a specific blog
router.get('/:id/comments', cmmntController.getComments);
// Create a comment
router.post('/:id/comments', cmmntController.createComment);

module.exports = router;





