const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const Schema = mongoose.Schema;

validateValidDescription = (description) => (description.length) < 4 ? false : true;

let categorySchema = new Schema({
    description: {
        type: String,
        unique: true,
        required: [true, "Description is necessary"],
        validate: [validateValidDescription, "It is not a valid description. Minimum four characters"],
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
});

categorySchema.plugin(uniqueValidator, {
    message: '{PATH} must be unique.'
});

module.exports = mongoose.model('Category', categorySchema);