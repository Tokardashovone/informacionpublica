const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const {Server} = require("socket.io");
const io = new Server(server);
const fileupload = require('express-fileupload');
const FileController = require('./controller/FileController');
const fileController = new FileController();
const path = require('path');
const hbs = require('hbs');
const cors = require('cors');
const fs = require('fs');

//Middelware necesarios
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname,"public")));
app.use(fileupload());

//Conectarnos a la base de datos
let mongoose = require('mongoose');

//Requerimos nuestro modelo de título
let tituloComentarios = require('./modelos/titulos'); 
let Sugerencia = require('./modelos/sugerencias');
let Registro = require('./modelos/registros');


const options = {
    autoIndex: false,
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 5000, 
    socketTimeoutMS: 45000,
    family: 4
}


mongoose.set('strictQuery', true);
mongoose.connect('mongodb://localhost:27017/informacion', options, (err) => {
    if (err) throw err;
    console.log('Conexión satisfactoria a la base de datos');
});

//******INICIO SOCKET */

//Variables necesarias
let arrayUsuarios = [];


io.on('connection', (socket) => {

    //Recibimos el registro de un usuario y lo añadimos a los usuarios conectados
    //Mandamos los usuarios conectados a los socket
    socket.on('registroUsuario', (usuario) => {
        
        arrayUsuarios.push(usuario);
        console.log(arrayUsuarios);
        io.emit('usuarios', arrayUsuarios);

    
    });

   
    //Recibimos los mensajes del chat
    //Mandamos el mensaje a los socket
    socket.on('enviarMensaje', (mensaje, dequien, aquien) => {
        console.log('mensaje: ', mensaje);
        console.log('dequien: ', dequien);
        console.log('aquien: ', aquien);    
        
        if (aquien.room == 'General'){
            io.emit('mensaje', mensaje, dequien, aquien);
        }else{
            io.to(aquien.id).to(dequien.id).emit('mensaje', mensaje, dequien, aquien);
        }
    });
    

    //Evento de desconexión de un socket 
    socket.on('disconnect', () => {
        let desconectado = arrayUsuarios.find(e => e.id == socket.id);
        arrayUsuarios = arrayUsuarios.filter(e => e !== desconectado);
        console.log(desconectado);
        console.log(arrayUsuarios);
        io.emit('usuarios', arrayUsuarios);

    });


});

//******FIN SOCKET */


//Configuración motor de plantilla
hbs.registerPartials(__dirname + '/views/partials');

//Handlebars
app.set('view engine', 'hbs');
app.set('views', __dirname + "/views");

//Rutas
app.get('/', (req,res) => {
    res.status(200).render("index")
})

app.get('/publicar', (req,res) => {
    res.status(200).render("publicar")
})

app.get('/sugerencias', (req,res) => {
    res.status(200).render("sugerencias")
})

app.get('/chat', (req,res) => {
    res.status(200).render("chat")
})

app.get('/loteria', (req,res) => {
    res.status(200).render("loteria")
})

app.post('/subir-archivo', fileController.subirArchivo);
app.post('/titulo', (req,res) => {
    
        let nombre = req.body.nombre;
        let titulo = req.body.titulo;
        let categoria = req.body.categoria;
        let descripcion = req.body.descripcion;
        let mimetype = req.files.archivo.mimetype;
        let f = new Date();
        let fecha = f.getDate() + "/" + (f.getMonth() +1) + "/" + f.getFullYear();
         
        if (mimetype == 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || 
        mimetype == 'application/rtf' || 
        mimetype == 'application/vnd.oasis.opendocument.text' || 
        mimetype == 'application/msword' ||
        mimetype ==  'application/msword' ||
        mimetype == 'text/plain'){

            let nuevoTituloComentarios = new tituloComentarios({
                nombre,
                titulo,
                categoria,
                descripcion,
                comentarios : [], 
                link : `http://127.0.0.1:3000/publicaciones/${req.files.archivo.name}`,
                fecha 
            })
            
            nuevoTituloComentarios.save( err => {
                if (err) throw err;
            });
            
            res.send(nuevoTituloComentarios);

        }else{
            console.log('No se ha podido guardar');
        }   
    
});


app.get('/biblioteca',(req,res) => {
    
    tituloComentarios.find({}).exec((err,titulos) => {
        if (err) throw err;
        return res.status(200).render("biblioteca", {titulos})
    });   
});

app.get('/publicacion',(req,res) => {


    const {nombre,titulo,categoria,descripcion,link,fecha} = req.query;

    res.status(200).render('publicacion', {nombre,titulo,categoria,descripcion, link, fecha} )
          
})


app.post('/sugerencias', (req,res) => {
    
    
    try {
        let sugerencia = req.body.sugerencia;
        
        
        let nuevaSugerencia = new Sugerencia({
            sugerencia,
        })
        
        nuevaSugerencia.save( err => {
            if (err) throw err;
        });
        
        return res.status(200).send(
            {mensaje: "sugerencia añadida satisfactoriamente"}
            
            )             
            
        } catch (error) {
            console.log(error);
        }
    });

app.post('/registrar', (req,res) => {
    let direccion_publica = req.body.direccion_publica

   
    let nuevoRegistro = new Registro({
        direccion_publica,
        validado: false
    });

    nuevoRegistro.save( (err) => {
        if (err) throw err;
    });

    return res.status(200).send(
        {mensaje: "dirección pública añadida satisfactoriamente"}
        
        )   
    

})

app.put('/comentarios/:titulo', (req, res) => {
    let titulo = req.params.titulo;
    let comentario = req.body.comentario;


    tituloComentarios.findOneAndUpdate({titulo:titulo}, {"$push":{comentarios:comentario}},
    (err,data)=>{
        if(err){console.log(err)};
        console.log('actualizado satisfactoriamente');
    });

})

app.get('/comentariosLista/:titulo', (req,res) => {
    let titulo = req.params.titulo;
    tituloComentarios.find({titulo:titulo}).exec((err, comentarios) => {
        if (err) throw err;
        return res.send({comentarios});
    })
})

app.get('/sugerenciasLista', (req,res) => {
        
        Sugerencia.find({}).exec((err,sugerencias) => {
            if (err) throw err;
            return res.send({sugerencias});
        });
        
    })

app.get('/registros', (req,res) => {
    Registro.find({}).exec((err,registros) => {
        if (err) throw err;
       
        return res.send({registros});
    })
})

app.get('/novedades', (req,res) => {
    res.status(200).render('novedades');
})
    
    
//pagina no encontrada
app.get('/publicaciones/*', (req,res) => {
    res.status(404).render("publicaciones", {
        titulo: "Pendiente",
        descripcion: 'Artículo pendiente de revisión'
    })
})

app.get('/Telegram', (req,res) => {
    res.status(404).send("<h1>Red social pendiente de creación</h1>")
})

app.get('/discord', (req,res) => {
    res.status(404).send("<h1>Red social pendiente de creación</h1>")
})

app.get('/twitter', (req,res) => {
    res.status(404).send("<h1>Red social pendiente de creación</h1>")
})

app.get('*', (req,res) => {
    res.status(404).render("404", {
        titulo: "404",
        descripcion: 'Página no encontrada'
    })
})


server.listen(3000, () => {
    console.log('Servidor escuchando en el puerto 3000');
});

module.exports = app;