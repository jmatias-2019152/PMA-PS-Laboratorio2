const jwt = require('jsonwebtoken');
const Maestro = require('../models/maestro');
const Estudiante = require('../models/estudiante');

const validarToken = async (req, res, next) => {
    const token = global.tokenAcces;

    if (!token) {
        return res.status(401).json({
            msg: "Iniciar sesion para poder continuar con esta funcion"
        })
    }

    try {

        const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);

        try {
            const maestro = await Maestro.findById(uid);
            const estudiante = await Estudiante.findById(uid);

            let user;

            if (maestro) {
                user = maestro;
            } else if (estudiante) {
                user = estudiante;
            } else {
                return res.status(401).json({
                    msg: "Usuario no existe en la base de datos",
                });
            }

            if (!user.estado) {
                return res.status(401).json({
                    msg: `Token no válido - ${user.constructor.modelName} esta inhabilitado`,
                });
            }

            next();
        }finally{}
    } catch (e) {
        console.log(e),
            res.status(401).json({
                msg: "Token no válido",
            });
    }

};

module.exports = {
    validarToken
}