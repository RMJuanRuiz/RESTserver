const express = require('express');

const bcrypt = require('bcrypt');
const _ = require('underscore');

const User = require('../models/user');
const { verifyToken, verifyRole } = require('../middlewares/authentication');

const app = express();

app.get('/user', verifyToken, (req, res) => {

    let from = req.query.from > 0 ? Number(req.query.from - 1) : 0;
    let until = req.query.until > 0 ? Number(req.query.until) : 5;

    User.find({ status: true })
        .skip(from)
        .limit(until)
        .exec()
        .then(async(users) => {
            // Return total count of users in DB
            let count = await User.countDocuments({ status: true });

            res.json({
                ok: true,
                users,
                count
            });
        })
        .catch(err => {
            res.status(400).json({
                ok: false,
                err
            });
        });

})

app.post('/user', [verifyToken, verifyRole], function(req, res) {
    let body = req.body;

    let encriptedPassword = '';

    if (body.password) {
        if ((body.password).length < 8) {
            return res.status(406).json({
                ok: false,
                err: 'Password must contain at least 8 characters'
            })
        } else {
            encriptedPassword = bcrypt.hashSync(body.password, 10);
        }
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
            });
        }

        res.json({
            ok: true,
            user: userDB
        })

    });
})

app.put('/user/:id', [verifyToken, verifyRole], function(req, res) {
    let id = req.params.id;
    let body = _.pick(req.body, ['name', 'email', 'img', 'role', 'status']);
    let options = {
        new: true,
        runValidators: true,
        context: 'query'
    }

    User.findByIdAndUpdate(id, body, options, (err, userDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (userDB === null) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'User not found'
                }
            });
        }

        res.json({
            ok: true,
            user: userDB
        });
    })




})

app.delete('/user/:id', [verifyToken, verifyRole], function(req, res) {
    let id = req.params.id;
    let changeStatus = {
        status: false
    }

    User.findByIdAndUpdate(id, changeStatus, (err, deletedUser) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (deletedUser === null) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'User not found'
                }
            });
        }

        res.json({
            ok: true,
            user: {
                message: `User ${deletedUser.name} was deleted`
            }
        });

    });
})


module.exports = app;