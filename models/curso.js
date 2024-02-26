const { Schema, model } = require('mongoose');

const CursoSchema = Schema({

    nombreCurso: {
        type: String,
        required: [true, "El nombre del curso es obligatorio"]
    },

    descripcion: {
        type: String,
        required: [true, "Debe de tener una descripcion sobre el curso"]
    },

    correo: {
        type: String
    },

    estado: {
        type: Boolean,
        default: true
    }

});

module.exports = model('Curso', CursoSchema);