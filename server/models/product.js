const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const Schema = mongoose.Schema;


let productSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Name is necessary'],
        unique: true
    },
    price: {
        type: Number,
        required: [true, 'Price is necessary']
    },
    description: {
        type: String,
        required: false
    },
    available: {
        type: Boolean,
        required: true,
        default: true
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
});

productSchema.plugin(uniqueValidator, {
    message: '{PATH} must be unique.'
});

module.exports = mongoose.model('Product', productSchema);