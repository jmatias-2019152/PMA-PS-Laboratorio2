const bcryptjs = require('bcryptjs');
const Maestro = require('../models/maestro');
const Estudiate = require('../models/estudiante');

const { generarJWT } = require('../helpers/generar-jwt');

const loginGet = async (req, res) => {
    const { correo, password } = req.body;
    const query = { estado: true };

    const [estudiante, maestro] = await Promise.all([
        Estudiate.find({ ...query, correo }),
        Maestro.find({ ...query, correo })
    ]);

    let user;
    let log;

    for (const element of estudiante) {
        if (await bcryptjs.compare(password, element.password)) {
            user = element;
            log = 'estudiante';
            break;
        }
    }

    if (!user) {
        for (const element of maestro) {
            if (await bcryptjs.compare(password, element.password)) {
                user = element;
                log = 'maestro';
                break;
            }
        }
    }

    if (user) {
        const token = await generarJWT(user._id);
        global.tokenAcces = token;

        return res.status(200).json({
            msg:
                `---------- Se inicio sesion como ${log} ----------
                 ------------------- BIENVENIDO -------------------
                 ------------------ Token Creado ------------------`
        });
    }

    return res.status(400).json({
        msg: 'ALGUNO DE LOS DATOS NO ES CORRECTO'
    });
};

module.exports = {
    loginGet
} 