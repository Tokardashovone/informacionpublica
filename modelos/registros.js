let mongoose = require('mongoose');

const { Schema } = mongoose;

const registroSchema = new Schema({
  direccion_publica: String,
  validado: Boolean
});

const Registro = mongoose.model('Registro', registroSchema)

module.exports = Registro;
