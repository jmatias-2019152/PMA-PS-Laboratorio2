const Estudiante = require('../models/estudiante');
const Curso = require('../models/curso');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');

const estudianteGet = async (req, res = response ) => {
    const { limite, desde } = req.query;
    const query = { estado: true};

    const [total, estudiantes] = await Promise.all([
        Estudiante.countDocuments(query),
        Estudiante.find(query)
        .skip(Number(desde))
        .limit(Number(limite))
    ]);

    res.status(200).json({
        total,
        estudiantes
    });
} 

const estudiantePost = async (req, res) => {

    const { correo, password, nombre } = req.body;
    const estudiante = new Estudiante({ correo, password, nombre });

    const salt = bcryptjs.genSaltSync();
    estudiante.password = bcryptjs.hashSync(password, salt);

    await estudiante.save();
    res.status(200).json({
        estudiante
});
};

const asignarCursoPut = async (req, res) => {

    const { nombreCurso } = req.body;
    const token = global.tokenAcces;
    const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);
    const estudiante = await Estudiante.findById(uid);
    var cursosAlumno = [];
    cursosAlumno = estudiante.cursos;
    var cursosNuevo = '';

    const cursoAgregar = await Curso.findOne({ nombreCurso: nombreCurso, estado: true });

    if (!cursoAgregar) {
        return res.status(400).json({
            msg: "Ese curso no existe"
        });
    }

    if (cursosAlumno == 'Vacio') {
        cursosNuevo = nombreCurso;
        await Estudiante.findByIdAndUpdate(uid, { cursos: cursosNuevo });

    } else if (cursosAlumno.length < 3) {

        cursosNuevo = estudiante.cursos;

        for (const element of cursosNuevo) {

            if (element == nombreCurso) {
                return res.status(400).json({
                    msg: "Ya te encuentras asignado a ese curso"
                });
            }
        }

        cursosNuevo.push(nombreCurso);
        await Estudiante.findByIdAndUpdate(uid, { cursos: cursosNuevo });

    } else {
        return res.status(400).json({
            msg: "Solo se pueden asignar 3 cursos"
        });
    }

    res.status(200).json({
        msg: "Se agrego el curso "
    });

}

const estudiantePut = async (req, res) => {
    const { nombre, password } = req.body;
    const token = global.tokenAcces;
    const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);
    const salt = bcryptjs.genSaltSync();
    const contraseñaIncritada = bcryptjs.hashSync(password, salt);
    await Estudiante.findByIdAndUpdate(uid, { nombre: nombre, password: contraseñaIncritada });
    res.status(200).json({
        msg: "Los datos han sido acualizados"
    });

};

const deleteEstudiante = async (req, res) => {
    const { correo } = req.body;
    const token = global.tokenAcces;
    try {
        const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);
        const estudiante = await Estudiante.findById(uid);
        if (estudiante.correo === correo) {
            await Estudiante.findByIdAndUpdate(uid, { estado: false });
            global.tokenAcces = '';
            res.status(200).json({
                msg: "Perfil Eliminado "
            });
        } else {
            res.status(200).json({
                msg: "El correo no es el correcto"
            });
        }
    } catch (e) {
        console.error(e);
        res.status(400).json({
            msg: "Ocurrió un error inesperado"
        });
    }
};

module.exports = {
    estudianteGet,
    estudiantePost,
    asignarCursoPut,
    estudiantePut,
    deleteEstudiante
};





