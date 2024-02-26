const jwt = require("jsonwebtoken");
const Maestro = require('../models/maestro');
const Curso = require('../models/curso');
const Estudiante = require('../models/estudiante');


const cursoPost = async (req, res = "") => {
    const { nombreCurso, descripcion } = req.body;
    const token = global.tokenAcces;
    try {
        const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);
        const maestro = await Maestro.findById(uid);
        const correo = maestro.correo;
        const curso = new Curso({ nombreCurso, descripcion, correo});
        await curso.save();
    } catch (e) {
        console.log(e);
        return res.status(400).json({
            msg: "Ocurrio un error inesperado"
        });
    }

    res.status(200).json({
        msg: "Curso Creado"
    });
};

const cursoGet = async ( req, res ) => {
    try {
        const token = global.tokenAcces;
        const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);
        const maestro = await Maestro.findById(uid);
        var cursos = [];

        if (!maestro) {
            const estudiante = await Estudiante.findById(uid);
            const estuCursos = estudiante.cursos;

            if (estuCursos === 'Vacio') {
                return res.status(400).json({
                    msg: "No te encuentras asignado a ningún curso"
                });
            }

            for (const element of estuCursos) {
                const query = { nombre: element, estado: true };
                const curso = await Curso.findOne(query);

                if (curso) {
                    const { nombreCurso, descripcion, correo } = curso;
                    cursos.push({ nombreCurso, descripcion, correo });
                }
            }
        } else {
            const maestroc = maestro.correo;
            const query = { correo: maestroc, estado: true };

            cursos = await Curso.find(query);
        }

        if (cursos.length === 0) {
            cursos = ['No hay cursos'];
        }

        return res.json({
            msg: `Estos son sus cursos`,
            cursos
        });
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            msg: "Ocurrió un error inesperado"
        });
    }
};


const cursoPut = async (req, res) => {
    const { nombreCurso, nuevoNombre, descripcion } = req.body;
    const token = global.tokenAcces;
    const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);
    const maestro = await Maestro.findById(uid);
    var bandera = false;
    var curso = '';
    const cursos = await Curso.findOne({ correo: maestro.correo, estado: true, nombreCurso: nombreCurso });
    if (!cursos) {
        return res.status(400).json({
            msg: "El curso no existe"
        });
    } else {
        const estudiante = await Estudiante.find({ estado: true });
        for (const element of estudiante) {
            var contador = -1;
            var bandera = false;
            var cursosEstudiante = '';
            cursosEstudiante = element.cursos;
            for (var cursoE of cursosEstudiante) {
                contador++;
                if (cursoE == cursos.nombre) {
                    bandera = true;

                }
            }
            if (contador !== 0 && bandera == true) {
                bandera = false;
                cursosEstudiante[contador] = nuevoNombre;
                await Student.findByIdAndUpdate(element._id, { cursos: cursosEstudiante });
            }
        }
        await Curso.findByIdAndUpdate(cursos._id,
            {
                nombreCurso: nuevoNombre,
                descripcion: descripcion
            });
    }
    res.status(200).json({
        msg: "Actualziado con exito!",
    });
};

const cursoDelete = async (req, res) => {
    const { nombreCurso } = req.body;
    const token = global.tokenAcces;
    const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);
    const maestro = await Maestro.findById(uid);
    var bandera = false;

    const cursos = await Curso.find({ correo: maestro.correo, estado: true });
    cursos.forEach(element => {
        if (element.nombreCurso == nombreCurso) {
            bandera = true;
        }
    });

    if (!bandera) {
        return res.status(400).json({
            msg: "Este curso No existe "
        });
    } else {
        await Curso.updateOne({ correo: maestro.correo, nombreCurso: nombreCurso }, { estado: false });
        res.status(200).json({
            msg: "Curso Eliminado"
        });
    }

}


module.exports = {
    cursoPost,
    cursoGet,
    cursoPut,
    cursoDelete
}
