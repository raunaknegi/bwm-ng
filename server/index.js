const express=require('express');
const mongoose=require('mongoose');
const config=require('./config');
const FakeDb=require('./fake-db');
const bodyParser=require('body-parser');
const path = require('path');



const rentalRoute=require('./routes/rental');
const userRoute=require('./routes/user');
const bookingRoute=require('./routes/booking');
const imageUploadRoute=require('./routes/image-upload');
const paymentRoute=require('./routes/payments');
const reviewRoute=require('./routes/reviews');


const app=express();
app.use(bodyParser.json());



mongoose.connect(config.BWM_URI,{useNewUrlParser:true}).then(() =>{
    if (process.env.NODE_ENV !== 'production') {
        const fakeDb = new FakeDb();
        // fakeDb.seedDb();
    }
});

app.use('/api/rentals',rentalRoute);
app.use('/api/user',userRoute);
app.use('/api/booking',bookingRoute);
app.use('/api',imageUploadRoute);
app.use('/api/payment',paymentRoute);
app.use('/api/review',reviewRoute);

if (process.env.NODE_ENV === 'production') {
    const appPath = path.join(__dirname, '..', 'dist');
    app.use(express.static(appPath));
  
    app.get('*', function(req, res) {
      res.sendFile(path.resolve(appPath, 'index.html'));
    });
  }
  

const port=process.env.PORT||3001

app.listen(port,function(){
    console.log("server started at port "+port);
    
})

