const jwt=require('jsonwebtoken');
const User = require('../models/user');
const { normalizeErrors } = require('../helpers/mongoose');
const config=require('../config');


exports.getUser=function(req,res){
    const requestedUserId=req.params.id;
    const user=res.locals.user;

    if(requestedUserId===user.id){
        User.findById(requestedUserId,function(err,user){
            if(err){
                return res.status(422).send({ errors: normalizeErrors(err.errors) });
            }

            return res.json(user);
        })
    }else{
        User.findById(requestedUserId)
            .select('-revenue -password -_id -bookings')
            .exec(function(err,user){
                if(err){
                    return res.status(422).send({ errors: normalizeErrors(err.errors) });
                }
                return res.json(user);
            })
    }
}

exports.auth = function (req, res) {

    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(422).send({ errors: [{ title: "Missing data", detail: "email or password is missing" }] });
    }

    User.findOne({ email }, function (err, user) {
        if (err) {
            return res.status(422).send({ errors: normalizeErrors(err.errors) });
        };

        if (!user) {
            return res.status(422).send({ errors: [{ title: "Invalid data", detail: "the user doesnt exist" }] });
        };

        if (!user.passwordCheck(password)) {
            return res.status(422).send({ errors: [{ title: "Invalid data", detail: "email or password is invalid" }] });
        } else {

            const token = jwt.sign({
                userId:user.id,
                userName:user.username
            }, config.SECRET, { expiresIn: '1h' });
            return res.json(token);
        }
    })

}

exports.register = function (req, res) {
    const { username, email, password, passwordConfirmation } = req.body;

    if (!username || !password) {
        return res.status(422).send({ errors: [{ title: "Missing data", detail: "username or password is missing" }] });
    }

    if (password != passwordConfirmation) {
        return res.status(422).send({ errors: [{ title: "Password error", detail: "Passwrods dont match" }] });
    }

    User.findOne({ email }, function (err, existingUser) {
        if (err) {
            return res.status(422).send({ errors: normalizeErrors(err.errors) });
        }
        if (existingUser) {
            return res.status(422).send({ errors: [{ title: "User error", detail: "user with this email exists" }] });
        };
        const user = new User({
            username,
            email,
            password,
            passwordConfirmation
        });

        user.save(function (err) {
            if (!err) {
                return res.json('registered the user');
            } else {
                return res.status(422).send({ errors: normalizeErrors(err.errors) });
            }

        });

    });

}


exports.authMiddleware=function(req,res,next){
    const token=req.headers.authorization;

    if(token){
        const user=parseToken(token)

        User.findById(user.userId,function(err,user){
            if(err){
                return res.status(422).send({ errors: normalizeErrors(err.errors) });
            }
            if(user){
                res.locals.user=user;
                next();
            }else{
                return res.status(401).send({ errors: [{ title: "Not authorized", detail: "you need to login again" }] });
            }
        })
    }else{
        return res.status(401).send({ errors: [{ title: "Not authorized", detail: "you need to login again" }] });
    }

}


function parseToken(token){
    return jwt.verify(token.split(' ')[1],config.SECRET);
}

