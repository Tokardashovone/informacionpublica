let mongoose = require('mongoose');

const { Schema } = mongoose;

const tituloSchema = new Schema({
    nombre: String,
    titulo : String, 
    categoria : String, 
    comentarios: [String],
    link : String,
    creado: Date
});

const Titulo = mongoose.model('Titulo', tituloSchema)

module.exports = Titulo;                                                                                                                    