const mongoose=require('mongoose');
const Schema=mongoose.Schema;

const bookingSchema=new Schema({
    endAt:{type:Date, required:"Ending Date is required"},
    startAt:{type:Date,required:"Starting Date is required"},
    totalPrice:Number,
    days:Number,
    guests:Number,
    createdAt:{type:Date,default:Date.now},
    user:{type:Schema.Types.ObjectId,ref:'User'},
    rental:{type:Schema.Types.ObjectId,ref:'Rental'},
    payment:{type:Schema.Types.ObjectId,ref:'Payment'},
    status:{type:String,default:'pending'}

});

module.exports=mongoose.model('Booking',bookingSchema);