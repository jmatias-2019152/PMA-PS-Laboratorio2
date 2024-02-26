const { Schema, model } = require('mongoose')

const EstudianteSchema = Schema ({

    correo: {
        type: String,
        required: [ true, "El correo es obligatorio"]
    },

    password: {
        type: String,
        required: [ true, "La contraseña es obligatoria"]
    }, 

    nombre: {
        type: String,
        required: [ true, "El nombre es obligatorio"]
    },

    rol:{
        type: String,
        required: true,
        default: "STUDENT_ROLE"
    },
    
    cursos: {
        type: Array,
        default : 'Vacio'
    },

    estado: {
        type: Boolean,
        default: true
    }


});

module.exports = model('Estudiante', EstudianteSchema);