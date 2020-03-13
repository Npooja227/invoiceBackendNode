const Sequelize = require('sequelize');
let sequelize = require('../config');

const client = require('../models/client')(sequelize, Sequelize);
const address = require('../models/address')(sequelize, Sequelize);
const product = require('../models/product')(sequelize, Sequelize);
const tax = require('../models/tax')(sequelize, Sequelize);

// address.belongsTo(client, {foreignKey: 'billing_id'});

getSchema = (schema) => {
    if(schema == 'client') return client;
    else if(schema == 'address') return address;
    else if(schema == 'product') return product;
    else if(schema == 'tax') return tax;
}

module.exports = {

    get_data: async(req, res, next) => {

        var schema = await getSchema(req.params.table_name);

        var obj = {};

        if(JSON.stringify(req.query).includes('id')) {
            obj['where'] = {};
            obj['where']['id'] = req.query.id.split(',');
        }

        const data = await schema.findAll(obj);

        //Send response
        res.status(200).send(data);
    },

    post_data: async(req, res, next) => {

        var schema = await getSchema(req.params.table_name);

        const data = await schema.create(req.body);

        //Send response
        res.status(201).send({ message: req.params.table_name+" inserted successfully", data });
    },

    put_data: async(req, res, next) => {

        var schema = await getSchema(req.params.table_name);

        const data = await schema.update( req.body, { where: { id: req.params.id } } );

        res.status(200).send({ message: req.params.table_name+" updated successfully" });
    },

    delete_data: async(req, res, next) => {

        var schema = await getSchema(req.params.table_name);

        const data = await schema.destroy({ where: { id: req.query.id.split(',') }})

        res.status(200).send({ message: "Deleted " + req.params.table_name + "('s) successfully" });
    }

    // join_data: async(req, res, next) => {

    //     const data = client.findAll({
    //         include: [address]
    //     });

    //      //Send response
    //      res.status(200).send(data);
    // }
}