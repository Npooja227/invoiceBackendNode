
const jwt = require('jsonwebtoken');
const JWT_SECRET = "DA693C13E7C5528473D915EB827EC";
var crypto = require('crypto');
const algorithm = 'aes-256-cbc';
const key = crypto.randomBytes(32);
const iv = crypto.randomBytes(16);
const sgMail = require('@sendgrid/mail');

const Sequelize = require('sequelize');
let sequelize = require('../config');
//const Usermodel = require('../models/user');
const user = require('../models/user')(sequelize, Sequelize);

JWT_TOKEN = (user) => {

    return jwt.sign({
        'user_id': user.id,
        'email': user.email,
        'name': user.name,
        'image': user.image,
        'exp': new Date().setDate(new Date().getDate() + 1) //current time + 1 day
    }, JWT_SECRET);
}

module.exports = {

    signup: async (req, res, next) => {

        const email = req.body.email;

        //check if email exists or not
        const checkUser = await user.findOne({
            where: {
                email: email
            }
        });

        //If user exists
        if (checkUser) res.status(400).send({ error: 'Email already in use.' });

        //If user doesn't exists 
        const newUser = {
            name: req.body.name,
            email: req.body.email,
            provider: 'password',
            password: req.body.password,
            image: req.body.image
        };

        //Create new user
        await user.create(newUser);

        //Get token
        const token = JWT_TOKEN(newUser);

        //Send Response
        res.status(201).send({ token });
    },

    signin: async (req, res, next) => {

        console.log("req.user", req.user);

        //Get token
        const token = JWT_TOKEN(req.user);

        //Send Response
        res.status(200).send({ token });
    },

    checkUser: async (req, res, next) => {

        const email = req.body.email;

        //check if email exists or not
        const checkUser = await user.findOne({
            where: {
                email: email
            }
        });

        //If user exists
        if (checkUser && checkUser.provider == 'password') {

            var obj = JSON.stringify({
                id: checkUser.id,
                email: checkUser.email,
                expires: Date.now() + 86400000
            });

            var mykey = crypto.createCipher('aes-128-cbc', 'mypassword');
            var mystr = mykey.update(obj, 'utf8', 'hex')
            mystr += mykey.final('hex');
            console.log(mystr);

            // resetPassword: JSON.stringify({
            //     token: mystr, 
            //     expires: Date.now() + 86400000
            // })

            await user.update({
                resetPassword: mystr
            }, { where: { email } })
            .then((data) => {
                sgMail.setApiKey('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');
                const msg = {
                    to: checkUser.email,
                    from: 'pooja.naraharisetty@500apps.com',
                    subject: 'Reset Password',
                    html: `<div>
                      <h3>Dear `+ checkUser.name + `,</h3>
                      <p>You requested for a password reset, kindly use this <a href="http://localhost:4200/forgot-password/`+ mystr + `">link</a> to reset your password</p>
                      <br>
                      <p>Cheers!</p>
                  </div>`,
                };
                sgMail.send(msg, (err, data) => {
                    if (!err) {
                        return res.json({ message: 'Kindly check your email for further instructions' });
                    } else {
                        return res.json({ message: 'Unable to Send email' });
                    }
                });
            });

        }

        else res.status(400).send({ error: "Email doesn't exist." });
    },

    resetPassword: async (req, res, next) => {

        var mykey = crypto.createDecipher('aes-128-cbc', 'mypassword');
        var mystr = mykey.update(req.body.key, 'hex', 'utf8')
        mystr += mykey.final('utf8');

        const tokenData = JSON.parse(mystr);
        
        const checkUser = await user.findOne({
            where: {
                id: tokenData.id,
                email: tokenData.email,
                resetPassword: req.body.key
              }            
        });

        if(checkUser && tokenData.expires >= Date.now()){
            await user.update({ password: req.body.password }, {
                where: {
                    id: tokenData.id, email: tokenData.email
                }
            });

            res.status(200).send({ message: 'Password Reseted Successfully' });
        }

        res.status(400).send({ message: 'Failed to Update Password' });
    }
}