const { Router } = require('express');
const { check } = require('express-validator');


const { validarCampos } = require('../middlewares/validar-campos');
const { existeEmail } = require('../helpers/db-validators');

const { maestroPost } = require('../controllers/maestro.controller')

const Maestro = require('../models/maestro')
const router = Router();

router.post("/",
    [
        check("correo", "El correo es obligatorio").not().isEmpty(),
        check("password", "La contraseña es obligatoria y debe ser mayor a 6 caracteres").isLength({min: 6},),
        check("nombre", "El correo es obligatorio").not().isEmpty(),
        check("correo").custom((value) => existeEmail(value, Maestro)),
        validarCampos
    ],maestroPost
    
)

module.exports = router;

