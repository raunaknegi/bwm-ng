const aws = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');
const config=require('../config/dev');

aws.config.update({
    secretAccessKey:config.aws_SECRET_ACCESS_KEY,
    accessKeyId:config.aws_ACCESS_KEY,
    region:'us-east-2'
})
 
const s3 = new aws.S3()

const fileFilter=function(req,file,cb){

    if(file.mimetype==='image/jpeg' || file.mimetype==='image/png'){
      cb(null,true);
    }else{
      cb(new Error('Invalid format! Only JPEG and PNG are accepted'),false);
    }
}
 
const upload = multer({
  fileFilter:fileFilter,
  storage: multerS3({
    acl:'public-read',    
    s3: s3,
    bucket: 'bwm-ng-raunak',
    metadata: function (req, file, cb) {
      cb(null, {fieldName: 'TESTING_METADATA'});
    },
    key: function (req, file, cb) {
      cb(null, Date.now().toString())
    }
  })
});

module.exports=upload