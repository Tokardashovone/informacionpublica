let mongoose = require('mongoose');

const { Schema } = mongoose;

const tituloSchema = new Schema({
    nombre: String,
    titulo : String,
    descripcion : String, 
    categoria : String, 
    comentarios: [String],
    link: String,
    fecha: String
});

const Titulo = mongoose.model('Titulo', tituloSchema)

module.exports = Titulo;                                                                                                                    