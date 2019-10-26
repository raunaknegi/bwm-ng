const bcrypt=require('bcrypt');
const mongoose=require('mongoose');
const Schema=mongoose.Schema;

const userSchema=new Schema({
    username:{
        type:String,
        required:true,
        max:[32,'username is too long'],
        min:[4,'username is too short'],
    },
    password:{
        type:String,
        required:true,
        min:[4,'password is too short'],
        max:[32,'password is too long']
    },
    email:{
        type:String,
        max:[32],
        min:[4],
        required:true,
        unique:true,
        lowercase:true,
        match:[/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/]
    },
    rentals:[{
        type:Schema.Types.ObjectId,ref:'Rental'
    }]
})


userSchema.methods.passwordCheck=function(requestedPassword){
    return bcrypt.compareSync(requestedPassword,this.password)
};

userSchema.pre('save',function(next){

    const user=this;
    bcrypt.genSalt(10,function(err,salt){
        bcrypt.hash(user.password,salt,function(err,hash){
            user.password=hash
            next();
        });
    });
})
module.exports=mongoose.model('User',userSchema);