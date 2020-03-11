module.exports = function (sequelize, DataTypes) {

    var client = sequelize.define('client', {

        user_id: {
            type: DataTypes.INTEGER(10),
            allowNull: false
        },

        name: {
            type: DataTypes.STRING(250),
            allowNull: false
        },

        email: {
            type: DataTypes.STRING(250),
            allowNull: false
        },

        phone: {
            type: DataTypes.STRING(20),
            allowNull: false
        },

        billing_id: {
            type: DataTypes.INTEGER(10)
        },

        shipping_id: {
            type: DataTypes.INTEGER(10)
        }, 

        company: {
            type: DataTypes.STRING(20)
        },

        language: {
            type: DataTypes.STRING(30)
        },

        currency: {
            type: DataTypes.STRING(30)
        },
        
        payment_method: {
            type: DataTypes.STRING(20)
        }

    }, {
            indexes: [
                {
                    unique: true,
                    fields: ['user_id', 'email']
                }
            ]
        });

    return client;
}