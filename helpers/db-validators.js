const express = require('express')
const Curso = require('../models/curso');


const existeEmail = async (correo = '',modelo) => {
    const existeEmail = await modelo.findOne({correo});
    if(existeEmail){
        throw new Error('El correo ya fue registrado')
    }
}

const cursoExiste = async (nombreCurso = '') => {
    var cursoExiste = await Curso.findOne({ nombreCurso });
    if (cursoExiste) {
        throw new Error('El curso ya fue creado');
    }
}


module.exports = {
    existeEmail,
    cursoExiste
}