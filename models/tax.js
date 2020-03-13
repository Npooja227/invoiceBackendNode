module.exports = function (sequelize, DataTypes) {

    var tax = sequelize.define('tax', {

        user_id: {
            type: DataTypes.INTEGER(10),
            allowNull: false
        },

        name: {
            type: DataTypes.STRING(250),
            allowNull: false
        },

        deposit_type: {
            type: DataTypes.STRING(20)
        },

        tax_rate: {
            type: DataTypes.INTEGER(20)
        }

    }, { freezeTableName: true });

    return tax;
}