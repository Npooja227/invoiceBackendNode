var bcrypt = require('bcryptjs');
const DataTypes = require('sequelize');
let sequelize = require('../config');

module.exports = function (sequelize, DataTypes) {

    var user = sequelize.define("user", {

        name: {
            type: DataTypes.STRING(100),
            allowNull: false
        },

        email: {
            type: DataTypes.STRING(100),
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true
            }
        },

        password: {
            type: DataTypes.STRING(100),
            allowNull: false
        },

        provider: {
            type: DataTypes.STRING(10),
            allowNull: false
        },

        image: {
            type: DataTypes.STRING(250)
        },

        resetPassword: {
            type: DataTypes.STRING(250)
        }
    }, { freezeTableName: true });

    user.prototype.validPassword = function (password) {
        return bcrypt.compareSync(password, this.password);
    }

    user.beforeCreate(function (user) {

        if(user.dataValues.provider == 'password'){

            user.password = bcrypt.hashSync(user.password, bcrypt.genSaltSync(10), null);

        }
        
    });

    // user.beforeUpdate(function(user){
    //     console.log(user,"this");
    // });

    user.beforeBulkUpdate((user) => {

        if (user.attributes.password) {

            user.attributes.password = bcrypt.hashSync(user.attributes.password, bcrypt.genSaltSync(10), null);
        }
    });

    return user;
}