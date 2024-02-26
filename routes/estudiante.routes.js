const { Router } = require('express');
const { check } = require('express-validator');

const { validarCampos } = require('../middlewares/validar-campos');
const { validarAlumno, validarMaestro } = require('../middlewares/validar-rol');
const { existeEmail } = require('../helpers/db-validators');
const {  validarToken } = require('../middlewares/validar-jwt');

const { estudiantePost, estudiantePut, estudianteGet, deleteEstudiante, asignarCursoPut } = require('../controllers/estudiante.controller');
const Estudiante = require('../models/estudiante');
const router = Router();


router.get("/get", estudianteGet);

router.post(
    "/", 
    [
        check("correo", "El correo es obligatorio").not().isEmpty(),
        check("password", "La contraseña es obligatoria y debe ser mayor a 6 caracteres").isLength({min: 6},),
        check("nombre", "El correo es obligatorio").not().isEmpty(),
        check("correo").custom((value) => existeEmail(value, Estudiante)),
        validarCampos
    ],estudiantePost
);

router.put(
    "/editar",
    [
        validarToken,
        validarAlumno,
        check("nombre", "El nombre es obligatorio").not().isEmpty(),
        check('password').isLength({ min: 6 }),
        validarCampos
    ], estudiantePut

);

router.put(
    '/cursos',
    [
        validarToken,
        check('nombreCurso').not().isEmpty(),
        validarAlumno,
        validarCampos
    ], asignarCursoPut
);

router.delete(
    "/delete",
    [
        validarToken,
        validarAlumno,
        check("correo", "El correo es obligatorio").not().isEmpty(),
        validarCampos
    ],
    deleteEstudiante
);

module.exports = router;