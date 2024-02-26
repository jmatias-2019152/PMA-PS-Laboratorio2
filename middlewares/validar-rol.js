const jwt = require('jsonwebtoken');
const Maestro = require('../models/maestro');
const Estudiante = require('../models/estudiante');

const validarUsuario = async (req, res, next, rol) => {
    const token = global.tokenAcces;
    try {
        const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);
        let user;

        if (rol === 'TEACHER_ROLE') {
            user = await Maestro.findById(uid);
            if (!user) {
                return res.status(401).json({
                    msg: "Solo los maestros pueden realizar esta accion"
                });
            }
        } else if (rol === 'STUDENT_ROLE') {
            user = await Estudiante.findById(uid);
            if (!user) {
                return res.status(401).json({
                    msg: "Solo los alumnos pueden realizar esta accion"
                });
            }
        }

    } catch (e) {
        return res.status(400).json({
            msg: "Ocurrio un error inesperado"
        });
    }

    next();
};


const validarMaestro = async (req, res, next) => {
    await validarUsuario(req, res, next, 'maestro');
};


const validarAlumno = async (req, res, next) => {
    await validarUsuario(req, res, next, 'alumno');
};

module.exports = {

    validarAlumno,
    validarMaestro

}