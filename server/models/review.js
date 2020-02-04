const mongoose=require('mongoose');
const Schema=mongoose.Schema;

const allowed_rating=[1,2,3,4,5];

const reviewSchema=new Schema({
    rating:Number,
    review:String,
    createdAt:{type:Date,default:Date.now},
    user:{type:Schema.Types.ObjectId,ref:'User'},
    rental:{type:Schema.Types.ObjectId,ref:'Rental'}
});

module.exports=mongoose.model('Review',reviewSchema);

reviewSchema.pre('save',function(next){
    if(allowed_rating.indexOf(this.rating)>=0){
        next();
    }else{
        const err=new Error({rating:'not valid rating'});
        err.errors={};
        err.errors.rating={message:'This rating is not allowed'}
        next(err)
    }
})