const { Schema, model } = require('mongoose');

const MaestroSchema = Schema({
 
    correo: {
        type: String,
        required: [true, 'El correo es obligatorio']
    },
    password: {
        type: String,
        required: [true, 'La contraseña es obligatoria']
    },
    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio']
    },
    rol: {
        type: String,
        required: true,
        default: 'TEACHER_ROLE'
    },
    estado: {
        type: Boolean,
        default: true
    }

});
 
module.exports = model('Maestro', MaestroSchema);