module.exports = (sequelize, DataTypes) => {

    var address = sequelize.define('address', {

        user_id: {
            type: DataTypes.INTEGER(10),
            allowNull: false
        },

        street1: {
            type: DataTypes.STRING(250),
            allowNull: false
        },

        street2: {
            type: DataTypes.STRING(250)
        },

        city: {
            type: DataTypes.STRING(250),
            allowNull: false
        },

        state: {
            type: DataTypes.STRING(250),
            allowNull: false
        },

        country: {
            type: DataTypes.STRING(250),
            allowNull: false
        },

        zipcode: {
            type: DataTypes.STRING(250),
            allowNull: false
        }
    }, { freezeTableName: true });

    return address;

}