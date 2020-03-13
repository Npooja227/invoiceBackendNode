module.exports = function (sequelize, DataTypes) {

    var product = sequelize.define('product', {

        user_id: {
            type: DataTypes.INTEGER(10),
            allowNull: false
        },

        code: {
            type: DataTypes.STRING(50),
            allowNull: false
        },

        name: {
            type: DataTypes.STRING(250),
            allowNull: false
        },

        description: {
            type: DataTypes.STRING(20)
        },

        tax: {
            type: DataTypes.STRING(250)
        },

        unit_price: {
            type: DataTypes.INTEGER(20)
        }

    }, {
            indexes: [
                {
                    unique: true,
                    fields: ['user_id', 'code']
                }
            ]
        });

    return product;
}