const express = require('express');
const fileUpload = require('express-fileupload');
const fs = require('fs');
const path = require('path');

const User = require('../models/user');
const Product = require('../models/product');

const app = express();

app.use(fileUpload({ useTempFiles: true }));

/**
 * Delete image from uploads folder.
 * @param {String} type users or products folder
 * @param {String} imgName name of the image in folder.
 */
const deleteImage = (type, imgName) => {
    let imagePath = path.resolve(__dirname, `../../uploads/${type}/${imgName}`);
    if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
    }
}

/**
 * Update image in database
 * @param {String} id user or product id 
 * @param {String} fileName name of the image
 * @param {String} model User or Product model of Mongoose.
 */
let changeModelImage = async(id, fileName, model) => {
    let modelDB,
        routeUploads;

    if (model === "User") {
        routeUploads = 'users';

        modelDB = await User.findById(id).catch((err) => {
            throw err;
        });
    } else {
        routeUploads = 'products';

        modelDB = await Product.findById(id).catch((err) => {
            throw err;
        });
    }

    if (!modelDB) {
        throw `${model} does not exist`;
    }

    let oldImage = modelDB.img;
    modelDB.img = fileName;

    let newModel = modelDB.save().catch((err) => {
        throw err;
    });

    deleteImage(routeUploads, oldImage);

    return newModel;
}

/**
 * Upload image for products or users.
 */
app.put('/upload/:type/:id', async function(req, res) {
    if (!req.files) {
        return res.status(400)
            .json({
                ok: false,
                err: {
                    message: "No file were uploaded"
                }
            });
    }

    let type = req.params.type.toLowerCase(),
        id = req.params.id,
        validTypes = ['products', 'users'];

    // Type validation 
    if (!validTypes.includes(type)) {
        return res.status(400)
            .json({
                ok: false,
                err: {
                    type,
                    message: `Valid types: ${validTypes.join(', ')}`
                }
            });
    }


    let validExtensions = ['png', 'jpg', 'jpeg', 'gif'],
        file = req.files.file,
        fileNameArray = file.name.split('.'),
        fileExtension = fileNameArray[fileNameArray.length - 1].toLowerCase();

    // Extension validation
    if (!validExtensions.includes(fileExtension)) {
        return res.status(400)
            .json({
                ok: false,
                err: {
                    ext: fileExtension,
                    message: `Valid extensions: ${validExtensions.join(', ')}`
                }
            });
    }

    // Change file name to prevent cache
    let fileName = `${id}-${new Date().getMilliseconds()}.${fileExtension}`,
        newUser,
        newProduct;

    if (type === 'users') {
        newUser = await changeModelImage(id, fileName, 'User').catch((err) => {
            res.status(403).json({
                ok: false,
                err
            });

            return false;
        });
    } else {
        newProduct = await changeModelImage(id, fileName, 'Product').catch((err) => {
            res.status(403).json({
                ok: false,
                err
            });

            return false;
        });
    }

    //Save file in folder.
    if (newUser || newProduct) {
        file.mv(`uploads/${type}/${fileName}`, (err) => {
            if (err) {
                return res.status(500)
                    .json({
                        ok: false,
                        err
                    });
            }

            res.json({
                ok: true,
                message: 'File uploaded correctly',
                image: fileName
            });
        });
    }
});

module.exports = app;