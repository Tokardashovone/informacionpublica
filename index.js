const express = require('express');
const app = express();
const fileupload = require('express-fileupload');
const FileController = require('./controller/FileController');
const fileController = new FileController();
const path = require('path');
const fs = require('fs');
//Conectarnos a la base de datos
let mongoose = require('mongoose');

//Requerimos nuestro modelo de título
let tituloComentarios = require('./modelos/titulos'); 
let Sugerencia = require('./modelos/sugerencias')


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



app.use(express.json());
app.use(express.static("public"));
app.use(fileupload());


app.post('/subir-archivo', fileController.subirArchivo);
app.post('/titulo', (req,res) => {


    try {
        let nombre = req.body.nombre;
        let titulo = req.body.titulo;
        let categoria = req.body.categoria;

        nuevoTituloComentarios = new tituloComentarios({
            nombre,
            titulo,
            categoria,
            comentarios : [], 
            link : `http://127.0.0.1:3000/publicaciones/${req.files.archivo.name}`,
            creado: new Date()
        })

        nuevoTituloComentarios.save( err => {
            if (err) throw err;
            console.log('Titulo satisfactoriamente agregado a la colleción titulos');
        });

        res.send(nuevoTituloComentarios);
       
        
    } catch (error) {
        console.log(error);
    }
   

});


app.get('/biblioteca',(req,res) => {

    tituloComentarios.find({}).exec((err,titulos) => {
        if (err) throw err;
        console.log(titulos);
        return res.send({titulos});
    });

});

app.get('/publicacion',(req,res) => {
    
   const {nombre,titulo,categoria,link,creado} = req.query;
    
    console.log(`Nombre = ${nombre}, titulo = ${titulo}, categoria = ${categoria}, link = ${link} y creado en ${creado}.`);

        res.status(200).sendFile(path.join(__dirname, 'public/publicacion.html')); 
        res.json(req.query)
    

});


app.post('/sugerencias', (req,res) => {
   
        let sugerencia = req.body.sugerencia
               
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
app.get('/sugerenciasLista', (req,res) => {
        
    Sugerencia.find({}).exec((err,sugerencias) => {
            if (err) throw err;
            console.log(sugerencias);
            return res.send({sugerencias});
        });
        
    })



app.listen(3000, () => {
    console.log('Servidor escuchando en el puerto 3000');
});

module.exports = app;