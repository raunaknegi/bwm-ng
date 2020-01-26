const express=require('express');
const mongoose=require('mongoose');
const config=require('./config/dev');
const FakeDb=require('./fake-db');
const bodyParser=require('body-parser');


const rentalRoute=require('./routes/rental');
const userRoute=require('./routes/user');
const bookingRoute=require('./routes/booking');
const imageUploadRoute=require('./routes/image-upload');
const paymentRoute=require('./routes/payments');



const app=express();
app.use(bodyParser.json());



mongoose.connect(config.BWM_URI,{useNewUrlParser:true}).then(() =>{
    const fakeDb=new FakeDb();
    //fakeDb.seedDb();
});

app.use('/api/rentals',rentalRoute);
app.use('/api/user',userRoute);
app.use('/api/booking',bookingRoute);
app.use('/api',imageUploadRoute);
app.use('/api/payment',paymentRoute)



port=process.env.PORT||3001

app.listen(port,function(){
    console.log("server started at port "+port);
    
})

