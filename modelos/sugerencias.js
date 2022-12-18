let mongoose = require('mongoose');

const { Schema } = mongoose;

const sugerenciaSchema = new Schema({
    sugerencia: String,
});

const Sugerencia = mongoose.model('Sugerencia', sugerenciaSchema)

module.exports = Sugerencia;                                                                                                                    