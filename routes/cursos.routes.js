const { Router } = require('express');
const { check } = require('express-validator');

const { validarCampos } = require('../middlewares/validar-campos');
const { validarMaestro } = require('../middlewares/validar-rol');
const { cursoExiste } = require('../helpers/db-validators');
const {  validarToken } = require('../middlewares/validar-jwt');

const { cursoPost, cursoGet, cursoPut, cursoDelete } = require('../controllers/curso.controller');
const router = Router();


router.post(
    '/',
    [
        validarToken,
        validarMaestro,
        check("nombreCurso", "El nombre es obligatorio").not().isEmpty(),
        check("descripcion", "La descripción obligatoria").not().isEmpty(),
        check("nombreCurso").custom(cursoExiste),
        validarCampos,
    ], cursoPost
);

router.get(
    '/',
    [
        validarToken,
        validarCampos
    ], cursoGet
);

router.put(
    "/put",
    [
        validarToken,
        validarMaestro,
        check("nombreCurso", "El nombre es obligatorio").not().isEmpty(),
        check("descripcion", "La descripcion es obligatoria").not().isEmpty(),
        validarCampos
    ], cursoPut
);

router.delete(
    "/delete",
    [
        validarToken,
        validarMaestro,
        check("nombreCurso").not().isEmpty(),
        validarCampos
    ], cursoDelete
);

module.exports = router;