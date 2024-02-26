const express = require('express');
const cors = require('cors');
const { dbConnection } = require('../db/config');


class Server{

    constructor(){
        this.app = express();
        this.port = process.env.PORT;
        this.estudiantePath = '/api/estudiantes';
        this.maestroPath = '/api/maestros';
        this.loginPath = '/api/login';
        this.cursoPath = '/api/cursos';

        this.middlewares();
        this.conectarDB();
        this.routes();
        global.sesion = "";
    }

    async conectarDB(){
        await dbConnection();
    }
    
    middlewares(){
        this.app.use(express.static('public')),
        this.app.use(cors()); 
        this.app.use(express.json());
    }

    routes(){
        this.app.use(this.estudiantePath, require('../routes/estudiante.routes'));
        this.app.use(this.maestroPath, require('../routes/maestro.routes'))
        this.app.use(this.loginPath, require('../routes/login.routes'));
        this.app.use(this.cursoPath, require('../routes/cursos.routes'))
    }

    listen(){
        this.app.listen(this.port, () => {
            console.log('Servidor ejecutado y escuchando en el puerto', this.port);
        });
    }
}


module.exports = Server;