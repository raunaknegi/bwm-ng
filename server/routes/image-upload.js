const express=require('express');
const router=express.Router();
const userControl=require('../controllers/routing');
const upload=require('../services/image-upload');

const singleImage=upload.single('image');

router.post('/image-upload', userControl.authMiddleware,function(req,res){
    singleImage(req,res,function(err){
        if(err){
            return res.status(422).send({errors:[{title:'Image Upload Error!',detail:err.message}]})
        }

        return res.json({'imageUrl':req.file.location})
    });
});

module.exports=router;