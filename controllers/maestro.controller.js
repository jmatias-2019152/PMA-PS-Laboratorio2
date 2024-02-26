const { json } = require('express');
const Maestro = require('../models/maestro');
const bcryptjs = require('bcryptjs');

const maestroPost = async (req, res) => {
 
    const { correo, password, nombre } = req.body;
    const maestro = new Maestro({correo, password, nombre});

    const salt = bcryptjs.genSaltSync();
    maestro.password = bcryptjs.hashSync(password, salt);

    await maestro.save();
    res.status(200).json({
        maestro
    });

};

module.exports = {
    maestroPost
};