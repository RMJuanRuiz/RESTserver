const express = require('express');
const fs = require('fs');
const path = require('path');
const { verifyToken } = require('../middlewares/authentication');

const app = express();

app.get('/image/:type/:img', verifyToken, (req, res) => {
    let type = req.params.type.toLowerCase(),
        img = req.params.img,
        pathImg = path.resolve(__dirname, `../../uploads/${type}/${img}`),
        noImagePath = path.resolve(__dirname, '../assets/no-image.jpg');

    if (fs.existsSync(pathImg)) {
        res.sendFile(pathImg);
    } else {
        res.sendFile(noImagePath);
    }

});

module.exports = app;