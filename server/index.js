const express=require('express');
const mongoose=require('mongoose');
const config=require('./config/dev');
const FakeDb=require('./fake-db');
const router=require('./routes/rental');
const Rental=require('./models/rental');

const app=express();



mongoose.connect(config.BWM_URI).then(() =>{
    const fakeDb=new FakeDb();
    fakeDb.seedDb();
});

app.use('/api/rentals',router)


port=process.env.PORT||3001

app.listen(port,function(){
    console.log("server started at port "+port);
    
})

