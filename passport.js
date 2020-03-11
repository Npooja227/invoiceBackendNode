const passport = require('passport');
const JWTStrategy = require('passport-jwt').Strategy;
const ExtractJWT  = require('passport-jwt').ExtractJwt;
const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const GitHubStrategy = require('passport-github').Strategy;
const LinkedInStartegy = require('passport-linkedin-oauth2').Strategy;

var db = require('./config');

//const user = require('./models/user');
const Sequelize = require('sequelize');
let sequelize = require('./config');
const Usermodel  = require('./models/user');
const user = Usermodel(sequelize,Sequelize);

const JWT_SECRET = 'DA693C13E7C5528473D915EB827EC';

//check if given token is valid
passport.use(new JWTStrategy({

    jwtFromRequest: ExtractJWT.fromExtractors([ExtractJWT.fromAuthHeaderAsBearerToken(), ExtractJWT.fromHeader('token')]),
    secretOrKey: JWT_SECRET
}, async (payload, done) => {

    try{
        //check if user exists by specific id
        const checkUser = await user.findOne({ 
            where: {
                id: payload.user_id,
                email: payload.email
            }
        });

        //If user doesn't exist, handle it
        if (!checkUser) return done(null, false);

        //otherwise, return the user
        done(null, checkUser);
    }catch(error){
        done(error, false);
    }
}));


//Local Strategy for Login
passport.use(new LocalStrategy({

    usernameField: 'email'

}, async (email, password, done) => {

    try{
         //check if user exists by email
         const User = await user.findOne({
            where: {
              email: email
            }
          });

         //If user doesn't exists, handle it
         if (!User) return done(null, false);

         //Check If the password is correct
         const isMatch = await User.validPassword(password);
         
         //If not, Handle it
         if (!isMatch) return done(null, false);

         //Otherwise, return the user
         done(null, User);

    }catch(error){
        done(error, false);
    }
}));


//Google Passport Strategy for Google OAuth 2.0
passport.use(new GoogleStrategy({
    clientID: '339491989796-g2e8ail1flkcsc3d8d5sn0nlaif806kr.apps.googleusercontent.com',
    clientSecret: 'xgM1vAwUh_85IlUiPR8q9IlC',
    callbackURL: 'https://invoicep.stackblitz.io/auth/google/callback'
}, async (accessToken, refreshToken, profile, done) => {

    try{
         //Check if user exists by email
         const existingUser = await user.findOne({
             where: {
                 email: profile.emails[0].value
             }
         });

         //If user already existing
         if(existingUser){
             const checkUser = await user.findOne({
                 where: {
                    email: profile.emails[0].value,
                    password: profile.id,
                    provider: 'google'
                 }
             });

            if (checkUser) return done(null, existingUser);
            else return done(null, false);
         }

         //If new account
         const newUser = {
            name: profile.displayName,
            email: profile.emails[0].value,
            provider: 'google',
            password: profile.id,
            image: profile.photos[0].value
         };

         await user.create(newUser);

         done(null, newUser);

    }catch(error){
        done(error, false, error.message);
    }

}));


//Facebook Passport Strategy for Facebook OAuth
passport.use(new FacebookStrategy({
    clientID: '763996940767820',
    clientSecret: '091f7630996bc242bc5e9f6286343e57',
    callbackURL: 'https://invoicep.stackblitz.io/auth/facebook/callback',
    profileFields: ['id', 'displayName', 'photos', 'email']
}, async(accessToken, refreshToken, profile, done) => {

    try{
        //Check if user exists by email
        const existingUser = await user.findOne({
            where: {
                email: profile.emails[0].value
            }
        });

        //If user already existing
        if(existingUser){
            const checkUser = await user.findOne({
                where: {
                    email: profile.emails[0].value,
                    provider: 'facebook',
                    password: profile.id
                }
            });

            if(checkUser) return done(null, existingUser);
            else return done(null, false);
        }

        //If new account
        var newUser = {
            name: profile.displayName,
            email: profile.emails[0].value,
            provider: 'facebook',
            password: profile.id,
            image: profile.photos[0].value
         }

         await user.create(newUser);

        //Otherwise, return the user
        done(null, newUser);

    }catch(error){
        done(error, false, error.message)
    }
}));


//GitHub Passport Strategy for GitHub OAuth
passport.use(new GitHubStrategy({
    clientID: 'b39ef72675dfca7cda16',
    clientSecret: '297c004a3301fc41d5e648a3c72ca26e1dd95e90',
    callbackURL: "https://invoicep.stackblitz.io/auth/github/callback",
    scope: 'user:email'
}, async (accessToken, refreshToken, profile, done) => {

    try{
        //Check if user exists by email
        const existingUser = await user.findOne({
            where: {
                email: profile.emails[0].value
            }
        });

        //If user already existing
        if(existingUser){
            const checkUser = await user.findOne({
                where: {
                    email: profile.emails[0].value,
                    provider: 'github',
                    password: profile.id
                }
            });

            if(checkUser) return done(null, existingUser);
            else return done(null, false);
        }

        //If new account
        var newUser = {
            name: profile.displayName,
            email: profile.emails[0].value,
            provider: 'github',
            password: profile.id,
            image: profile.photos[0].value
         }

         await user.create(newUser);

        //Otherwise, return the user
        done(null, newUser);

    }catch(error){
        done(error, false, error.message)
    }
}));


//LinkedIn Passport Strategy for LinkedIn OAuth
passport.use(new LinkedInStartegy({
    clientID: '81bp1qmf3vrwsn',
    clientSecret: 'UGZ00oVmEQWIDqYw',
    callbackURL: "https://invoicep.stackblitz.io/auth/linkedin/callback",
    scope: ['r_liteprofile', 'r_emailaddress']
}, async (accessToken, refreshToken, profile, done) => {

    try{
        //Check if user exists by email
        const existingUser = await user.findOne({
            where: {
                email: profile.emails[0].value
            }
        });

        //If user already existing
        if(existingUser){
            const checkUser = await user.findOne({
                where: {
                    email: profile.emails[0].value,
                    provider: 'linkedin',
                    password: profile.id
                }
            });

            if(checkUser) return done(null, existingUser);
            else return done(null, false);
        }

        //If new account
        var newUser = {
            name: profile.displayName,
            email: profile.emails[0].value,
            provider: 'linkedin',
            password: profile.id,
            image: profile.photos[0].value
         }

         await user.create(newUser);

        //Otherwise, return the user
        done(null, newUser);

    }catch(error){
        done(error, false, error.message)
    }
}));