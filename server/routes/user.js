const express = require('express');

const bcrypt = require('bcrypt');
const User = require('../models/user');

const app = express();

app.get('/user', function(req, res) {
    res.json('get user');
})

app.post('/user', function(req, res) {
    let body = req.body;

    let encriptedPassword = '';

    if (body.password) {
        encriptedPassword = bcrypt.hashSync(body.password, 10);
    }

    let user = new User({
        name: body.name,
        email: body.email,
        password: encriptedPassword,
        role: body.role
    });

    user.save((err, userDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        //userDB.password = null;

        res.json({
            ok: true,
            user: userDB
        })

    });
})

app.put('/user/:id', function(req, res) {
    let id = req.params.id;

    res.json({
        id
    });
})

app.delete('/user', function(req, res) {
    res.json('delete user');
})


module.exports = app;